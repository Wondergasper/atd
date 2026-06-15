import React from 'react';
import { 
  Fingerprint, CheckCircle, AlertTriangle, XCircle, ShieldAlert, Laptop, ArrowRight 
} from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

import { biometricService } from '../services/api';

export default function KioskPortal({ 
  students, 
  kioskState, 
  setKioskState, 
  kioskVerifiedStudent, 
  setKioskVerifiedStudent, 
  setRosterList, 
  onExit 
}) {
  const { scannerConnection, triggerBiometricTest, capturedTemplate } = useScanner();

  const handleKioskScanTrigger = () => {
    if (scannerConnection === 'disconnected') {
      setKioskState('error');
      return;
    }
    setKioskState('scanning');
    triggerBiometricTest();
  };

  // Effect to handle verification once template is captured
  React.useEffect(() => {
    if (kioskState === 'scanning' && capturedTemplate) {
      const verify = async () => {
        try {
          const result = await biometricService.verify({
            template_data: capturedTemplate,
            device_id: 1 // Placeholder
          });

          if (result.matched) {
            // Find student in our local list for display
            const student = students.find(s => s.id === result.student_id);
            setKioskVerifiedStudent(student);
            setKioskState('success');
            
            setRosterList(prev => prev.map(s => 
              s.id === result.student_id ? { ...s, status: 'PRESENT', time: new Date().toLocaleTimeString() } : s
            ));
          } else {
            setKioskState('failure');
          }
        } catch (error) {
          setKioskState('error');
        }
      };
      verify();
    }
  }, [capturedTemplate, kioskState]);

  return (
    <div className="kiosk-fullscreen-wrapper" style={{ backgroundColor: 'var(--primary-50)', backgroundImage: 'radial-gradient(circle at center, var(--accent-100) 0%, transparent 70%)' }}>
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
        <button className="btn btn-secondary flex items-center gap-2 border-0 bg-white/50 backdrop-blur-md" onClick={onExit}>
          <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> 
          <span className="font-mono text-xs uppercase tracking-widest font-bold">Exit Terminal</span>
        </button>
      </div>

      {kioskState === 'idle' && (
        <div className="portal-glass-card flex flex-col items-center max-w-xl text-center" onClick={handleKioskScanTrigger}>
          <div className="kiosk-giant-badge success animate-pulse-ring mb-8" style={{ width: '100px', height: '100px', backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)', border: '1px solid var(--accent-600)/20' }}>
            <Fingerprint size={54} />
          </div>
          <span className="badge badge-warning font-mono mb-4 px-4 text-[11px] tracking-tighter border border-accent-600/20">
            SYSTEM STANDBY • READY FOR BIOMETRIC CAPTURE
          </span>
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary-950)' }}>IDENTIFY TO PROCEED</h2>
          <p className="text-muted text-lg max-w-sm">Place your right index finger firmly on the biometric scanner window to record your session presence.</p>
          
          <div className="w-full mt-10 pt-8 border-t border-light flex justify-center items-center gap-4 text-dim">
             <Laptop size={18} className="text-accent-600" />
             <span className="font-mono text-xs uppercase tracking-widest">Scanner ID: NODE-04A (LIVE)</span>
          </div>
        </div>
      )}

      {kioskState === 'scanning' && (
        <div className="portal-glass-card flex flex-col items-center max-w-xl text-center">
          <div className="fingerprint-scanner-window active" style={{ width: '180px', height: '220px' }}>
            <div className="scanner-beam" style={{ height: '3px' }}></div>
            <Fingerprint size={96} className="text-accent-600 opacity-20" />
          </div>
          <h2 className="text-3xl font-bold animate-pulse" style={{ color: 'var(--primary-950)' }}>SYNCHRONIZING TEMPLATE</h2>
          <p className="text-muted mt-4 font-mono text-sm tracking-tight">Accessing Central Registry Database...</p>
        </div>
      )}

      {kioskState === 'success' && (
        <div className="portal-glass-card flex flex-col items-center max-w-xl text-center border-success-600 shadow-[0_0_80px_rgba(16,185,129,0.1)]">
          <div className="kiosk-giant-badge success mb-8" style={{ width: '100px', height: '100px', backgroundColor: 'var(--success-100)', color: 'var(--success-600)', border: '2px solid var(--success-600)' }}>
            <CheckCircle size={54} />
          </div>
          <span className="badge badge-success font-mono mb-4 px-6 text-[11px] tracking-widest uppercase">Verification Confirmed</span>
          <h2 className="text-5xl font-bold mb-4" style={{ color: 'var(--primary-950)' }}>{kioskVerifiedStudent?.name}</h2>
          <span className="font-mono text-xl text-muted mb-8 tracking-tighter">{kioskVerifiedStudent?.matric}</span>
          
          <div className="w-full mt-6 p-4 rounded-xl bg-success-100/50 border border-success-600/20 text-success-600 font-bold">
            SESSION RECORDED • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          
          <button className="btn btn-ghost mt-10 text-xs font-bold uppercase tracking-widest text-dim" onClick={() => setKioskState('idle')}>
            Next Student In Line →
          </button>
        </div>
      )}

      {kioskState === 'failure' && (
        <div className="portal-glass-card flex flex-col items-center max-w-xl text-center border-danger-600 shadow-[0_0_80px_rgba(239,68,68,0.1)]">
          <div className="kiosk-giant-badge danger mb-8" style={{ width: '100px', height: '100px', backgroundColor: 'var(--danger-100)', color: 'var(--danger-600)', border: '2px solid var(--danger-600)' }}>
            <XCircle size={54} />
          </div>
          <span className="badge badge-danger font-mono mb-4 px-6 text-[11px] tracking-widest uppercase">Match Failed</span>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-950)' }}>IDENTITY MISMATCH</h2>
          <p className="text-muted text-lg max-w-sm mb-10">We could not securely correlate your fingerprint with any student in the local registry.</p>
          
          <div className="flex gap-4 w-full">
            <button className="btn btn-primary flex-1 py-4 uppercase text-xs tracking-widest" style={{ backgroundColor: 'var(--danger-600)' }} onClick={() => setKioskState('idle')}>
              Retry Hardware Scan
            </button>
            <button className="btn btn-secondary flex-1 py-4 uppercase text-xs tracking-widest" onClick={() => { alert('Manual entry protocol initiated.'); setKioskState('idle'); }}>
              Manual Entry
            </button>
          </div>
        </div>
      )}

      {kioskState === 'error' && (
        <div className="portal-glass-card flex flex-col items-center max-w-xl text-center border-stone-800 bg-stone-900 shadow-2xl">
          <div className="kiosk-giant-badge danger mb-8" style={{ width: '100px', height: '100px', backgroundColor: 'var(--primary-950)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ShieldAlert size={54} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white uppercase tracking-tighter">HARDWARE DISCONNECT</h2>
          <p className="text-stone-400 text-lg max-w-sm mb-10">Central telemetry reports the Local Biometric Agent is currently unreachable.</p>
          
          <button className="btn btn-primary w-full py-4 uppercase text-xs tracking-widest bg-white text-stone-900 border-0" onClick={() => setKioskState('idle')}>
            Initialize Diagnostics
          </button>
        </div>
      )}

      <div className="kiosk-footer-note text-dim font-mono text-xs">
        <span>[SYSTEM ACTIVE NODE]</span>
      </div>
    </div>
  );
}
