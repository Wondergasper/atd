import React from 'react';
import { 
  Fingerprint, CheckCircle, AlertTriangle, XCircle, ShieldAlert, Laptop, ArrowRight 
} from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

export default function KioskPortal({ 
  students, 
  kioskState, 
  setKioskState, 
  kioskVerifiedStudent, 
  setKioskVerifiedStudent, 
  setRosterList, 
  onExit 
}) {
  const { scannerConnection, setScannerConnection } = useScanner();

  const triggerKioskScan = () => {
    if (scannerConnection === 'disconnected') {
      setKioskState('error');
      return;
    }
    setKioskState('scanning');
    
    setTimeout(() => {
      const seed = Math.random();
      if (seed < 0.7) {
        const student = students[Math.floor(Math.random() * students.length)];
        setKioskVerifiedStudent(student);
        setKioskState('success');
        
        setRosterList(prev => prev.map(s => 
          s.matric === student.matric ? { ...s, status: 'PRESENT', time: '08:34 AM' } : s
        ));
      } else if (seed < 0.88) {
        const student = students[Math.floor(Math.random() * students.length)];
        setKioskVerifiedStudent(student);
        setKioskState('duplicate');
      } else {
        setKioskState('failure');
      }
    }, 1500);
  };

  return (
    <div className="kiosk-fullscreen-wrapper">
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <button className="kiosk-exit-btn" onClick={onExit}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Exit Terminal
        </button>
      </div>

      {kioskState === 'idle' && (
        <div className="kiosk-card" onClick={triggerKioskScan}>
          <div className="kiosk-giant-badge success animate-pulse-ring">
            <Fingerprint size={48} />
          </div>
          <span className="kiosk-headline">PLACE FINGER TO CHECK IN</span>
          <span className="kiosk-subhead">Please hold your index finger on the fingerprint scanner window.</span>
          
          <div style={{ width: '100%', maxWidth: '320px', borderTop: '1px solid #334155', paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '14px' }}>
              <Laptop size={16} />
              <span>Scanner active & waiting...</span>
            </div>
          </div>
        </div>
      )}

      {kioskState === 'scanning' && (
        <div className="kiosk-card">
          <div className="fingerprint-scanner-window active-scanning" style={{ margin: '0 0 24px 0' }}>
            <div className="scanner-beam"></div>
            <Fingerprint size={84} className="fingerprint-graphic" />
          </div>
          <span className="kiosk-headline animate-pulse">SCANNING FINGERPRINT</span>
          <span className="kiosk-subhead" style={{ marginBottom: '0' }}>Comparing templates against database... keep finger still</span>
        </div>
      )}

      {kioskState === 'success' && (
        <div className="kiosk-card success-border">
          <div className="kiosk-giant-badge success">
            <CheckCircle size={48} />
          </div>
          <span className="kiosk-headline" style={{ color: 'var(--success-600)' }}>ATTENDANCE RECORDED!</span>
          <span style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{kioskVerifiedStudent?.name}</span>
          <span style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '24px' }}>{kioskVerifiedStudent?.matric}</span>
          <span className="badge badge-success" style={{ padding: '4px 16px', fontSize: '14px' }}>
            Verified Successfully (08:34 AM)
          </span>
        </div>
      )}

      {kioskState === 'duplicate' && (
        <div className="kiosk-card warning-border">
          <div className="kiosk-giant-badge warning">
            <AlertTriangle size={48} />
          </div>
          <span className="kiosk-headline" style={{ color: 'var(--warning-600)' }}>ALREADY CHECKED IN</span>
          <span style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{kioskVerifiedStudent?.name}</span>
          <span style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '24px' }}>{kioskVerifiedStudent?.matric}</span>
          <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '380px', margin: '0' }}>
            Your attendance has already been logged. No duplicate check-in required.
          </p>
        </div>
      )}

      {kioskState === 'failure' && (
        <div className="kiosk-card danger-border">
          <div className="kiosk-giant-badge danger">
            <XCircle size={48} />
          </div>
          <span className="kiosk-headline" style={{ color: 'var(--danger-600)' }}>VERIFICATION FAILED</span>
          <span className="kiosk-subhead">We could not match your fingerprint template.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-primary btn-danger" onClick={() => setKioskState('idle')}>
              Try Scanning Again
            </button>
            <button className="btn btn-secondary" onClick={() => { alert('Manual Entry.'); setKioskState('idle'); }} style={{ color: '#FFFFFF', borderColor: '#475569', backgroundColor: '#334155' }}>
              Enter ID Manually
            </button>
          </div>
        </div>
      )}

      {kioskState === 'error' && (
        <div className="kiosk-card danger-border" style={{ backgroundColor: '#7F1D1D', borderColor: '#DC2626' }}>
          <div className="kiosk-giant-badge danger" style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}>
            <ShieldAlert size={48} />
          </div>
          <span className="kiosk-headline" style={{ color: '#FFFFFF' }}>SCANNER OFFLINE</span>
          <p style={{ color: '#FECACA', fontSize: '14px', maxWidth: '380px' }}>
            Local client websocket reporting connectivity drop. Please contact the ICT helpdesk.
          </p>
          <button className="btn btn-secondary" onClick={() => setKioskState('idle')} style={{ marginTop: '24px', backgroundColor: '#FFFFFF', color: '#7F1D1D' }}>
            Dismiss
          </button>
        </div>
      )}

      <div className="kiosk-footer-note">
        <span>[Click canvas to simulate scanning a finger]</span>
        <span style={{ color: '#475569' }}>|</span>
        <button 
          onClick={() => { setScannerConnection(prev => prev === 'connected' ? 'disconnected' : 'connected'); }}
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Simulate Disconnect
        </button>
      </div>
    </div>
  );
}
