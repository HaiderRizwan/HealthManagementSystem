import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AiChatbot from './Client/AiChatbot';
import Appointments from './Client/Appointments';
import AppointmentView from './Client/AppointmentView';
import MedicalRecords from './Client/MedicalRecords';
import HealthArticle from './Client/HealthActivity';
// import Timer from '../auth/Timer';
import Stats from './Client/stats';
import ProfileSettings from './ProfileSettings';
import { 
  Typography, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button, 
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
  Container,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const ClientProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [upcomingAppointment, setUpcomingAppointment] = useState({
    doctor: "Dr. Sarah Johnson",
    date: "Tomorrow",
    time: "10:30 AM",
  });

  useEffect(() => {
    console.log('Location state:', location.state);
    
    if (location.state?.user) {
      console.log('User data from location state:', location.state.user);
      setUserData(location.state.user);
    } else {
      console.log('No user data in location state, checking token...');
      // Try to get user data from JWT token
      const token = localStorage.getItem('token');
      if (token) {
        // If we have a token, we can either:
        // 1. Decode the token to get basic user info
        try {
          // Simple JWT decoding (not secure, just for display purposes)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          console.log('Decoded token:', decodedToken);
          
          // Set minimal user data from token
          setUserData({
            _id: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken.role
          });
          
          // 2. Make an API call to get full user data
          // This would be better in a production app
          // fetchUserData(decodedToken.userId);
        } catch (error) {
          console.error('Error decoding token:', error);
          navigate('/login');
        }
      } else {
        // If no user data and no token, redirect to login
        console.log('No token found, redirecting to login');
      navigate('/login');
    }
    }

    // Set a random number for notifications (just for demo)
    setNotificationCount(Math.floor(Math.random() * 5));
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [location.state, navigate]);

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderContent = () => {
    if (!userData) {
      return <Typography>Loading...</Typography>;
    }

    switch (activeSection) {
      case 'appointments':
        return <Appointments userId={userData._id} />;
      case 'view-appointments':
        return <AppointmentView userId={userData._id} />;
      case 'medical-assistant':
        return <AiChatbot />;
      case 'medical-records':
        return <MedicalRecords userId={userData._id} />;
      case 'health-stats':
        return <Stats userId={userData._id} />;
      case 'profile-settings':
        return <ProfileSettings userId={userData._id} userRole="patient" />;
      case 'health-articles':
        return <HealthArticle />;
      default:
        return (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {/* Welcome Card */}
                <Grid item xs={12} md={8}>
                  <Card elevation={2} sx={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Typography variant="h4" gutterBottom>
                          Welcome back, {userData.fullName || userData.email.split('@')[0]}!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                          {formatDate(currentTime)} • {formatTime(currentTime)}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          Your health dashboard is ready. Keep track of your appointments, medical records, and health statistics all in one place.
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="secondary"
                          onClick={() => navigateToSection('appointments')}
                          sx={{ 
                            bgcolor: 'white', 
                            color: '#1d4ed8',
                            '&:hover': { bgcolor: '#f0f7ff', color: '#1d4ed8' }
                          }}
                        >
                          Book Appointment
                        </Button>
                      </Box>
                      {/* Decorative circles */}
                      <Box sx={{ 
                        position: 'absolute', 
                        top: -20, 
                        right: -20, 
                        width: 120, 
                        height: 120, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(255,255,255,0.1)' 
                      }} />
                      <Box sx={{ 
                        position: 'absolute', 
                        bottom: -40, 
                        right: 80, 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(255,255,255,0.1)' 
                      }} />
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Next Appointment Card */}
                <Grid item xs={12} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarMonthIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography variant="h6">
                          Next Appointment
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: '#f0f7ff', 
                        borderRadius: 2,
                        border: '1px dashed #bfdbfe'
                      }}>
                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                          {upcomingAppointment.doctor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {upcomingAppointment.date}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {upcomingAppointment.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        color="primary"
                        onClick={() => navigateToSection('view-appointments')}
                        sx={{ mt: 2 }}
                      >
                        View All Appointments
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Quick Access Cards */}
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Quick Access
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { title: 'Health Statistics', icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />, section: 'health-stats', color: '#3b82f6' },
                      { title: 'Medical Records', icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />, section: 'medical-records', color: '#10b981' },
                      { title: 'Book Appointment', icon: <EventNoteIcon sx={{ fontSize: 40 }} />, section: 'appointments', color: '#f59e0b' },
                      { title: 'AI Assistant', icon: <SmartToyIcon sx={{ fontSize: 40 }} />, section: 'medical-assistant', color: '#8b5cf6' },
                      { title: 'Health Articles', icon: <VisibilityIcon sx={{ fontSize: 40 }} />, section: 'health-articles', color: '#ec4899' }
                    ].map((item, index) => (
                      <Grid item xs={6} sm={4} md={2.4} key={index}>
                        <Card 
                          elevation={1} 
                          sx={{ 
                            textAlign: 'center', 
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }
                          }}
                          onClick={() => navigateToSection(item.section)}
                        >
                          <CardContent>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              mb: 2,
                              color: 'white',
                              bgcolor: item.color,
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              mx: 'auto',
                              alignItems: 'center'
                            }}>
                              {item.icon}
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                              {item.title}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            
            <Stats userId={userData._id} />
          </Box>
        );
    }
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, section: 'profile' },
    { text: 'Book Appointments', icon: <EventNoteIcon />, section: 'appointments' },
    { text: 'View Appointments', icon: <VisibilityIcon />, section: 'view-appointments' },
    { text: 'Medical Records', icon: <MedicalServicesIcon />, section: 'medical-records' },
    { text: 'Health Stats', icon: <HealthAndSafetyIcon />, section: 'health-stats' },
    { text: 'Medical Assistant', icon: <SmartToyIcon />, section: 'medical-assistant' },
    { text: 'Health Articles', icon: <VisibilityIcon />, section: 'health-articles' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
        <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              HealthCare Patient
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Notifications">
                <IconButton color="inherit" size="large">
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Settings">
                <IconButton 
                  color="inherit" 
                  size="large" 
                  sx={{ mx: 1 }}
                  onClick={() => navigateToSection('profile-settings')}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Profile">
                <IconButton color="inherit" size="large">
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: "#1e40af" }}
                    alt={userData.fullName || userData.email}
                  >
                    {(userData.fullName?.charAt(0) || userData.email?.charAt(0) || "P").toUpperCase()}
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
                    onClick={handleLogout}
                    sx={{ 
                      borderRadius: 1,
                      color: "#ef4444",
                      '&:hover': {
                        bgcolor: '#fee2e2'
                }
              }}
            >
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: "#ef4444" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
        </List>
              </Paper>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12} md={9} lg={10}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  minHeight: "70vh"
                }}
              >
          {renderContent()}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ClientProfile;
