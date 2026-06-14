import React from 'react';
import { 
  LayoutDashboard, User, Users, Laptop, Sparkles, Database, Settings, 
  Plus, CheckCircle, AlertTriangle, X 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

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
  handleAddDeviceSubmit
}) {
  return (
    <div className="portal-layout theme-crimson">
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
      />

      <main className="portal-workspace">
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
                <div className="stat-icon" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}><Laptop size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{devices.length}</span>
                  <span className="stat-label">Registered Scanners</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><CheckCircle size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{devices.filter(d => d.status === 'Ready').length}</span>
                  <span className="stat-label">Active Scanners</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon red"><AlertTriangle size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{devices.filter(d => d.status !== 'Ready').length}</span>
                  <span className="stat-label">Scanners Offline</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="card" style={{ margin: '0' }}>
                <h3>Active Biometric Scanners</h3>
                <p>Heartbeat diagnostic summaries from classroom terminals:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  {devices.map(dev => (
                    <div key={dev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--bg-slate)', borderRadius: '6px' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{dev.name}</span>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Location: {dev.location} | IP: {dev.ip}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dev.latency}</span>
                        <span className={`status-dot ${dev.status === 'Ready' ? 'connected' : 'disconnected'}`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ margin: '0' }}>
                <h3>Biometric Audit Telemetry</h3>
                <p>Telemetry stream showing recent portal connections:</p>
                <ul style={{ paddingLeft: '16px', fontSize: '13px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                  <li>10:44 AM - Operator login token verified for Officer Vincent</li>
                  <li>10:40 AM - Sync completed: 4 students roster uploaded to Main Campus DB</li>
                  <li>09:12 AM - Server database backup build compiled successfully</li>
                </ul>
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
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Staff Username</th>
                    <th>Assigned Role</th>
                    <th>Web Access Control</th>
                    <th>Assigned Portal Scope</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Officer Vincent</td>
                    <td>Registration Officer</td>
                    <td><span className="badge badge-success">ACTIVE</span></td>
                    <td>Portal 1 (Biometric Enrollment)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Prof. Vance</td>
                    <td>Academic Lecturer</td>
                    <td><span className="badge badge-success">ACTIVE</span></td>
                    <td>Portal 3 (Lecturer Roster portal)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Admin Victor</td>
                    <td>Super Administrator</td>
                    <td><span className="badge badge-success">ACTIVE</span></td>
                    <td>All Portals (1, 2, 3, 4)</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
              <button className="btn btn-primary" style={{ backgroundColor: '#DC2626' }} onClick={() => setShowAddDeviceModal(true)}>
                <Plus size={16} /> Add Scanner Device
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {devices.map(dev => (
                <div key={dev.id} className="card" style={{ margin: '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dev.id}</span>
                    <span className={`badge ${dev.status === 'Ready' ? 'badge-success' : 'badge-danger'}`}>
                      {dev.status}
                    </span>
                  </div>
                  <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px' }}>{dev.name}</h3>
                  <p style={{ fontSize: '13px', margin: '0 0 16px 0' }}>Terminal Endpoint IP: <strong>{dev.ip}</strong></p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '12px' }}>
                    <span>Socket latency: <strong>{dev.latency}</strong></span>
                    <button 
                      className="btn btn-secondary" 
                      style={{ height: '28px', fontSize: '11px', padding: '0 8px' }}
                      onClick={() => {
                        alert(`Pinged device ${dev.id}. Response latency: 12ms.`);
                      }}
                    >
                      Ping Node
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
                      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#DC2626' }}>Allocate Node</button>
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
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>System Settings</h2>
                <span>Global database parameters and role classifications</span>
              </div>
            </div>
            <div className="card">
              <h3>Academic Integration Parameters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="sys-semester">Active Semester Code</label>
                    <input type="text" id="sys-semester" defaultValue="2026-B" />
                  </div>
                  <div>
                    <label htmlFor="sys-audit-ret">Audit Log Retention Policy (days)</label>
                    <input type="text" id="sys-audit-ret" defaultValue="365" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
