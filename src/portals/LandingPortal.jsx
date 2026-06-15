import React, { useEffect } from 'react';
import { Fingerprint, UserCheck, Users, Sparkles, ArrowRight, Laptop } from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

export default function LandingPortal({ onLaunchPortal }) {
  const { scannerConnection } = useScanner();

  // Support hotkeys 1, 2, 3, 4 to launch portals directly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1') onLaunchPortal('portal_1');
      if (e.key === '2') onLaunchPortal('portal_2');
      if (e.key === '3') onLaunchPortal('portal_3');
      if (e.key === '4') onLaunchPortal('portal_4');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLaunchPortal]);

  return (
    <div className="landing-layout">
      {/* Top Telemetry Header */}
      <div className="landing-top-bar">
        <div className="landing-device-pill">
          <span className={`status-dot ${scannerConnection === 'connected' ? 'connected' : scannerConnection === 'disconnected' ? 'disconnected' : 'calibrating'}`}></span>
          <Laptop size={14} className="mx-1" />
          <span>Scanner: {scannerConnection === 'connected' ? 'HID Driver Online' : scannerConnection === 'disconnected' ? 'Driver Offline' : 'Calibrating'}</span>
        </div>
      </div>

      <div className="landing-banner">
        <div className="landing-branding flex items-center justify-center gap-4 mb-6">
          <Fingerprint size={64} className="text-accent-600" />
          <h2 className="font-bold">BIOMETRIC SUITE</h2>
        </div>
        <div className="flex flex-col items-center">
          <span className="badge badge-warning font-mono mb-4 px-4 py-1 text-xs tracking-widest border border-accent-600/30">
            APEX STATE UNIVERSITY • SECURE NODE v4.0
          </span>
          <p className="text-lg text-primary-500 max-w-lg">
            High-fidelity biometric identity management and attendance forecasting system.
          </p>
        </div>
      </div>

      <div className="landing-grid">
        {/* Card 1: Registration Portal */}
        <div className="landing-card" onClick={() => onLaunchPortal('portal_1')}>
          <div className="flex justify-between items-start">
            <div className="landing-card-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#60A5FA' }}>
              <UserCheck size={26} />
            </div>
            <kbd className="kbd-badge">1</kbd>
          </div>
          <h3>Enrollment Portal</h3>
          <p>Register student profiles, verify biometric consent forms, and capture template datasets using HID scanners.</p>
          <div className="landing-card-footer">
            <span>Launch Registry Portal</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 2: Attendance Kiosk */}
        <div className="landing-card" onClick={() => onLaunchPortal('portal_2')}>
          <div className="flex justify-between items-start">
            <div className="landing-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34D399' }}>
              <Fingerprint size={26} />
            </div>
            <kbd className="kbd-badge">2</kbd>
          </div>
          <h3>Attendance Kiosk</h3>
          <p>Self-service student verification terminal. Touchscreen-friendly interface for classrooms check-ins.</p>
          <div className="landing-card-footer">
            <span>Launch Kiosk Terminal</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 3: Lecturer Portal */}
        <div className="landing-card" onClick={() => onLaunchPortal('portal_3')}>
          <div className="flex justify-between items-start">
            <div className="landing-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#FBBF24' }}>
              <Users size={26} />
            </div>
            <kbd className="kbd-badge">3</kbd>
          </div>
          <h3>Lecturer Portal</h3>
          <p>View courses, monitor student participation averages, override attendance states, and download reports.</p>
          <div className="landing-card-footer">
            <span>Launch Lecturer Portal</span>
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Card 4: Admin Portal */}
        <div className="landing-card" onClick={() => onLaunchPortal('portal_4')}>
          <div className="flex justify-between items-start">
            <div className="landing-card-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
              <Sparkles size={26} />
            </div>
            <kbd className="kbd-badge">4</kbd>
          </div>
          <h3>Admin Command</h3>
          <p>Monitor scanner status latency, manage user roles, audit logs, and access AI absenteeism forecasting models.</p>
          <div className="landing-card-footer">
            <span>Launch Control Board</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        <span>Enterprise Biometric Suite v2.6.4</span>
        <span>•</span>
        <span>Driver Version v4.5.12.0</span>
      </footer>
    </div>
  );
}
