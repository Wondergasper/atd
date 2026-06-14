import React from 'react';
import { LogOut } from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

export default function Sidebar({
  menuItems,
  portalName,
  profileName,
  profileRole,
  portalId,
  activeScreen,
  setActiveScreen,
  onLogout
}) {
  const { scannerConnection } = useScanner();

  return (
    <aside className="portal-sidebar">
      <div>
        <div className="sidebar-header">
          <h3>{portalName}</h3>
          <div className="sidebar-profile">
            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${portalId}`} alt="Profile Avatar" />
            <div className="profile-info">
              <span className="profile-name">{profileName}</span>
              <span className="profile-role">{profileRole}</span>
            </div>
          </div>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map(item => {
            const IconComp = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`sidebar-item ${activeScreen === item.id || (item.id === 'courses' && activeScreen === 'course-details') ? 'active' : ''}`}
                  onClick={() => setActiveScreen(item.id)}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <IconComp size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <div className="device-status-badge" style={{ marginBottom: '16px' }}>
          <span className={`status-dot ${scannerConnection === 'connected' ? 'connected' : scannerConnection === 'disconnected' ? 'disconnected' : 'calibrating'}`}></span>
          <span>Sensor: {scannerConnection === 'connected' ? 'Connected' : scannerConnection === 'disconnected' ? 'Offline' : 'Calibration'}</span>
        </div>
        <button 
          className="sidebar-item" 
          onClick={onLogout}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#EF4444' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
