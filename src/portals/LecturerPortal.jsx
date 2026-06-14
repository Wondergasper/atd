import React from 'react';
import { 
  LayoutDashboard, Users, Download, Settings, CheckCircle, AlertTriangle, Play 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { MOCK_COURSES } from '../data/mockDb';

export default function LecturerPortal({
  activeScreen,
  setActiveScreen,
  onLogout,
  selectedCourse,
  setSelectedCourse,
  rosterList,
  setRosterList,
  reportingFilters,
  setReportingFilters,
  downloadingReport,
  startReportExport
}) {
  return (
    <div className="portal-layout theme-amber">
      <Sidebar 
        menuItems={[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'courses', label: 'My Courses', icon: Users },
          { id: 'reports', label: 'Reports Generator', icon: Download },
          { id: 'settings', label: 'Settings', icon: Settings }
        ]}
        portalName="Lecturer Portal"
        profileName="Prof. Vance"
        profileRole="Computer Science"
        portalId="portal_3"
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        onLogout={onLogout}
      />

      <main className="portal-workspace">
        {activeScreen === 'dashboard' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Welcome Back, Prof. Vance</h2>
                <span>Review attendance statistics and trends for your active courses</span>
              </div>
            </div>

            <div className="grid-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}><Users size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Active Courses</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><CheckCircle size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">84.5%</span>
                  <span className="stat-label">Average Attendance</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon red"><AlertTriangle size={22} /></div>
                <div className="stat-info">
                  <span className="stat-value">2</span>
                  <span className="stat-label">Students At Risk (&lt;70%)</span>
                </div>
              </div>
            </div>

            <h3>Your Courses</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
              {MOCK_COURSES.map(course => (
                <div key={course.code} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '180px', margin: '0' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                        {course.code}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--success-600)' }}>{course.average} Avg</span>
                    </div>
                    <h4 style={{ fontSize: '16px', margin: '12px 0 6px 0', fontWeight: 600 }}>{course.title}</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{course.registered} students registered</span>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={() => { setSelectedCourse(course); setActiveScreen('course-details'); }}
                  >
                    View Attendance Roster
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeScreen === 'courses' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>My Active Courses</h2>
                <span>Choose a course roster to review or edit check-in states manually</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {MOCK_COURSES.map(course => (
                <div key={course.code} className="card" style={{ margin: '0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#D97706' }}>{course.code}</span>
                  <h3 style={{ margin: '8px 0 16px 0' }}>{course.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered</span>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{course.registered} Students</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Term Average</span>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--success-600)' }}>{course.average}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', backgroundColor: '#D97706' }} onClick={() => { setSelectedCourse(course); setActiveScreen('course-details'); }}>
                    Manage Session Attendance
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeScreen === 'course-details' && (
          <div>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>{selectedCourse?.code}: {selectedCourse?.title}</h2>
                <span>Session: <strong>14 June 2026</strong> | Roster: {selectedCourse?.registered} Registered</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setActiveScreen('courses')}>
                  Back to Courses
                </button>
                <button className="btn btn-primary" style={{ backgroundColor: '#D97706' }} onClick={startReportExport}>
                  Export Session CSV
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Matric Number</th>
                    <th>Biometric Scan Time</th>
                    <th>Session Check-In</th>
                    <th>Manual Override Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterList.map(item => (
                    <tr key={item.matric}>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>{item.matric}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{item.time}</td>
                      <td>
                        <span className={`badge ${item.status === 'PRESENT' ? 'badge-success' : item.status === 'LATE' ? 'badge-warning' : 'badge-danger'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={item.status} 
                          style={{ height: '32px', padding: '0 8px', fontSize: '13px', width: '140px' }}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setRosterList(prev => prev.map(s => 
                              s.matric === item.matric ? { ...s, status: newStatus, time: newStatus === 'PRESENT' ? '08:45 AM' : '--:--' } : s
                            ));
                          }}
                        >
                          <option value="PRESENT">PRESENT</option>
                          <option value="LATE">LATE</option>
                          <option value="ABSENT">ABSENT</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeScreen === 'reports' && (
          <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Attendance Reports Generator</h2>
                <span>Filter and extract detailed spreadsheets for academic departments</span>
              </div>
            </div>

            <div className="card">
              <form onSubmit={(e) => { e.preventDefault(); startReportExport(); }}>
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="rep-course">Select Course</label>
                    <select 
                      id="rep-course"
                      value={reportingFilters.course}
                      onChange={(e) => setReportingFilters(prev => ({ ...prev, course: e.target.value }))}
                    >
                      {MOCK_COURSES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rep-date">Target Date</label>
                    <input 
                      type="text" 
                      id="rep-date" 
                      value={reportingFilters.date}
                      onChange={(e) => setReportingFilters(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#D97706' }} disabled={downloadingReport}>
                    {downloadingReport ? 'Building CSV Spreadsheet...' : 'Generate and Export CSV Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeScreen === 'settings' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Settings</h2>
                <span>Lecturer parameters and session defaults</span>
              </div>
            </div>
            <div className="card">
              <h3>Course Defaults</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div className="form-grid-2">
                  <div>
                    <label htmlFor="late-threshold">Late Threshold (minutes past start)</label>
                    <input type="text" id="late-threshold" defaultValue="15" />
                  </div>
                  <div>
                    <label htmlFor="absent-threshold">Absent Threshold (minutes past start)</label>
                    <input type="text" id="absent-threshold" defaultValue="30" />
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
