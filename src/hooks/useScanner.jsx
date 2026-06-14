import React, { createContext, useContext, useState } from 'react';

const ScannerContext = createContext(null);

export function ScannerProvider({ children }) {
  const [scannerConnection, setScannerConnection] = useState('connected'); // connected, disconnected, calibrating
  const [scannerMessage, setScannerMessage] = useState('Device ready for biometric capture.');
  const [scanState, setScanState] = useState('idle'); // idle, scanning, success, error
  const [qualityScore, setQualityScore] = useState(0);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [testResult, setTestResult] = useState(null);

  const triggerEnrollmentScan = (activeStudent, onComplete) => {
    if (enrollmentProgress >= 4) return;
    setScanState('scanning');
    setScannerMessage('Scanning index finger... keep finger still');
    
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 38) + 58; // 58 to 96
      setQualityScore(mockScore);
      
      if (mockScore >= 60) {
        setScanState('success');
        const nextProg = enrollmentProgress + 1;
        setEnrollmentProgress(nextProg);
        setScannerMessage(`Scan ${nextProg} of 4 captured successfully (NFIQ Score: ${mockScore}%).`);
        
        if (nextProg === 4 && onComplete) {
          onComplete(activeStudent);
        }
      } else {
        setScanState('error');
        setScannerMessage(`Poor quality print (${mockScore}%). Center finger and apply moderate pressure.`);
      }
    }, 1200);
  };

  const triggerBiometricTest = () => {
    setScanState('scanning');
    setTimeout(() => {
      const matched = Math.random() > 0.15;
      if (matched) {
        setScanState('success');
        setTestResult('success');
      } else {
        setScanState('error');
        setTestResult('failure');
      }
    }, 1200);
  };

  const resetEnrollmentFrame = () => {
    setScanState('idle');
    setQualityScore(0);
    setTestResult(null);
  };

  const resetProgress = () => {
    setEnrollmentProgress(0);
    resetEnrollmentFrame();
  };

  return (
    <ScannerContext.Provider value={{
      scannerConnection, setScannerConnection,
      scannerMessage, setScannerMessage,
      scanState, setScanState,
      qualityScore, setQualityScore,
      enrollmentProgress, setEnrollmentProgress,
      testResult, setTestResult,
      triggerEnrollmentScan,
      triggerBiometricTest,
      resetEnrollmentFrame,
      resetProgress
    }}>
      {children}
    </ScannerContext.Provider>
  );
}

export function useScanner() {
  const context = useContext(ScannerContext);
  if (!context) {
    throw new Error('useScanner must be used within a ScannerProvider');
  }
  return context;
}
