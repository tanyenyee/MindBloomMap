import React from 'react';

export default function HarassmentWarningModal({ analysis, onClose, type = "post" }) {
  return (
    <div className="modal-overlay">
      <div className="harassment-warning-modal">
        <button className="close-x-btn" onClick={onClose}>✕</button>
        
        <div className="warning-header">
          <span className="warning-icon">⚠️</span>
          <h3>Potential Harassment Detected</h3>
        </div>

        <div className="ai-detection-box">
          <div className="ai-icon">🤖</div>
          <div className="ai-info">
            <h4>AI Harassment Detection</h4>
            <ul className="detection-details">
              <li>• Toxicity Score: <strong>{analysis.score}%</strong></li>
              <li>• Severity: <strong>{analysis.severity}</strong></li>
            </ul>
          </div>
        </div>

        <div className="flagged-words-section">
          <p className="section-label">Flagged Words:</p>
          <div className="flagged-words-list">
            {analysis.flaggedWords && analysis.flaggedWords.map((word, index) => (
              <span key={index} className="flagged-word-chip">
                "{word}"
              </span>
            ))}
          </div>
        </div>

        <p className="warning-message">
          Please rewrite your {type} using supportive and respectful language. 
          Our community thrives on kindness and mutual respect.  🌸
        </p>
      </div>
    </div>
  );
}