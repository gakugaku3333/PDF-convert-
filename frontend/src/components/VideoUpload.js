import React, { useState, useRef } from 'react';
import axios from 'axios';
import './VideoUpload.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function VideoUpload({ onManualGenerated, onLoading, onError }) {
  const [topic, setTopic] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Start recording video
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: 'video/webm'
        });
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(blob));

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      onError('カメラへのアクセスに失敗しました。ブラウザの権限を確認してください。');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit video for processing
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      onError('動画を選択または録画してください');
      return;
    }

    if (!topic.trim()) {
      onError('手順書のテーマを入力してください');
      return;
    }

    try {
      onLoading(true, '動画をアップロード中...');

      // Upload video
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('topic', topic);

      const uploadResponse = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { videoId, filename } = uploadResponse.data;

      onLoading(true, '動画からフレームを抽出中...');

      // Process video to extract frames
      const processResponse = await axios.post(`${API_URL}/api/process`, {
        videoId,
        filename,
        topic
      });

      const { frames } = processResponse.data;

      onLoading(true, 'AIが手順書を生成中... (数秒かかります)');

      // Generate manual using Gemini AI
      const manualResponse = await axios.post(`${API_URL}/api/generate-manual`, {
        videoId,
        frames,
        topic
      });

      onManualGenerated(manualResponse.data.manual);

      // Cleanup uploaded files (optional)
      // await axios.delete(`${API_URL}/api/cleanup/${videoId}`);

    } catch (error) {
      console.error('Error processing video:', error);
      const errorMessage = error.response?.data?.error || error.message || '処理中にエラーが発生しました';
      onError(errorMessage);
    }
  };

  return (
    <div className="video-upload">
      <div className="upload-card">
        <h2>動画から手順書を作成</h2>
        <p className="description">
          スマートフォンで作業手順を撮影し、AIが自動で分かりやすい手順書を生成します
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic">手順書のテーマ</label>
            <input
              type="text"
              id="topic"
              placeholder="例: コーヒーの淹れ方、機器の操作方法など"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>動画を選択</label>

            {/* Recording section */}
            <div className="recording-section">
              {isRecording ? (
                <div className="recording-active">
                  <video ref={videoRef} className="camera-preview" playsInline muted />
                  <button
                    type="button"
                    className="stop-btn"
                    onClick={stopRecording}
                  >
                    ⏹️ 録画停止
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="record-btn"
                  onClick={startRecording}
                >
                  📹 動画を録画する
                </button>
              )}
            </div>

            <div className="divider">
              <span>または</span>
            </div>

            {/* File upload */}
            <div className="file-upload">
              <input
                type="file"
                id="video-file"
                accept="video/*"
                onChange={handleFileChange}
                capture="environment"
              />
              <label htmlFor="video-file" className="file-label">
                📁 ファイルから選択
              </label>
            </div>

            {/* Video preview */}
            {videoPreview && (
              <div className="video-preview">
                <video src={videoPreview} controls />
                <p className="file-name">
                  {videoFile?.name || 'recording.webm'}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!videoFile || !topic.trim()}
          >
            ✨ 手順書を生成する
          </button>
        </form>

        <div className="tips">
          <h3>📝 撮影のコツ</h3>
          <ul>
            <li>各手順をゆっくり、はっきりと撮影する</li>
            <li>手元がよく見えるように明るい場所で撮影する</li>
            <li>重要なポイントで一時停止してから次の動作へ</li>
            <li>スマホを横向きにして撮影すると見やすい</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
