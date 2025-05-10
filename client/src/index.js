import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Options from './components/auth/Options.js';
import Login from './components/auth/Login.js';
// import Home from './components/pages/Home.js';
import ClientSignup from './components/auth/ClientSignup.js';
import DoctorSignup from './components/auth/DoctorSignup.js';
import AdminSignup from './components/auth/AdminSignup.js';
//profiles
import AdminProfile from './components/profiles/AdminProfile.js'
import ClientProfile from './components/profiles/ClientProfile.js'
import DoctorProfile from './components/profiles/DoctorProfile.js';
import AdminProfileSettings from './components/profiles/Admin/AdminProfileSettings.js';

//client functionalities
import Appointments from './components/profiles/Client/Appointments.js';
import MedicalRecords from './components/profiles/Client/MedicalRecords.js';
import AddRecord from './components/profiles/Client/AddRecord.js';
import ClientBookAppointment from './components/profiles/Client/ClientBookAppointment.js';

//doctor functionalities
import AppointmentDoctor from './components/profiles/Doctor/Appointments.js';
import ManageSchedule from './components/profiles/Doctor/ManageSchedule.js';

//Admin
import Appointment from './components/profiles/Admin/AppointmentAdmin.js';
import ViewDoctor from './components/profiles/Admin/ViewDoctorsAdmin.js';
import ViewPatients from './components/profiles/Admin/AdminViewPatients.js';
import Analytics from './components/profiles/Admin/Analytics.js';
import Billing from './components/profiles/Admin/Billing.js';
import AdminAppointments from './components/profiles/Admin/AdminAppointments.js';

function Root() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedSignup, setSelectedSignup] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);

  };
  const handleSignup = (option) => {
    setSelectedSignup(option);

  };

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Options onOptionChange={handleOptionChange} />} />
          <Route path="/login" element={<Login onSignupChange={handleSignup} selectedOption={selectedOption} />} />
          <Route path="/DoctorSignup" element={<DoctorSignup />} />
          <Route path="/ClientSignup" element={<ClientSignup />} />
          <Route path="/AdminSignup" element={<AdminSignup />} />

          {/* Redirect PatientProfile to ClientProfile */}
          <Route path="/PatientProfile" element={<Navigate to="/ClientProfile" replace />} />

          {/* Protected routes - Admin */}
          <Route path="/AdminProfile" element={
            <ProtectedRoute requiredRole="admin">
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="admin">
              <AdminProfileSettings />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute requiredRole="admin">
              <AdminAppointments />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute requiredRole="admin">
              <Billing />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - Client */}
          <Route path="/ClientProfile" element={
            <ProtectedRoute requiredRole="client">
              <ClientProfile />
            </ProtectedRoute>
          } />
          
          {/* Protected routes - Doctor */}
          <Route path="/DoctorProfile" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          } />

          {/* Protected client functionalities */}
          <Route path="/profile/appointments" element={
            <ProtectedRoute requiredRole="client">
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/profile/medical-records" element={
            <ProtectedRoute requiredRole="client">
              <MedicalRecords />
            </ProtectedRoute>
          } />
          <Route path="/client/add-record" element={
            <ProtectedRoute requiredRole="client">
              <AddRecord />
            </ProtectedRoute>
          } />

          {/* Protected doctor functionalities */}
          <Route path="/doctorProfile/appointments" element={
            <ProtectedRoute requiredRole="doctor">
              <AppointmentDoctor />
            </ProtectedRoute>
          } />
          <Route path="/doctorProfile/manageSchedule" element={
            <ProtectedRoute requiredRole="doctor">
              <ManageSchedule />
            </ProtectedRoute>
          } />

          {/* Protected admin functionalities */}
          <Route path="/doctors" element={
            <ProtectedRoute requiredRole="admin">
              <ViewDoctor />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:doctorId" element={
            <ProtectedRoute requiredRole="admin">
              <Appointment />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute requiredRole="admin">
              <ViewPatients />
            </ProtectedRoute>
          } />
          
          {/* Redirect /admin to AdminProfile for backward compatibility */}
          <Route path="/admin" element={<Navigate to="/AdminProfile" replace />} />
          <Route path="/admin/*" element={<Navigate to="/AdminProfile" replace />} />
        </Routes>
      </Router>

    </React.StrictMode>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Root />);