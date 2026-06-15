import React from 'react';
import { LogOut, X } from 'lucide-react';
import { useScanner } from '../hooks/useScanner';

export default function Sidebar({
  menuItems,
  portalName,
  profileName,
  profileRole,
  portalId,
  activeScreen,
  setActiveScreen,
  onLogout,
  isOpen,
  setIsOpen
}) {
  const { scannerConnection } = useScanner();

  return (
    <aside className={`portal-sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="sidebar-header flex justify-between items-center">
          <h3>{portalName}</h3>
          <button 
            className="btn btn-ghost p-1 md-hidden" 
            onClick={() => setIsOpen(false)}
            style={{ color: 'white' }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-profile mb-6">
          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${portalId}`} alt="Profile Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div className="profile-info">
            <span className="profile-name">{profileName}</span>
            <span className="profile-role">{profileRole}</span>
          </div>
        </div>
        
        <ul className="sidebar-menu">
          {menuItems.map(item => {
            const IconComp = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`sidebar-item w-full text-left ${activeScreen === item.id || (item.id === 'courses' && activeScreen === 'course-details') ? 'active' : ''}`}
                  onClick={() => setActiveScreen(item.id)}
                  style={{ background: 'none', border: 'none' }}
                >
                  <IconComp size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <div className="device-status-badge mb-4">
          <span className={`status-dot ${scannerConnection === 'connected' ? 'connected' : scannerConnection === 'disconnected' ? 'disconnected' : 'calibrating'}`}></span>
          <span className="text-xs">Sensor: {scannerConnection === 'connected' ? 'Connected' : scannerConnection === 'disconnected' ? 'Offline' : 'Calibration'}</span>
        </div>
        <button 
          className="sidebar-item w-full text-left" 
          onClick={onLogout}
          style={{ background: 'none', border: 'none', color: '#EF4444' }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
