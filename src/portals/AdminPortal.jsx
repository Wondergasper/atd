import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, User, Users, Laptop, Sparkles, Database, Settings, 
  Plus, CheckCircle, AlertTriangle, X, Shield, Lock, Key, Menu
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { authService, api } from '../services/api';

export default function AdminPortal({
  students,
  setStudents,
  devices,
  setDevices,
  activeScreen,
  setActiveScreen,
  onLogout,
  showAddDeviceModal,
  setShowAddDeviceModal,
  newDeviceForm,
  setNewDeviceForm,
  selectedRiskStudent,
  setSelectedRiskStudent,
  handleAddDeviceSubmit,
  isSidebarOpen,
  setIsSidebarOpen
}) {
  const [staffList, setStaffList] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({ username: '', email: '', password: '', full_name: '', role: 'Lecturer' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  // Fetch staff list when 'users' screen is active
  useEffect(() => {
    if (activeScreen === 'users') {
      const fetchStaff = async () => {
        setLoading(true);
        try {
          const data = await authService.getUsers();
          setStaffList(data);
        } catch (error) {
          console.error("Failed to fetch staff:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchStaff();
    }
  }, [activeScreen]);

  // Fetch devices when 'devices' or 'dashboard' screen is active
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await api.get('/devices/');
        setDevices(response);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };
    fetchDevices();
  }, [activeScreen, setDevices]);

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects: username, email, full_name, role, password, is_active
      const payload = {
        ...newStaffForm,
        is_active: true
      };
      const newUser = await authService.signup(payload);
      setStaffList(prev => [...prev, newUser]);
      setShowAddStaffModal(false);
      setNewStaffForm({ username: '', email: '', password: '', full_name: '', role: 'Lecturer' });
      alert('Staff user created successfully.');
    } catch (error) {
      alert(`Failed to create staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match.");
      return;
    }
    try {
      await authService.changePassword({
        current_password: passwordForm.current,
        new_password: passwordForm.new,
        username: 'admin' // In production, this would come from the logged-in user context
      });
      setPasswordForm({ current: '', new: '', confirm: '' });
      alert("Password changed successfully.");
    } catch (error) {
      alert(`Failed to change password: ${error.message}`);
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar 
        menuItems={[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'Staff Management', icon: User },
          { id: 'students', label: 'Student Records', icon: Users },
          { id: 'devices', label: 'Device Management', icon: Laptop },
          { id: 'ai-analytics', label: 'AI Analytics', icon: Sparkles },
          { id: 'audit-logs', label: 'Audit Logs', icon: Database },
          { id: 'settings', label: 'System Settings', icon: Settings }
        ]}
        portalName="Admin Command"
        profileName="Admin Victor"
        profileRole="Superuser Access"
        portalId="portal_4"
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="portal-workspace">
        <button 
          className="btn btn-ghost p-2 md-hidden mb-4 self-start" 
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        {activeScreen === 'dashboard' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Enterprise System Monitoring</h2>
                <span>Admin Overview: telemetry nodes, hardware scopes, and AI forecasting</span>
              </div>
            </div>

            <div className="grid-stats">
              <div className="stat-card">
                <div className="stat-icon orange"><Laptop size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{devices.length}</span>
                  <span className="stat-label">Registered Scanners</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><CheckCircle size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{devices.filter(d => d.status === 'Ready' || d.status === 'ONLINE').length}</span>
                  <span className="stat-label">Active Scanners</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Shield size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">98.2%</span>
                  <span className="stat-label">System Uptime</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm-grid-cols-1">
              <div className="card">
                <h3 className="mb-4">Active Biometric Scanners</h3>
                <p className="text-sm mb-6">Heartbeat diagnostic summaries from classroom terminals:</p>
                <div className="flex flex-col gap-3">
                  {devices.map(dev => (
                    <div key={dev.id} className="flex justify-between items-center p-4 bg-primary-50 rounded-xl border border-light">
                      <div>
                        <span className="font-bold text-sm">{dev.name}</span>
                        <div className="font-mono text-[10px] text-dim uppercase mt-1">IP: {dev.ip} • {dev.location}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-accent-600 font-bold">{dev.latency}</span>
                        <span className={`status-dot ${dev.status === 'Ready' ? 'connected' : 'disconnected'}`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="mb-4">Biometric Audit Telemetry</h3>
                <p className="text-sm mb-6">Telemetry stream showing recent portal connections:</p>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-dim">10:44:01</span>
                    <p className="m-0"><strong className="text-primary-950">Officer Vincent</strong> authenticated via Identity-01</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-dim">10:40:15</span>
                    <p className="m-0">Sync completed: 4 biometric templates committed to DB</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-dim">09:12:44</span>
                    <p className="m-0 text-success-600 font-bold">Encrypted cloud backup build successful</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'users' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Staff Access Management</h2>
                <span>Create and edit access roles for academic registration officers</span>
              </div>
              <button 
                className="btn btn-primary flex items-center gap-2" 
                style={{ backgroundColor: 'var(--accent-600)', borderColor: 'var(--accent-600)' }}
                onClick={() => setShowAddStaffModal(true)}
              >
                <Plus size={16} /> <span>Signup New Operator</span>
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Assigned Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(staff => (
                    <tr key={staff.id}>
                      <td className="font-bold">{staff.full_name}</td>
                      <td>{staff.username}</td>
                      <td>{staff.email}</td>
                      <td>{staff.role}</td>
                      <td>
                        <span className={`badge ${staff.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {staff.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {staffList.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="text-center p-6 text-dim">No staff members found in registry.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showAddStaffModal && (
              <div className="modal-overlay">
                <div className="modal-content-box">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="flex items-center gap-2"><Shield size={20} className="text-crimson-600" /> Register System Operator</h3>
                    <button className="btn btn-ghost p-1" onClick={() => setShowAddStaffModal(false)}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleAddStaffSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Victor Admin" required value={newStaffForm.full_name} onChange={e => setNewStaffForm({...newStaffForm, full_name: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Username</label>
                        <input type="text" placeholder="v.admin" required value={newStaffForm.username} onChange={e => setNewStaffForm({...newStaffForm, username: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="victor@university.edu" required value={newStaffForm.email} onChange={e => setNewStaffForm({...newStaffForm, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label>Initial Password</label>
                        <input type="password" placeholder="••••••••" required value={newStaffForm.password} onChange={e => setNewStaffForm({...newStaffForm, password: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <select value={newStaffForm.role} onChange={e => setNewStaffForm({...newStaffForm, role: e.target.value})}>
                          <option value="Admin">Admin</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Registration Officer">Registration Officer</option>
                          <option value="ICT Officer">ICT Officer</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowAddStaffModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Authorizing...' : 'Authorize Operator'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeScreen === 'students' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Student Records Directory</h2>
                <span>Browse academic profiles and reset student biometric templates</span>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Matric Number</th>
                    <th>Full Student Name</th>
                    <th>Academic Department</th>
                    <th>Enrolled Status</th>
                    <th>Audit Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.matric}>
                      <td style={{ fontWeight: 600 }}>{s.matric}</td>
                      <td>{s.name}</td>
                      <td>{s.dept}</td>
                      <td>
                        <span className={`badge ${s.status === 'Enrolled' ? 'badge-success' : 'badge-warning'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{ height: '32px', padding: '0 12px', fontSize: '12px', color: 'var(--danger-600)' }}
                          onClick={() => {
                            if (confirm(`Reset biometric template for ${s.name}?`)) {
                              setStudents(prev => prev.map(item => 
                                item.matric === s.matric ? { ...item, status: 'Pending' } : item
                              ));
                            }
                          }}
                        >
                          Reset Biometrics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeScreen === 'devices' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Device Terminal Configurations</h2>
                <span>Monitor socket latency and allocate HID terminal nodes</span>
              </div>
              <button 
                className="btn btn-primary flex items-center gap-2" 
                style={{ backgroundColor: 'var(--accent-600)', borderColor: 'var(--accent-600)' }}
                onClick={() => setShowAddDeviceModal(true)}
              >
                <Plus size={16} /> <span>Allocate New Node</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 sm-grid-cols-1">
              {devices.map(dev => (
                <div key={dev.id} className="card">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[10px] font-bold text-dim uppercase tracking-tighter">Terminal-ID: {dev.id}</span>
                    <span className={`badge ${dev.status === 'Ready' ? 'badge-success' : 'badge-danger'} px-3`}>
                      {dev.status === 'Ready' ? 'OPERATIONAL' : 'OFFLINE'}
                    </span>
                  </div>
                  <h3 className="mb-1">{dev.name}</h3>
                  <p className="font-mono text-xs text-accent-600 font-bold mb-6">IP_ADDR: {dev.ip}</p>
                  
                  <div className="flex justify-between items-center border-t border-light pt-4">
                    <div className="flex items-center gap-2">
                       <Activity size={14} className="text-dim" />
                       <span className="text-xs font-bold text-primary-950">{dev.latency}</span>
                    </div>
                    <button 
                      className="btn btn-secondary h-8 px-4 text-[10px] font-bold uppercase tracking-wider" 
                      onClick={() => alert(`Pinged node ${dev.id}. Latency: 12ms`)}
                    >
                      Sync Heartbeat
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddDeviceModal && (
              <div className="modal-overlay">
                <div className="modal-content-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Add Biometric Scanner Node</h3>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAddDeviceModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleAddDeviceSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label htmlFor="dev-name">Device/Scanner Label</label>
                        <input 
                          type="text" 
                          id="dev-name" 
                          placeholder="Scanner 04 - Main Library" 
                          required
                          value={newDeviceForm.name}
                          onChange={(e) => setNewDeviceForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="form-grid-2">
                        <div>
                          <label htmlFor="dev-loc">Allocated Room/Hall</label>
                          <input 
                            type="text" 
                            id="dev-loc" 
                            placeholder="Library" 
                            required
                            value={newDeviceForm.location}
                            onChange={(e) => setNewDeviceForm(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label htmlFor="dev-ip">Target IP Endpoint</label>
                          <input 
                            type="text" 
                            id="dev-ip" 
                            placeholder="192.168.1.104" 
                            required
                            value={newDeviceForm.ip}
                            onChange={(e) => setNewDeviceForm(prev => ({ ...prev, ip: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowAddDeviceModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Allocate Node</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeScreen === 'ai-analytics' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>AI Analytics & Absenteeism Forecasting</h2>
                <span>Predictive algorithms: Risk models, trend forecasts, and student anomalies</span>
              </div>
            </div>

            <div className="ai-analytics-dashboard-grid">
              
              {/* Visual 1: Attendance Forecasting Curve */}
              <div className="card" style={{ margin: '0' }}>
                <div className="chart-card-header">
                  <h4>Attendance Trend & Projection Bounds</h4>
                  <span style={{ fontSize: '12px', color: 'var(--success-600)', fontWeight: 600 }}>Confidence: 95%</span>
                </div>
                <div className="chart-container-mock">
                  <svg width="100%" height="100%" viewBox="0 0 400 220" preserveAspectRatio="none">
                    <path 
                      d="M 240 70 L 290 85 L 340 100 L 390 120 L 390 190 L 340 170 L 290 150 L 240 110 Z" 
                      className="chart-area-confidence" 
                    />
                    <path 
                      d="M 10 30 Q 80 40 120 50 T 240 90" 
                      className="chart-path-line" 
                    />
                    <path 
                      d="M 240 90 L 290 115 L 340 135 L 390 155" 
                      className="chart-path-dotted" 
                    />
                    <line x1="0" y1="50" x2="400" y2="50" className="chart-grid-line" />
                    <line x1="0" y1="100" x2="400" y2="100" className="chart-grid-line" />
                    <line x1="0" y1="150" x2="400" y2="150" className="chart-grid-line" />
                    
                    <line x1="240" y1="0" x2="240" y2="220" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="248" y="20" fill="#64748B" fontSize="10" fontWeight="bold">FORECAST START (WK 7)</text>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '3px', backgroundColor: 'var(--primary-600)' }}></div>
                    <span>Historical</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '3px', borderTop: '3px dashed var(--primary-600)' }}></div>
                    <span>AI Predicted</span>
                  </div>
                </div>
              </div>

              {/* Visual 2: Absenteeism Prediction Scatterplot */}
              <div className="card" style={{ margin: '0' }}>
                <div className="chart-card-header">
                  <h4>Student Absenteeism Risk Scoring</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive Plot</span>
                </div>
                <div className="scatterplot-canvas">
                  <div className="quadrant-line-v"></div>
                  <div className="quadrant-line-h"></div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: 'bold', color: 'var(--danger-600)' }}>CRITICAL</div>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', fontWeight: 'bold', color: 'var(--warning-600)' }}>WARNING</div>
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '10px', fontWeight: 'bold', color: 'var(--success-600)' }}>STABLE</div>

                  <div 
                    className="scatter-dot high-risk" 
                    style={{ left: '80%', top: '25%' }}
                    onClick={() => setSelectedRiskStudent({ name: 'John Doe', matric: 'CSC/2026/001', absences: 8, risk: '85% (High)', details: 'Missing consecutive laboratories. Immediate intervention recommended.' })}
                  ></div>
                  <div 
                    className="scatter-dot med-risk" 
                    style={{ left: '42%', top: '35%' }}
                    onClick={() => setSelectedRiskStudent({ name: 'Michael Brown', matric: 'CSC/2026/005', absences: 4, risk: '62% (Medium)', details: 'Drop in scanner verification counts over past fortnight.' })}
                  ></div>
                  <div 
                    className="scatter-dot low-risk" 
                    style={{ left: '25%', top: '75%' }}
                    onClick={() => setSelectedRiskStudent({ name: 'Jane Smith', matric: 'CSC/2026/002', absences: 1, risk: '12% (Low)', details: 'Highly consistent. Normal check-in distribution patterns.' })}
                  ></div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                  X: Absence Count | Y: Failure Risk (%) | Click dots to review details
                </p>
              </div>

              {/* Visual 3: Department Attendance Rankings */}
              <div className="card" style={{ margin: '0' }}>
                <div className="chart-card-header">
                  <h4>Department Attendance Rankings</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dynamic List</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <strong>1. Computer Science</strong>
                      <span style={{ fontWeight: 'bold', color: 'var(--success-600)' }}>92%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '92%', backgroundColor: 'var(--success-600)' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <strong>2. Electrical Engineering</strong>
                      <span style={{ fontWeight: 'bold', color: 'var(--success-600)' }}>85%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '85%', backgroundColor: 'var(--success-600)' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual 4: Attendance Anomaly Detection */}
              <div className="card" style={{ margin: '0' }}>
                <div className="chart-card-header">
                  <h4>Seasonal Attendance Anomaly Flags</h4>
                  <span style={{ fontSize: '12px', color: 'var(--danger-600)', fontWeight: 600 }}>2 flags active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '10px', borderLeft: '3px solid var(--danger-600)', backgroundColor: 'var(--danger-100)', borderRadius: '0 6px 6px 0' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--danger-600)', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 'bold', fontSize: '13px' }}>CSC-101: Mass Roster Skip Alert</span>
                      <p style={{ fontSize: '12px', margin: '2px 0 0 0', color: 'var(--text-muted)' }}>
                        Attendance dropped 45% below historical base rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {selectedRiskStudent && (
              <div className="modal-overlay">
                <div className="modal-content-box" style={{ borderColor: 'var(--danger-600)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ color: 'var(--danger-600)', margin: '0' }}>
                      AI Risk: {selectedRiskStudent.name}
                    </h3>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedRiskStudent(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px' }}>
                      Student Matric Number: <strong>{selectedRiskStudent.matric}</strong>
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0', padding: '12px', backgroundColor: 'var(--bg-slate)', borderRadius: '6px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Absences logged</span>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectedRiskStudent.absences} lectures</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Predicted Failure Risk</span>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--danger-600)' }}>{selectedRiskStudent.risk}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedRiskStudent.details}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setSelectedRiskStudent(null)}>Dismiss</button>
                    <button className="btn btn-primary btn-danger" onClick={() => { alert('Alert dispatched.'); setSelectedRiskStudent(null); }}>
                      Send Warning Alert
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeScreen === 'audit-logs' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>System Telemetry & Audit Logs</h2>
                <span>Full system event log for administrators and IT auditors</span>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>System Node</th>
                    <th>Severity</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--text-muted)' }}>2026-06-14 10:32:01 AM</td>
                    <td>Portal Router</td>
                    <td><span className="badge badge-info">INFO</span></td>
                    <td>Master layout switches to Admin Portal view</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeScreen === 'settings' && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>System & Profile Settings</h2>
                <span>Global database parameters and account security control</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-start sm-grid-cols-1">
              <div className="card">
                <h3 className="flex items-center gap-2 mb-4"><Settings size={18} /> Academic Parameters</h3>
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <label htmlFor="sys-semester">Active Semester Code</label>
                    <input type="text" id="sys-semester" defaultValue="2026-B" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sys-audit-ret">Audit Log Retention Policy (days)</label>
                    <input type="text" id="sys-audit-ret" defaultValue="365" />
                  </div>
                  <button className="btn btn-primary w-full">Update System Globals</button>
                </div>
              </div>

              <div className="card">
                <h3 className="flex items-center gap-2 mb-4"><Key size={18} /> Account Security</h3>
                <p className="text-sm mb-6">Update your administrator password. Ensure you use a mix of characters for maximum security.</p>
                
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="relative">
                      <input type="password" placeholder="••••••••" required value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="••••••••" required value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="••••••••" required value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-secondary w-full mt-2 flex items-center gap-2">
                    <Lock size={16} /> Update Secret Key
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
