import React from 'react';
import { Fingerprint } from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

export default function ScannerWindow({ onClick }) {
  const { scanState, scannerMessage, qualityScore } = useScanner();

  return (
    <div className="fingerprint-panel-card">
      <div 
        className={`fingerprint-scanner-window ${scanState === 'scanning' ? 'active-scanning' : scanState === 'success' ? 'success-lock' : scanState === 'error' ? 'error-state' : ''}`}
        onClick={onClick}
      >
        <div className="scanner-beam"></div>
        <Fingerprint size={84} className="fingerprint-graphic" />
      </div>
      <span style={{ fontWeight: 600, fontSize: '18px', color: '#FFFFFF' }}>
        {scanState === 'scanning' ? 'Scanning...' : scanState === 'success' ? 'Scan Accepted!' : scanState === 'error' ? 'Scan Failed' : 'Click Window to Scan Finger'}
      </span>
      <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '8px', textAlign: 'center', maxWidth: '320px' }}>
        {scannerMessage}
      </p>

      {qualityScore > 0 && (
        <div className="quality-progress-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>NFIQ 2 Quality Score</span>
            <span style={{ fontWeight: 'bold', color: qualityScore >= 60 ? 'var(--success-600)' : 'var(--danger-600)' }}>
              {qualityScore}% {qualityScore >= 60 ? '(Pass)' : '(Fail)'}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${qualityScore}%`, 
                backgroundColor: qualityScore >= 60 ? 'var(--success-600)' : 'var(--danger-600)' 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
