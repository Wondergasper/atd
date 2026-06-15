import React from 'react';
import { 
  LayoutDashboard, Users, Download, Settings, CheckCircle, AlertTriangle, Play, Menu, BookOpen 
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
  startReportExport,
  isSidebarOpen,
  setIsSidebarOpen
}) {
  return (
    <div className="portal-layout theme-amber">
      <Sidebar 
        menuItems={[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
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
                <h2>Welcome Back, Prof. Vance</h2>
                <span>Review attendance statistics and trends for your active courses</span>
              </div>
            </div>

            <div className="grid-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)' }}><BookOpen size={22} /></div>
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
                  <span className="stat-label">Students At Risk</span>
                </div>
              </div>
            </div>

            <h3 className="mb-4">Your Courses</h3>
            <div className="grid grid-cols-2 gap-4 sm-grid-cols-1">
              {MOCK_COURSES.map(course => (
                <div key={course.code} className="card flex flex-col justify-between" style={{ minHeight: '180px' }}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="badge badge-warning font-mono" style={{ backgroundColor: 'var(--accent-100)', color: 'var(--accent-600)' }}>
                        {course.code}
                      </span>
                      <span className="font-bold text-success-600">{course.average} Avg</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem' }}>{course.title}</h3>
                    <span className="text-dim text-sm">{course.registered} students registered</span>
                  </div>
                  <button 
                    className="btn btn-secondary w-full mt-4" 
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

            <div className="grid grid-cols-2 gap-6 sm-grid-cols-1">
              {MOCK_COURSES.map(course => (
                <div key={course.code} className="card">
                  <span className="font-mono text-accent-600 font-bold text-xs uppercase tracking-widest">{course.code}</span>
                  <h3 className="mt-2 mb-4">{course.title}</h3>
                  <div className="flex gap-6 border-t border-light pt-4 mb-6">
                    <div>
                      <span className="text-xs text-dim uppercase tracking-wider">Registered</span>
                      <div className="text-lg font-bold">{course.registered} Students</div>
                    </div>
                    <div>
                      <span className="text-xs text-dim uppercase tracking-wider">Term Average</span>
                      <div className="text-lg font-bold text-success-600">{course.average}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary w-full" style={{ backgroundColor: 'var(--accent-600)', borderColor: 'var(--accent-600)' }} onClick={() => { setSelectedCourse(course); setActiveScreen('course-details'); }}>
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
                <span>Session: <strong className="text-primary-950">14 June 2026</strong> | Roster: {selectedCourse?.registered} Registered</span>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-secondary" onClick={() => setActiveScreen('courses')}>
                  <ArrowLeft size={16} /> Back to Courses
                </button>
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--accent-600)', borderColor: 'var(--accent-600)' }} onClick={startReportExport}>
                  <Download size={16} /> Export Session CSV
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Matric Number</th>
                    <th>Scan Time</th>
                    <th>Status</th>
                    <th>Manual Override</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterList.map(item => (
                    <tr key={item.matric}>
                      <td className="font-bold">{item.name}</td>
                      <td className="font-mono text-sm">{item.matric}</td>
                      <td className="text-dim text-sm">{item.time}</td>
                      <td>
                        <span className={`badge ${item.status === 'PRESENT' ? 'badge-success' : item.status === 'LATE' ? 'badge-warning' : 'badge-danger'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="h-8 py-0 text-xs w-32"
                          value={item.status} 
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
          <div className="w-full max-w-2xl mx-auto">
            <div className="workspace-header">
              <div className="workspace-title">
                <h2>Attendance Reports Generator</h2>
                <span>Filter and extract detailed spreadsheets for academic departments</span>
              </div>
            </div>

            <div className="card">
              <form onSubmit={(e) => { e.preventDefault(); startReportExport(); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Select Module</label>
                    <select 
                      value={reportingFilters.course}
                      onChange={(e) => setReportingFilters(prev => ({ ...prev, course: e.target.value }))}
                    >
                      {MOCK_COURSES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Date</label>
                    <input 
                      type="text" 
                      value={reportingFilters.date}
                      onChange={(e) => setReportingFilters(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-light pt-6 mt-6">
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-600)', borderColor: 'var(--accent-600)' }} disabled={downloadingReport}>
                    <Download size={16} /> {downloadingReport ? 'Building CSV Spreadsheet...' : 'Generate and Export CSV Report'}
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
