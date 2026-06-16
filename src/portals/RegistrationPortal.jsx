import React, { useState } from 'react';
import { 
  LayoutDashboard, UserCheck, Users, Activity, Settings, Plus, CheckCircle, XCircle, Menu 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ScannerWindow from '../components/ScannerWindow';
import { useScanner } from '../hooks/useScanner';
import { studentService, biometricService } from '../services/api';

export default function RegistrationPortal({ 
  students, 
  setStudents, 
  activeScreen, 
  setActiveScreen, 
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registrationForm.consent) {
      alert('Must obtain explicit consent before biometric recording.');
      return;
    }
    
    try {
      const names = registrationForm.name.split(' ');
      const newStudentData = {
        matric_number: registrationForm.matric,
        first_name: names[0],
        last_name: names.slice(1).join(' ') || ' ',
        email: registrationForm.email,
        department_id: 1, // Default to CS for now
        faculty_id: 1,
        level: 100
      };

      const createdStudent = await studentService.create(newStudentData);
      
      const mappedStudent = {
        id: createdStudent.id,
        matric: createdStudent.matric_number,
        name: `${createdStudent.first_name} ${createdStudent.last_name}`,
        dept: 'Computer Science',
        status: 'Pending',
        attendance: '0%'
      };

      setStudents(prev => [...prev, mappedStudent]);
      setActiveEnrollmentStudent(mappedStudent);
      resetProgress();
      setActiveScreen('enrollment');
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  };

  const handleEnrollmentScanClick = () => {
    triggerEnrollmentScan(activeEnrollmentStudent, async (student, templateData) => {
      try {
        await biometricService.enroll({
          student_id: student.id,
          finger_type: "RIGHT_INDEX",
          template_data: templateData,
          quality_score: 85
        });

        setStudents(prev => prev.map(s => 
          s.id === student.id ? { ...s, status: 'Enrolled' } : s
        ));
      } catch (error) {
        alert(`Biometric enrollment failed: ${error.message}`);
      }
    });
  };

  return (
    <div className="portal-layout">
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
                <h2>Enrollment Registry Overview</h2>
                <span>Review scanner states, registration volume, and setup biometric rosters</span>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveScreen('register')}>
                <Plus size={16} /> Register New Student
              </button>
            </div>

            <div className="grid-stats">
              <div className="stat-card">
                <div className="stat-icon blue"><Users size={22} /></div>
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
                <div className="stat-icon orange"><Activity size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">{students.filter(s => s.status === 'Pending').length}</span>
                  <span className="stat-label">Enrollments Pending</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Biometric Sensor Status & Calibration</h3>
              <p>Wipe scanner glass periodically to maintain dry capture templates. Standard validation parameters:</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-success-600" />
                  <span className="text-sm">HID DigitalPersona 4500 listening on Port 8000</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-success-600" />
                  <span className="text-sm">NFIQ Threshold Config: Minimum 60%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'register' && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Register Student Profile</h2>
                <span>Input credentials and initiate fingerprint template recording</span>
              </div>
            </div>
            <div className="card">
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
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
                  <div className="form-group">
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
                  <div className="form-group">
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
                  <div className="form-group">
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

                <div className="flex items-start gap-3 mt-4 mb-6">
                  <input 
                    type="checkbox" 
                    id="stu-consent"
                    className="mt-1 w-4 h-4"
                    required 
                    checked={registrationForm.consent}
                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, consent: e.target.checked }))}
                  />
                  <label htmlFor="stu-consent" className="mb-0 text-sm">I verify that the student has read the Biometric Privacy Consent forms and grants explicit permission to capture and store encrypted fingerprint templates.</label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
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
                <span>Student: <strong className="text-primary-700">{activeEnrollmentStudent?.name}</strong> ({activeEnrollmentStudent?.matric})</span>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveScreen('students')}>
                Back to Roster
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 items-start">
              <div>
                <ScannerWindow onClick={handleEnrollmentScanClick} />
                
                {enrollmentProgress === 4 && (
                  <div className="card mt-6 border-success-600 bg-success-100" style={{ color: '#047857' }}>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} />
                      <div>
                        <h4 className="m-0 font-bold" style={{ color: '#065F46' }}>Enrollment Template Generation Complete!</h4>
                        <p className="m-0 text-sm mt-1" style={{ color: '#065F46' }}>
                          4 prints registered successfully. Click below to verify scanner template match accuracy.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="btn btn-primary" onClick={() => { setActiveScreen('verification'); setTestResult(null); setScanState('idle'); }}>
                        Test Verification Match
                      </button>
                      <button className="btn btn-secondary bg-white" onClick={() => setActiveScreen('students')}>
                        Finish & Save Student
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="card">
                <h3>Capture Progress</h3>
                <p>Websocket requires 4 distinct matches to calibrate registration templates:</p>
                
                <div className="flex flex-col gap-4 mt-6">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="flex items-center gap-3 text-sm">
                      <div 
                        className="flex items-center justify-center border transition-colors"
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          backgroundColor: enrollmentProgress >= num ? 'var(--success-100)' : 'transparent',
                          borderColor: enrollmentProgress >= num ? 'var(--success-600)' : 'var(--border-color)',
                          color: enrollmentProgress >= num ? 'var(--success-600)' : 'var(--text-muted)'
                        }}
                      >
                        {enrollmentProgress >= num ? <CheckCircle size={14} /> : num}
                      </div>
                      <span className={enrollmentProgress >= num ? 'font-bold' : ''}>
                        Fingerprint Capture Scan {num}
                      </span>
                    </div>
                  ))}
                </div>

                {enrollmentProgress < 4 && (
                  <button 
                    className="btn btn-primary w-full mt-8" 
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
          <div className="w-full max-w-2xl mx-auto">
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Test Verification Match</h2>
                <span>Perform a diagnostic scan to verify the newly registered template matches the scanner output</span>
              </div>
            </div>

            <div className="card flex flex-col items-center p-6">
              <ScannerWindow onClick={triggerBiometricTest} />

              <button className="btn btn-primary mt-6" onClick={triggerBiometricTest} disabled={scanState === 'scanning'}>
                {scanState === 'scanning' ? 'Comparing template...' : 'Scan Index Finger to Verify'}
              </button>

              {testResult && (
                <div className={`w-full mt-6 p-4 rounded-md flex items-center gap-3 ${testResult === 'success' ? 'bg-success-100 text-success-600' : 'bg-danger-100 text-danger-600'}`}>
                  {testResult === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  <span className="font-bold">
                    {testResult === 'success' ? 'Verification Success: Template matched (Score: 94%)' : 'Verification Failed: Unrecognized fingerprint template.'}
                  </span>
                </div>
              )}

              <div className="flex gap-3 mt-8 w-full justify-end">
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
                      <td className="font-bold">{student.matric}</td>
                      <td>{student.name}</td>
                      <td>{student.dept}</td>
                      <td>
                        <span className={`badge ${student.status === 'Enrolled' ? 'badge-success' : 'badge-warning'}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary h-8 px-3 text-xs"
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
                    <td className="text-muted">2026-06-14 10:32 AM</td>
                    <td>Officer Vincent</td>
                    <td>Biometric enrollment template generated</td>
                    <td>John Doe (CSC/2026/001)</td>
                    <td><span className="badge badge-success">Success</span></td>
                  </tr>
                  <tr>
                    <td className="text-muted">2026-06-14 09:15 AM</td>
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
          <div className="w-full max-w-2xl mx-auto">
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Enrollment Configurations</h2>
                <span>Configure local scanner WebSocket settings and security guidelines</span>
              </div>
            </div>

            <div className="card">
              <h3>Device Settings</h3>
              <div className="flex flex-col gap-4 mt-4">
                <div className="form-group">
                  <label htmlFor="ws-port">Scanner WebSocket URL</label>
                  <input type="text" id="ws-port" defaultValue="ws://127.0.0.1:8000/biometrics/stream" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="nfiq-thresh">Minimum NFIQ 2 Quality Score (%)</label>
                    <input type="text" id="nfiq-thresh" defaultValue="60" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="scan-count">Calibration Scans Required</label>
                    <input type="text" id="scan-count" defaultValue="4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Simulate Hardware Trigger (Debugging)</h3>
              <p className="mb-4">Simulate hardware connection drops or sensor calibration faults:</p>
              <div className="flex gap-3">
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
