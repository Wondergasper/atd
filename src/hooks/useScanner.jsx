import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ScannerContext = createContext(null);

export function ScannerProvider({ children }) {
  const [scannerConnection, setScannerConnection] = useState('disconnected');
  const [scannerMessage, setScannerMessage] = useState('Initializing local agent connection...');
  const [scanState, setScanState] = useState('idle');
  const [qualityScore, setQualityScore] = useState(0);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [capturedTemplate, setCapturedTemplate] = useState(null);

  const socketRef = useRef(null);
  const onCompleteRef = useRef(null);
  const activeStudentRef = useRef(null);

  // Initialize WebSocket connection to Local Agent
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket('ws://localhost:8001/ws/scan');
      
      ws.onopen = () => {
        setScannerConnection('connected');
        setScannerMessage('Hardware Agent Connected. Ready for capture.');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'scanning') {
          setScanState('scanning');
          setScannerMessage(data.message);
        } else if (data.status === 'success') {
          setScanState('success');
          setQualityScore(data.quality);
          setCapturedTemplate(data.template_data);
          setScannerMessage(data.message);
          
          // Increment progress
          const nextProgress = enrollmentProgress + 1;
          setEnrollmentProgress(nextProgress);

          // If this was the final scan, trigger the callback
          if (nextProgress === 4 && onCompleteRef.current) {
            onCompleteRef.current(activeStudentRef.current, data.template_data);
          }
        } else if (data.status === 'error') {
          setScanState('error');
          setScannerMessage(data.message);
        }
      };

      ws.onclose = () => {
        setScannerConnection('disconnected');
        setScannerMessage('Hardware Agent Offline. Please start the Biometric Agent.');
        // Try to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };

      socketRef.current = ws;
    };

    connect();
    return () => socketRef.current?.close();
  }, [enrollmentProgress]);

  const triggerEnrollmentScan = (activeStudent, onComplete) => {
    if (enrollmentProgress >= 4) return;
    
    // Store callback and student for when scan completes
    onCompleteRef.current = onComplete;
    activeStudentRef.current = activeStudent;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ command: 'START_SCAN' }));
    } else {
      alert("Local Biometric Agent is not connected.");
    }
  };

  // Special effect to trigger callback when 4 scans are done
  useEffect(() => {
    if (enrollmentProgress === 4 && capturedTemplate) {
        // This will be handled by the portal's logic
    }
  }, [enrollmentProgress, capturedTemplate]);

  const triggerBiometricTest = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ command: 'START_SCAN' }));
    }
  };

  const resetEnrollmentFrame = () => {
    setScanState('idle');
    setQualityScore(0);
    setTestResult(null);
    setCapturedTemplate(null);
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
      capturedTemplate,
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
