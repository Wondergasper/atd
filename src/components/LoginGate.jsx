import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function LoginGate({ portalTitle, primaryColor, onSubmit, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="portal-login-canvas">
      <div className="portal-login-box">
        <div className="portal-login-header">
          <div className="portal-login-icon-frame" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <Lock size={28} />
          </div>
          <h2>{portalTitle}</h2>
          <p>Access restricted to authorized university personnel</p>
        </div>
        
        <form onSubmit={handleLocalSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="login-email">Identity Email</label>
            <input 
              type="email" 
              id="login-email" 
              placeholder="operator@university.edu" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="login-pass" style={{ marginBottom: '0' }}>Secret Password</label>
              <a href="#forgot" style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>Forgot?</a>
            </div>
            <input 
              type="password" 
              id="login-pass" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: primaryColor }}>
            Authenticate Credentials
          </button>

          <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }} onClick={onCancel}>
            Back to Portal Select
          </button>
        </form>
      </div>
    </div>
  );
}
