export const INITIAL_STUDENTS = [
  { matric: 'CSC/2026/001', name: 'John Doe', dept: 'Computer Science', status: 'Enrolled', attendance: '92%' },
  { matric: 'CSC/2026/002', name: 'Jane Smith', dept: 'Computer Science', status: 'Enrolled', attendance: '88%' },
  { matric: 'CSC/2026/003', name: 'Robert Johnson', dept: 'Electrical Eng.', status: 'Enrolled', attendance: '74%' },
  { matric: 'CSC/2026/004', name: 'Emily Davis', dept: 'Mechanical Eng.', status: 'Pending', attendance: '0%' },
  { matric: 'CSC/2026/005', name: 'Michael Brown', dept: 'Computer Science', status: 'Enrolled', attendance: '62%' }
];

export const INITIAL_DEVICES = [
  { id: 'DEV-01', name: 'Scanner 01 - Lecture Hall A', location: 'Hall A', status: 'Ready', ip: '192.168.1.101', latency: '12ms' },
  { id: 'DEV-02', name: 'Scanner 02 - Lecture Hall B', location: 'Hall B', status: 'Ready', ip: '192.168.1.102', latency: '14ms' },
  { id: 'DEV-03', name: 'Scanner 03 - Lab Room 102', location: 'Room 102', status: 'Offline', ip: '192.168.1.103', latency: '--' }
];

export const MOCK_COURSES = [
  { code: 'CSC-101', title: 'Intro to Computer Science', registered: 45, average: '88%' },
  { code: 'CSC-202', title: 'Data Structures & Algorithms', registered: 38, average: '82%' },
  { code: 'MTH-201', title: 'Linear Algebra', registered: 52, average: '78%' }
];

export const MOCK_ROSTER = [
  { name: 'John Doe', matric: 'CSC/2026/001', time: '08:05 AM', status: 'PRESENT' },
  { name: 'Jane Smith', matric: 'CSC/2026/002', time: '08:12 AM', status: 'PRESENT' },
  { name: 'Robert Johnson', matric: 'CSC/2026/003', time: '08:24 AM', status: 'LATE' },
  { name: 'Emily Davis', matric: 'CSC/2026/004', time: '--:--', status: 'ABSENT' },
  { name: 'Michael Brown', matric: 'CSC/2026/005', time: '--:--', status: 'ABSENT' }
];
