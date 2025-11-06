import React, { useState } from 'react';
import './App.css';
import VideoUpload from './components/VideoUpload';
import ManualDisplay from './components/ManualDisplay';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [manual, setManual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const handleManualGenerated = (generatedManual) => {
    setManual(generatedManual);
    setLoading(false);
  };

  const handleReset = () => {
    setManual(null);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📹 動画手順書生成アプリ</h1>
        <p className="subtitle">動画から自動で手順書を作成</p>
      </header>

      <main className="App-main">
        {loading ? (
          <LoadingScreen message={loadingMessage} />
        ) : manual ? (
          <ManualDisplay manual={manual} onReset={handleReset} />
        ) : (
          <VideoUpload
            onManualGenerated={handleManualGenerated}
            onLoading={(isLoading, message) => {
              setLoading(isLoading);
              setLoadingMessage(message);
            }}
            onError={handleError}
          />
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="dismiss-btn">
              閉じる
            </button>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Powered by Gemini AI | iPhone・Android対応</p>
      </footer>
    </div>
  );
}

export default App;
