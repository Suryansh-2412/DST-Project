import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import SettingsPage from './pages/dashboard/SettingsPage';

// Doctor Pages
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import PatientList from './pages/dashboard/doctor/PatientList';
import PatientProfile from './pages/dashboard/doctor/PatientProfile';

// Patient Pages
import PatientHome from './pages/dashboard/patient/PatientHome';
import PatientRecords from './pages/dashboard/patient/PatientRecords';
import PatientCheckIn from './pages/dashboard/patient/PatientCheckIn';
import AssistantGate from './components/patient/AssistantGate';

// Admin Pages
import AdminHome from './pages/dashboard/admin/AdminHome';
import DoctorVerification from './pages/dashboard/admin/DoctorVerification';
import ModelManagement from './pages/dashboard/admin/ModelManagement';

function App() {
  const [isLoggedIn] = React.useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={(<DashboardLayout role="admin" />)}>
          <Route index element={<AdminHome />} />
          <Route path="verify" element={<DoctorVerification />} />
          <Route path="models" element={<ModelManagement />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/dashboard/doctor" element={(<DashboardLayout role="doctor" />)}>
          <Route index element={<DoctorDashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="monitoring" element={<div className="text-center text-gray-500 mt-20">Full Monitoring Dashboard Coming Soon</div>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Patient Routes */}
        <Route path="/dashboard/patient" element={(<DashboardLayout role="patient" />)}>
          <Route index element={<PatientHome />} />
          <Route path="records" element={<PatientRecords />} />
          <Route path="checkin" element={<PatientCheckIn />} />
          <Route path="chat" element={<AssistantGate />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Legacy/Redirect */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        
        {/* Catch-all Route to prevent blank pages */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
