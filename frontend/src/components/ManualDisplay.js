import React, { useState } from 'react';
import './ManualDisplay.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ManualDisplay({ manual, onReset }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${manual.title || '手順書'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateTextContent = () => {
    let content = `${manual.title}\n`;
    content += '='.repeat(manual.title.length) + '\n\n';
    content += `【概要】\n${manual.overview}\n\n`;

    if (manual.requirements && manual.requirements.length > 0) {
      content += '【必要なもの】\n';
      manual.requirements.forEach(req => {
        content += `- ${req}\n`;
      });
      content += '\n';
    }

    content += '【手順】\n\n';
    manual.steps.forEach(step => {
      content += `ステップ ${step.stepNumber}: ${step.title}\n`;
      content += `${step.description}\n`;
      if (step.notes) {
        content += `⚠️ ${step.notes}\n`;
      }
      content += '\n';
    });

    return content;
  };

  const getImageUrl = (imageIndex) => {
    if (!manual.frames || !manual.frames[imageIndex - 1]) {
      return null;
    }
    return `${API_URL}${manual.frames[imageIndex - 1].url}`;
  };

  return (
    <div className="manual-display">
      <div className="manual-header">
        <button onClick={onReset} className="back-btn">
          ← 戻る
        </button>
        <div className="header-actions">
          <button onClick={handlePrint} className="action-btn print-btn">
            🖨️ 印刷
          </button>
          <button onClick={handleDownload} className="action-btn download-btn">
            💾 ダウンロード
          </button>
        </div>
      </div>

      <div className="manual-content">
        <div className="manual-title-section">
          <h1>{manual.title}</h1>
          <div className="success-badge">
            ✅ 手順書が生成されました
          </div>
        </div>

        <section className="manual-section">
          <h2>📋 概要</h2>
          <p className="overview-text">{manual.overview}</p>
        </section>

        {manual.requirements && manual.requirements.length > 0 && (
          <section className="manual-section">
            <h2>🔧 必要なもの</h2>
            <ul className="requirements-list">
              {manual.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="manual-section">
          <h2>📝 手順</h2>
          <div className="steps-container">
            {manual.steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-header">
                  <span className="step-number">ステップ {step.stepNumber}</span>
                  <h3>{step.title}</h3>
                </div>

                <div className="step-content">
                  <p className="step-description">{step.description}</p>

                  {step.imageIndices && step.imageIndices.length > 0 && (
                    <div className="step-images">
                      {step.imageIndices.map((imageIndex, idx) => {
                        const imageUrl = getImageUrl(imageIndex);
                        return imageUrl ? (
                          <div
                            key={idx}
                            className="step-image-container"
                            onClick={() => setSelectedImage(imageUrl)}
                          >
                            <img
                              src={imageUrl}
                              alt={`ステップ ${step.stepNumber} - 画像 ${imageIndex}`}
                              className="step-image"
                            />
                            <span className="image-label">画像 {imageIndex}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  {step.notes && (
                    <div className="step-notes">
                      <span className="notes-icon">⚠️</span>
                      <span>{step.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {manual.frames && manual.frames.length > 0 && (
          <section className="manual-section">
            <h2>🎞️ 全ての画像</h2>
            <div className="all-frames">
              {manual.frames.map((frame, index) => (
                <div
                  key={index}
                  className="frame-thumbnail"
                  onClick={() => setSelectedImage(`${API_URL}${frame.url}`)}
                >
                  <img
                    src={`${API_URL}${frame.url}`}
                    alt={`フレーム ${frame.index}`}
                  />
                  <span>{frame.index}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Image modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage} alt="拡大画像" />
          </div>
        </div>
      )}

      <div className="manual-footer">
        <button onClick={onReset} className="new-manual-btn">
          ✨ 新しい手順書を作成
        </button>
      </div>
    </div>
  );
}

export default ManualDisplay;
