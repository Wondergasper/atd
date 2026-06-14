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
          <Laptop size={14} style={{ marginLeft: '4px', marginRight: '4px' }} />
          <span>Scanner: {scannerConnection === 'connected' ? 'HID Driver Online' : scannerConnection === 'disconnected' ? 'Driver Offline' : 'Calibrating'}</span>
        </div>
      </div>

      <div className="landing-banner">
        <div className="landing-branding">
          <Fingerprint size={44} style={{ color: '#3B82F6' }} />
          <h2>University Biometric Attendance Workspace</h2>
        </div>
        <p style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', color: '#3B82F6', fontWeight: 700, marginBottom: '8px' }}>
          Apex State University • Core Systems Selector
        </p>
        <p style={{ margin: '0' }}>Select an administrative portal, capture terminal, or academic monitor to authenticate and launch.</p>
      </div>

      <div className="landing-grid">
        {/* Card 1: Registration Portal */}
        <div className="landing-card" onClick={() => onLaunchPortal('portal_1')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
