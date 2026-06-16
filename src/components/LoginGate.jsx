import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginGate({ portalTitle, primaryColor, onSubmit, onCancel, role = 'Admin' }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        await authService.signup({
          username,
          email,
          password,
          full_name: fullName,
          role
        });
        alert('Account created successfully. Please login.');
        setIsSignup(false);
      } else {
        const data = await authService.login({ username, password });
        localStorage.setItem('token', data.access_token);
        onSubmit();
      }
    } catch (err) {
      setError(isSignup ? `Signup failed: ${err.message}` : 'Invalid username or password');
    }
  };

  return (
    <div className="portal-login-canvas">
      <div className="portal-login-box">
        <div className="portal-login-header">
          <div className="portal-login-icon-frame" style={{ border: `1px solid ${primaryColor}40` }}>
            <ShieldCheck size={32} style={{ color: primaryColor }} />
          </div>
          <span className="badge badge-warning font-mono mb-4 px-3 text-[10px] tracking-widest border border-accent-600/20">
            {isSignup ? 'NEW REGISTRATION' : 'SECURE GATEWAY'} • IDENTITY-01
          </span>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{portalTitle}</h2>
          <p className="text-sm text-dim">{isSignup ? 'Register a new administrative operator account.' : 'Restricted access protocol. Authenticate to proceed.'}</p>
        </div>
        
        <form onSubmit={handleLocalSubmit}>
          {error && <div className="badge badge-danger w-full mb-6 justify-center py-2 font-bold">{error}</div>}
          
          {isSignup && (
            <div className="form-group mb-6">
              <label className="font-mono text-[11px] uppercase tracking-wider text-accent-600">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Admin Victor" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/50"
              />
            </div>
          )}

          {isSignup && (
            <div className="form-group mb-6">
              <label className="font-mono text-[11px] uppercase tracking-wider text-accent-600">Email Address</label>
              <input 
                type="email" 
                placeholder="v.admin@university.edu" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50"
              />
            </div>
          )}

          <div className="form-group mb-6">
            <label htmlFor="login-user" className="font-mono text-[11px] uppercase tracking-wider text-accent-600">Username</label>
            <input 
              type="text" 
              id="login-user" 
              placeholder="e.g. admin_vance" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/50"
            />
          </div>
          
          <div className="form-group mb-8">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="login-pass" className="font-mono text-[11px] uppercase tracking-wider text-accent-600 mb-0">Secret Password</label>
              {!isSignup && <a href="#forgot" className="text-xs font-bold" style={{ color: primaryColor, textDecoration: 'none' }}>Recovery?</a>}
            </div>
            <input 
              type="password" 
              id="login-pass" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-4 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-3" 
            style={{ backgroundColor: 'var(--primary-950)' }}
          >
            {isSignup ? 'Create Account' : 'Authorize Session'} <ArrowRight size={16} />
          </button>

          <div className="flex flex-col gap-2 mt-6">
            <button 
              type="button" 
              className="btn btn-ghost w-full text-xs font-bold text-accent-600" 
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Already have an account? Login' : 'No account? Create one'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-ghost w-full text-xs font-bold text-dim" 
              onClick={onCancel}
            >
              ← Back to Portal Select
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
