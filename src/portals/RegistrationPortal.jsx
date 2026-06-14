import React, { useState } from 'react';
import { 
  LayoutDashboard, UserCheck, Users, Activity, Settings, Plus, CheckCircle, XCircle 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ScannerWindow from '../components/ScannerWindow';
import { useScanner } from '../hooks/useScanner';

export default function RegistrationPortal({ 
  students, 
  setStudents, 
  activeScreen, 
  setActiveScreen, 
  onLogout 
}) {
  const { 
    enrollmentProgress, 
    setEnrollmentProgress,
    scanState, 
    setScanState,
    testResult, 
    setTestResult,
    triggerEnrollmentScan, 
    triggerBiometricTest, 
    resetProgress,
    setScannerConnection,
    setScannerMessage
  } = useScanner();

  const [registrationForm, setRegistrationForm] = useState({ name: '', matric: '', dept: 'Computer Science', email: '', consent: false });
  const [activeEnrollmentStudent, setActiveEnrollmentStudent] = useState(null);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registrationForm.consent) {
      alert('Must obtain explicit consent before biometric recording.');
      return;
    }
    const newStudent = {
      matric: registrationForm.matric,
      name: registrationForm.name,
      dept: registrationForm.dept,
      status: 'Pending',
      attendance: '0%'
    };
    setStudents(prev => [...prev, newStudent]);
    setActiveEnrollmentStudent(newStudent);
    resetProgress();
    setActiveScreen('enrollment');
  };

  const handleEnrollmentScanClick = () => {
    triggerEnrollmentScan(activeEnrollmentStudent, (student) => {
      setStudents(prev => prev.map(s => 
        s.matric === student.matric ? { ...s, status: 'Enrolled' } : s
      ));
    });
  };

  return (
    <div className="portal-layout theme-indigo">
      <Sidebar 
        menuItems={[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'register', label: 'Student Registration', icon: UserCheck },
          { id: 'students', label: 'Student Roster', icon: Users },
          { id: 'logs', label: 'Activity Logs', icon: Activity },
          { id: 'settings', label: 'Settings', icon: Settings }
        ]}
        portalName="Enrollment Registry"
        profileName="Officer Vincent"
        profileRole="ICT Registry"
        portalId="portal_1"
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onLogout={onLogout}
      />

      <main className="portal-workspace">
        {activeScreen === 'dashboard' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Enrollment Registry Overview</h2>
                <span>Review scanner states, registration volume, and setup biometric rosters</span>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveScreen('register')}>
                <Plus size={16} /> Register New Student
              </button>
            </div>

            <div className="grid-stats">
              <div className="stat-card">
                <div className="stat-icon"><Users size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{students.length}</span>
                  <span className="stat-label">Total Roster</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><UserCheck size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{students.filter(s => s.status === 'Enrolled').length}</span>
                  <span className="stat-label">Biometrics Enrolled</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon amber"><Activity size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{students.filter(s => s.status === 'Pending').length}</span>
                  <span className="stat-label">Enrollments Pending</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Biometric Sensor Status & Calibration</h3>
              <p>Wipe scanner glass periodically to maintain dry capture templates. Standard validation parameters:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                  <span style={{ fontSize: '14px' }}>HID DigitalPersona 4500 websocket listening on Port 8000</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                  <span style={{ fontSize: '14px' }}>NFIQ Threshold Config: Minimum 60%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'register' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Register Student Profile</h2>
                <span>Input credentials and initiate fingerprint template recording</span>
              </div>
            </div>
            <div className="card">
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="stu-name">Full Name</label>
                    <input 
                      type="text" 
                      id="stu-name" 
                      required 
                      placeholder="John Doe"
                      value={registrationForm.name}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="stu-matric">Matric Number</label>
                    <input 
                      type="text" 
                      id="stu-matric" 
                      required 
                      placeholder="CSC/2026/001"
                      value={registrationForm.matric}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, matric: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="stu-dept">Department</label>
                    <select 
                      id="stu-dept"
                      value={registrationForm.dept}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, dept: e.target.value }))}
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Eng.">Electrical Eng.</option>
                      <option value="Mechanical Eng.">Mechanical Eng.</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="stu-email">Institutional Email</label>
                    <input 
                      type="email" 
                      id="stu-email" 
                      required 
                      placeholder="j.doe@university.edu"
                      value={registrationForm.email}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    required 
                    checked={registrationForm.consent}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, consent: e.target.checked }))}
                  />
                  <span>I verify that the student has read the Biometric Privacy Consent forms and grants explicit permission to capture and store encrypted fingerprint templates.</span>
                </label>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveScreen('dashboard')}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit & Enroll Biometrics</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeScreen === 'enrollment' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Biometric Enrollment Capture</h2>
                <span>Student: <strong>{activeEnrollmentStudent?.name}</strong> ({activeEnrollmentStudent?.matric})</span>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveScreen('students')}>
                Back to Roster
              </button>
            </div>

            <div className="biometric-enrollment-grid">
              <div>
                <ScannerWindow onClick={handleEnrollmentScanClick} />
                
                {enrollmentProgress === 4 && (
                  <div className="card" style={{ marginTop: '24px', borderColor: 'var(--success-600)', backgroundColor: 'var(--success-100)', color: '#047857' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle size={24} />
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>Enrollment Template Generation Complete!</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#065F46', marginTop: '4px' }}>
                          4 prints registered successfully. Click below to verify scanner template match accuracy.
                        </p>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" onClick={() => { setActiveScreen('verification'); setTestResult(null); setScanState('idle'); }}>
                        Test Verification Match
                      </button>
                      <button className="btn btn-secondary" style={{ backgroundColor: '#FFFFFF' }} onClick={() => setActiveScreen('students')}>
                        Finish & Save Student
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <h3>Capture Progress</h3>
                <p>Websocket requires 4 distinct matches to calibrate registration templates:</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                      <div 
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: enrollmentProgress >= num ? 'var(--success-100)' : 'transparent',
                          borderColor: enrollmentProgress >= num ? 'var(--success-600)' : 'var(--border-color)',
                          color: enrollmentProgress >= num ? 'var(--success-600)' : 'var(--text-muted)'
                        }}
                      >
                        {enrollmentProgress >= num ? <CheckCircle size={14} /> : num}
                      </div>
                      <span style={{ fontWeight: enrollmentProgress >= num ? 600 : 400 }}>
                        Fingerprint Capture Scan {num}
                      </span>
                    </div>
                  ))}
                </div>

                {enrollmentProgress < 4 && (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '32px' }}
                    onClick={handleEnrollmentScanClick}
                    disabled={scanState === 'scanning'}
                  >
                    {scanState === 'scanning' ? 'Capturing...' : 'Trigger Scan Capture'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'verification' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Test Verification Match</h2>
                <span>Perform a diagnostic scan to verify the newly registered template matches the scanner output</span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px' }}>
              <ScannerWindow onClick={triggerBiometricTest} />

              <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={triggerBiometricTest} disabled={scanState === 'scanning'}>
                {scanState === 'scanning' ? 'Comparing template...' : 'Scan Index Finger to Verify'}
              </button>

              {testResult && (
                <div style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '6px', backgroundColor: testResult === 'success' ? 'var(--success-100)' : 'var(--danger-100)', color: testResult === 'success' ? 'var(--success-600)' : 'var(--danger-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {testResult === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span style={{ fontWeight: 'bold' }}>
                      {testResult === 'success' ? 'Verification Success: Template matched (Score: 94%)' : 'Verification Failed: Unrecognized fingerprint template.'}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px', width: '100%', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => { setActiveScreen('enrollment'); resetProgress(); }}>
                  Re-enroll Biometrics
                </button>
                <button className="btn btn-primary" onClick={() => setActiveScreen('students')}>
                  Save & Return to Roster
                </button>
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'students' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Student Roster</h2>
                <span>View student records and biometric enrollment completeness</span>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveScreen('register')}>
                <Plus size={16} /> Register Student
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Matric Number</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Biometric Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.matric}>
                      <td style={{ fontWeight: 600 }}>{student.matric}</td>
                      <td>{student.name}</td>
                      <td>{student.dept}</td>
                      <td>
                        <span className={`badge ${student.status === 'Enrolled' ? 'badge-success' : 'badge-warning'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
                          onClick={() => {
                            setActiveEnrollmentStudent(student);
                            resetProgress();
                            setActiveScreen('enrollment');
                          }}
                        >
                          Enroll Biometrics
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeScreen === 'logs' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Biometric Activity Logs</h2>
                <span>Security audit trail of biometric registrations and verification overrides</span>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Operator</th>
                    <th>Action Event</th>
                    <th>Target Student</th>
                    <th>Status Badge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--text-muted)' }}>2026-06-14 10:32 AM</td>
                    <td>Officer Vincent</td>
                    <td>Biometric enrollment template generated</td>
                    <td>John Doe (CSC/2026/001)</td>
                    <td><span className="badge badge-success">Success</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--text-muted)' }}>2026-06-14 09:15 AM</td>
                    <td>Officer Vincent</td>
                    <td>Poor scan quality template rejected (NFIQ: 42%)</td>
                    <td>Robert Johnson (CSC/2026/003)</td>
                    <td><span className="badge badge-danger">Rejected</span></td>
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
                <h2>Enrollment Configurations</h2>
                <span>Configure local scanner WebSocket settings and security guidelines</span>
              </div>
            </div>

            <div className="card">
              <h3>Device Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label htmlFor="ws-port">Scanner WebSocket URL</label>
                  <input type="text" id="ws-port" defaultValue="ws://127.0.0.1:8000/biometrics/stream" />
                </div>
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="nfiq-thresh">Minimum NFIQ 2 Quality Score (%)</label>
                    <input type="text" id="nfiq-thresh" defaultValue="60" />
                  </div>
                  <div>
                    <label htmlFor="scan-count">Calibration Scans Required</label>
                    <input type="text" id="scan-count" defaultValue="4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Simulate Hardware Trigger (Debugging)</h3>
              <p style={{ marginBottom: '16px' }}>Simulate hardware connection drops or sensor calibration faults:</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => { setScannerConnection('connected'); setScannerMessage('Scanner status updated.'); }}>
                  Set Connected
                </button>
                <button className="btn btn-secondary" onClick={() => { setScannerConnection('disconnected'); setScannerMessage('Scanner offline.'); }}>
                  Set Offline
                </button>
                <button className="btn btn-secondary" onClick={() => { setScannerConnection('calibrating'); setScannerMessage('Scanner calibrating.'); }}>
                  Set Calibrating
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
