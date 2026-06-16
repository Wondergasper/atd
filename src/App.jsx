import React, { useState, useEffect } from 'react';
import './App.css';
import { ScannerProvider } from './hooks/useScanner';
import LandingPortal from './portals/LandingPortal';
import RegistrationPortal from './portals/RegistrationPortal';
import KioskPortal from './portals/KioskPortal';
import LecturerPortal from './portals/LecturerPortal';
import AdminPortal from './portals/AdminPortal';
import LoginGate from './components/LoginGate';
import { studentService } from './services/api';

import { 
  INITIAL_DEVICES, 
  MOCK_ROSTER 
} from './data/mockDb';

function PortalCoordinator() {
  // Navigation: 'landing', 'portal_1', 'portal_2', 'portal_3', 'portal_4'
  const [currentPortal, setCurrentPortal] = useState('landing');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Roster / Database states
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [rosterList, setRosterList] = useState(MOCK_ROSTER);

  // Fetch students on mount
  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        console.log("Fetching students from backend...");
        const data = await studentService.getAll();
        console.log("Students received:", data);
        // Map backend student to frontend format if needed
        const mappedStudents = data.map(s => ({
          id: s.id,
          matric: s.matric_number,
          name: `${s.first_name} ${s.last_name}`,
          dept: s.department_id === 1 ? 'Computer Science' : 'Engineering', // Placeholder mapping
          status: s.biometrics?.length > 0 ? 'Enrolled' : 'Pending',
          attendance: '0%' // Placeholder
        }));
        setStudents(mappedStudents);
      } catch (error) {
        console.error("Failed to load students from backend. Using mock data for development fallback.", error);
        // Fallback to mock data if backend fails, for better DX
        const { INITIAL_STUDENTS } = await import('./data/mockDb');
        setStudents(INITIAL_STUDENTS);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // Portal Authentication gate checks
  const [portalLogins, setPortalLogins] = useState({
    portal_1: false,
    portal_3: false,
    portal_4: false
  });

  // Kiosk view status
  const [kioskState, setKioskState] = useState('idle');
  const [kioskVerifiedStudent, setKioskVerifiedStudent] = useState(null);

  // Lecturer filter reports states
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reportingFilters, setReportingFilters] = useState({ course: 'CSC-101', date: '2026-06-14' });
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Admin allocations states
  const [newDeviceForm, setNewDeviceForm] = useState({ name: '', location: '', ip: '' });
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [selectedRiskStudent, setSelectedRiskStudent] = useState(null);

  // Launch portal helper
  const handleLaunchPortal = (portalId) => {
    setCurrentPortal(portalId);
    setActiveScreen('dashboard');
  };

  // Exit portal helper
  const handleExitPortal = (portalId) => {
    if (portalId) {
      setPortalLogins(prev => ({ ...prev, [portalId]: false }));
    }
    setCurrentPortal('landing');
  };

  // Authenticate staff roles helper
  const handleAuthenticate = (portalId) => {
    setPortalLogins(prev => ({ ...prev, [portalId]: true }));
  };

  // Export report pings
  const startReportExport = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      setDownloadingReport(false);
      alert('Report downloaded successfully.');
    }, 2000);
  };

  // Add hardware device
  const handleAddDeviceSubmit = (e) => {
    e.preventDefault();
    const newDev = {
      id: `DEV-0${devices.length + 1}`,
      name: newDeviceForm.name,
      location: newDeviceForm.location,
      status: 'Ready',
      ip: newDeviceForm.ip,
      latency: '15ms'
    };
    setDevices(prev => [...prev, newDev]);
    setShowAddDeviceModal(false);
    setNewDeviceForm({ name: '', location: '', ip: '' });
  };

  return (
    <>
      {currentPortal === 'landing' && (
        <LandingPortal onLaunchPortal={handleLaunchPortal} />
      )}

      {currentPortal === 'portal_1' && (
        !portalLogins.portal_1 ? (
          <LoginGate 
            portalTitle="Biometric Enrollment Registry"
            primaryColor="#1E40AF"
            role="Registration Officer"
            onSubmit={() => handleAuthenticate('portal_1')}
            onCancel={() => handleExitPortal(null)}
          />
        ) : (
          <RegistrationPortal 
            students={students}
            setStudents={setStudents}
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            onLogout={() => handleExitPortal('portal_1')}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )
      )}

      {currentPortal === 'portal_2' && (
        <KioskPortal 
          students={students}
          kioskState={kioskState}
          setKioskState={setKioskState}
          kioskVerifiedStudent={kioskVerifiedStudent}
          setKioskVerifiedStudent={setKioskVerifiedStudent}
          setRosterList={setRosterList}
          onExit={() => handleExitPortal(null)}
        />
      )}

      {currentPortal === 'portal_3' && (
        !portalLogins.portal_3 ? (
          <LoginGate 
            portalTitle="Lecturer Roster Management"
            primaryColor="#D97706"
            role="Lecturer"
            onSubmit={() => handleAuthenticate('portal_3')}
            onCancel={() => handleExitPortal(null)}
          />
        ) : (
          <LecturerPortal 
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            onLogout={() => handleExitPortal('portal_3')}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            rosterList={rosterList}
            setRosterList={setRosterList}
            reportingFilters={reportingFilters}
            setReportingFilters={setReportingFilters}
            downloadingReport={downloadingReport}
            startReportExport={startReportExport}
          />
        )
      )}

      {currentPortal === 'portal_4' && (
        !portalLogins.portal_4 ? (
          <LoginGate 
            portalTitle="Admin Command Center"
            primaryColor="#DC2626"
            role="Admin"
            onSubmit={() => handleAuthenticate('portal_4')}
            onCancel={() => handleExitPortal(null)}
          />
        ) : (
          <AdminPortal 
            students={students}
            setStudents={setStudents}
            devices={devices}
            setDevices={setDevices}
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            onLogout={() => handleExitPortal('portal_4')}
            showAddDeviceModal={showAddDeviceModal}
            setShowAddDeviceModal={setShowAddDeviceModal}
            newDeviceForm={newDeviceForm}
            setNewDeviceForm={setNewDeviceForm}
            selectedRiskStudent={selectedRiskStudent}
            setSelectedRiskStudent={setSelectedRiskStudent}
            handleAddDeviceSubmit={handleAddDeviceSubmit}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )
      )}
    </>
  );
}

function App() {
  return (
    <ScannerProvider>
      <PortalCoordinator />
    </ScannerProvider>
  );
}

export default App;
