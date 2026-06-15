import React from 'react';
import { Fingerprint } from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

export default function ScannerWindow({ onClick }) {
  const { scanState, scannerMessage, qualityScore } = useScanner();

  return (
    <div className="fingerprint-panel-card">
      <div 
        className={`fingerprint-scanner-window ${scanState === 'scanning' ? 'active' : scanState === 'success' ? 'success' : scanState === 'error' ? 'error' : ''}`}
        onClick={onClick}
      >
        {scanState === 'scanning' && <div className="scanner-beam"></div>}
        <Fingerprint size={84} className={`fingerprint-graphic transition-colors ${scanState === 'success' ? 'text-success-600' : scanState === 'error' ? 'text-danger-600' : 'text-primary-800'}`} />
      </div>
      <h3 className="mt-4 text-white">
        {scanState === 'scanning' ? 'Scanning...' : scanState === 'success' ? 'Scan Accepted!' : scanState === 'error' ? 'Scan Failed' : 'Ready to Scan'}
      </h3>
      <p className="text-dim text-center mt-2 max-w-xs">
        {scannerMessage}
      </p>

      {qualityScore > 0 && (
        <div className="quality-progress-wrapper w-full mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>NFIQ 2 Quality Score</span>
            <span className={`font-bold ${qualityScore >= 60 ? 'text-success-600' : 'text-danger-600'}`}>
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
