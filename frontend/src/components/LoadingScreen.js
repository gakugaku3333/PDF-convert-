import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ message }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-inner"></div>
        </div>
        <h2>処理中...</h2>
        <p>{message || 'しばらくお待ちください'}</p>
        <div className="loading-steps">
          <div className="step">
            <span className="step-icon">📹</span>
            <span>動画アップロード</span>
          </div>
          <div className="step">
            <span className="step-icon">🎞️</span>
            <span>フレーム抽出</span>
          </div>
          <div className="step">
            <span className="step-icon">🤖</span>
            <span>AI分析</span>
          </div>
          <div className="step">
            <span className="step-icon">📝</span>
            <span>手順書生成</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
