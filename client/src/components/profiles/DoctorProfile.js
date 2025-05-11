import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppointmentDoctor from './Doctor/Appointments';
import ManageSchedule from './Doctor/ManageSchedule';
import AppointmentStats from './AppointmentStats';
import AppointmentList from './AppointmentList';
import ProfileSettings from './ProfileSettings';
import axios from 'axios';
import { 
  Typography, 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Grid,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  Container
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { buildApiUrl } from '../../config/api';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const theme = createTheme();

const DoctorProfile = () => {
  const [appointmentsData, setAppointmentsData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (location.state?.user) {
      setUserData(location.state.user);
    } else {
      // Try to get user data from JWT token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Simple JWT decoding (not secure, just for display purposes)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          setUserData({ _id: decodedToken.userId, email: decodedToken.email });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!userData || !userData._id) return;

        const response = await axios.get(buildApiUrl(`/appointments/doctor/${userData._id}`));
        const appointments = response.data;
        let pendingCount = 0;
        let confirmedCount = 0;
        let cancelledCount = 0;
        let completedCount = 0;
        
        appointments.forEach(appointment => {
          switch (appointment.status) {
            case 'Pending':
              pendingCount++;
              break;
            case 'Confirmed':
              confirmedCount++;
              break;
            case 'Cancelled':
              cancelledCount++;
              break;
            case 'Completed':
              completedCount++;
              break;
            default:
              break;
          }
        });
        
        setAppointmentsData({
          pending: { count: pendingCount, isLoading: false, error: null },
          confirmed: { count: confirmedCount, isLoading: false, error: null },
          cancelled: { count: cancelledCount, isLoading: false, error: null },
          completed: { count: completedCount, isLoading: false, error: null }
        });
        
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    
    if (userData) {
      fetchAppointments();
    }
  }, [userData]);

  const navigateToSection = (section) => {
    setActiveSection(section);
  };

  const isCurrentSection = (section) => {
    return activeSection === section;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const renderContent = () => {
    if (!userData) {
      return <Typography>Loading...</Typography>;
    }

    switch (activeSection) {
      case 'appointments':
        return <AppointmentDoctor userId={userData._id} />;
      case 'manage-schedule':
        return <ManageSchedule userId={userData._id} />;
      case 'profile-settings':
        return <ProfileSettings userId={userData._id} userRole="doctor" />;
      case 'patients':
        return <AppointmentDoctor userId={userData._id} patientView={true} />;
      default:
        return (
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              color: '#1976d2',
              borderBottom: '2px solid #1976d2',
              paddingBottom: 1,
              marginBottom: 3
            }}>
              Doctor Dashboard
            </Typography>
            {appointmentsData && (
              <AppointmentStats appointmentsData={appointmentsData} />
            )}
            <AppointmentList doctorId={userData._id}/>
          </Box>
        );
    }
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, section: 'profile' },
    { text: 'Appointments', icon: <EventNoteIcon />, section: 'appointments' },
    { text: 'Manage Schedule', icon: <CalendarMonthIcon />, section: 'manage-schedule' },
    { text: 'Patients', icon: <PersonIcon />, section: 'patients' },
    { text: 'Settings', icon: <SettingsIcon />, section: 'profile-settings' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
        <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              HealthCare Doctor
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Notifications">
                <IconButton color="inherit" size="large">
                  <Badge badgeContent={appointmentsData?.pending?.count || 0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton color="inherit" size="large" sx={{ mx: 1 }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Profile">
                <IconButton color="inherit" size="large">
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: "#1e40af" }}
                    alt={userData.fullName || userData.email}
                  >
                    {(userData.fullName?.charAt(0) || userData.email?.charAt(0) || "D").toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={3}>
            {/* Static Sidebar */}
            <Grid item xs={12} md={3} lg={2}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: "100%", 
                  borderRadius: 2,
                  display: { xs: "none", md: "block" } 
                }}
              >
                <List component="nav">
                  {menuItems.map((item) => (
                    <ListItemButton
                      key={item.section}
                      onClick={() => navigateToSection(item.section)} 
                      selected={isCurrentSection(item.section)}
                      sx={{ 
                        borderRadius: 1, 
                        mb: 1, 
                        bgcolor: isCurrentSection(item.section) ? "#e0e7ff" : "transparent",
                        '&:hover': {
                          bgcolor: '#f0f7ff'
                        }
                      }}
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontWeight: isCurrentSection(item.section) ? "medium" : "normal" 
                        }} 
                      />
                    </ListItemButton>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <ListItemButton
                    onClick={() => navigateToSection('profile-settings')}
                    selected={isCurrentSection('profile-settings')}
                    sx={{ 
                      borderRadius: 1, 
                      mb: 1, 
                      bgcolor: isCurrentSection('profile-settings') ? "#e0e7ff" : "transparent",
                      '&:hover': {
                        bgcolor: '#f0f7ff'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile Settings" />
                  </ListItemButton>
                  
                  <ListItemButton
                    onClick={handleLogout} 
                    sx={{ 
                      borderRadius: 1, 
                      color: "error.main", 
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#fee2e2'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12} md={9} lg={10}>
              <Box sx={{ p: 3 }}>
                {renderContent()}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DoctorProfile;
