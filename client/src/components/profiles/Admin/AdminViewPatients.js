import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  AppBar,
  Toolbar,
  Box,
  Avatar,
  IconButton,
  Breadcrumbs,
  Chip,
  Divider,
  CircularProgress,
  Container
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AdminSidebar from './AdminSidebar';

function PatientCard({ patient }) {

  const getPatientName = () => {
    if (patient.fullName) {
      return patient.fullName;
    }
    

    if (patient.firstName && patient.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    }
    
    if (patient.firstName) {
      return patient.firstName;
      
    }
    
    if (patient.lastName) {
      return patient.lastName;
    }
    
    if (patient.fullName) {
      return patient.fullName;
    }
    
    return "Unknown Patient";
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date of birth to a more readable format
  const formatDOB = (dob) => {
    if (!dob) return "Not provided";
    const date = new Date(dob);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Generate avatar with initials if no profile picture
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Determine avatar color based on patient ID
  const getAvatarColor = (id) => {
    const colors = [
      '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', 
      '#c2185b', '#0288d1', '#303f9f', '#00796b',
      '#689f38', '#fbc02d', '#455a64', '#e64a19'
    ];
    
    // Simple hash function to get consistent color for same patient
    const hash = (id || '').split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get the patient's full name
  const patientName = getPatientName();

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      overflow: 'visible',
      position: 'relative',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }
    }}>
      {/* Patient Status Indicator */}
      <Chip
        label={patient.status || "Active"}
        color={patient.status === "Inactive" ? "error" : "success"}
        size="small"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1
        }}
      />
      
      {/* Patient Info Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4eaed 100%)',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 2 
      }}>
        <Avatar
          sx={{ 
            width: 80, 
            height: 80, 
            border: '3px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            bgcolor: getAvatarColor(patient._id)
          }}
        >
          {getInitials(patientName)}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.dark">
            {patientName}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {patient.gender || "Not specified"} • {calculateAge(patient.dateOfBirth)} years
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              DOB: {formatDOB(patient.dateOfBirth)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ pt: 2, pb: 2, flexGrow: 1 }}>
        {/* Contact Information */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {patient.email || "No email provided"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {patient.contactNumber || patient.phone || "No phone number"}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Medical Information */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LocalHospitalIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Blood Type:</strong> {patient.bloodType || "Not provided"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <EventNoteIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Last Visit:</strong> {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "No visits recorded"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      {/* Action Buttons */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              component={Link}
              to={`/patients/${patient._id}`}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              View Details
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              component={Link}
              to={`/patients/${patient._id}/history`}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Medical History
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

function ViewPatients() {
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userRes = await fetch("http://localhost:5000/fetch_user?role=Patient");
      
      if (!userRes.ok) {
        throw new Error(`Failed to fetch patients: ${userRes.status} ${userRes.statusText}`);
      }
      
      const userData = await userRes.json();
      console.log("Fetched user data:", userData);
      
      // Get detailed patient data for each user
      const patientData = await Promise.all(
        userData.map(async (user) => {
          try {
            const res = await fetch(`http://localhost:5000/fetch_patient/${user._id}`);
            if (!res.ok) return {};
            const patientDetails = await res.json();
            console.log(`Patient details for ${user._id}:`, patientDetails);
            return patientDetails;
          } catch (err) {
            console.error(`Error fetching details for patient ${user._id}:`, err);
            return {};
          }
        })
      );

      // Combine user data with patient details
      const populatedData = userData.map((user, index) => {
        // If user data has a name property that contains a full name
        const fullName = user.fullName && typeof user.fullName === 'string' 
          ? user.name 
          : (user.firstName && user.lastName) 
            ? `${user.firstName} ${user.lastName}` 
            : (user.firstName || user.lastName || "Unknown");
        
        return {
          ...user,
          ...patientData[index],
          fullName: fullName
        };
      });
      
      console.log("Final patient data:", populatedData);
      setPatientsData(populatedData);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError(`Failed to load patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPatientData(); 
  }, []);

  const handleBack = () => {
    navigate('/AdminProfile');
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patients Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <Grid item xs={12} md={9} lg={10}>
            <Box sx={{ p: 3 }}>
              {/* Breadcrumb navigation */}
              <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link 
                  to="/AdminProfile"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#2d90d2',
                    textDecoration: 'none' 
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Admin Dashboard
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  Patients
                </Typography>
              </Breadcrumbs>

              {/* Patient Overview */}
              <Box 
                sx={{ 
                  mb: 4, 
                  p: 2, 
                  backgroundColor: 'white', 
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Patient Overview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd', borderRadius: 2 }}>
                      <Typography variant="h5" color="primary">{patientsData.length}</Typography>
                      <Typography variant="body2">Total Patients</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9', borderRadius: 2 }}>
                      <Typography variant="h5" color="success.main">
                        {patientsData.filter(p => p.status !== "Inactive").length}
                      </Typography>
                      <Typography variant="body2">Active Patients</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#fff8e1', borderRadius: 2 }}>
                      <Typography variant="h5" color="warning.main">
                        {patientsData.filter(p => p.lastVisit && new Date(p.lastVisit) > new Date(Date.now() - 30*24*60*60*1000)).length}
                      </Typography>
                      <Typography variant="body2">Recent Visits (30d)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee', borderRadius: 2 }}>
                      <Typography variant="h5" color="error.main">
                        {patientsData.filter(p => p.status === "Inactive").length}
                      </Typography>
                      <Typography variant="body2">Inactive Patients</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Patient List */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="h6" color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={fetchPatientData}
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </Button>
                </Box>
              ) : patientsData.length === 0 ? (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 8, 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="h6" gutterBottom>No patients found.</Typography>
                  <Typography color="text.secondary">
                    There are no patients registered in the system.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {patientsData.map((patient) => (
                    <Grid item xs={12} sm={6} md={4} key={patient._id}>
                      <PatientCard patient={patient} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ViewPatients;