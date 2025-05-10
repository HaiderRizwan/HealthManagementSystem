import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Paper,
  Divider,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  LocalHospital as DoctorIcon,
  People as PatientIcon,
  EventNote as AppointmentIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  BarChart as AnalyticsIcon,
  MonetizationOn as BillingIcon,
  Email as EmailIcon
} from "@mui/icons-material";
import AdminSidebar from './AdminSidebar';
import EmailDashboard from './EmailDashboard';
import axios from 'axios';

function AdminMain() {
  const [stats, setStats] = useState({
    doctors: 0,
    doctorsIncrease: '0 this month',
    patients: 0,
    patientsIncrease: '0 this week',
    appointments: 0,
    appointmentsIncrease: '0 today',
    pendingRequests: 0,
    pendingMessage: 'No pending requests'
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [recentActivities] = useState([
    { activity: "New doctor registered", time: "10 minutes ago" },
    { activity: "3 new appointments scheduled", time: "1 hour ago" },
    { activity: "Monthly report generated", time: "3 hours ago" },
    { activity: "System maintenance completed", time: "Yesterday" }
  ]);

  // Demo chart data
  const revenueData = [12000, 15000, 8000, 18000, 14000, 22000];
  const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const maxRevenue = Math.max(...revenueData);
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard statistics in one call
        const response = await axios.get('http://localhost:5000/dashboard/stats');
        const stats = response.data;

        setStats({
          doctors: stats.doctors.total,
          doctorsIncrease: `+${stats.doctors.newThisMonth} this month`,
          patients: stats.patients.total,
          patientsIncrease: `+${stats.patients.newThisWeek} this week`,
          appointments: stats.appointments.total,
          appointmentsIncrease: `+${stats.appointments.today} today`,
          pendingRequests: stats.appointments.pending,
          pendingMessage: stats.appointments.pending > 0 ? 'Action needed' : 'No pending requests'
        });

      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardStats, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            HealthCare Admin
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" size="large">
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton color="inherit" size="large" sx={{ mx: 1 }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profile">
              <IconButton 
                component={Link} 
                to="/profile" 
                color="inherit" 
                size="large"
              >
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: "#1e40af" }}
                  alt="Admin"
                >
                  HS
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <Grid item xs={12} md={9} lg={10}>
            <Box sx={{ p: 3 }}>
              {/* Welcome Message */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                  mb: 3,
                    borderRadius: 2, 
                    backgroundImage: "linear-gradient(to right, #2563eb, #3b82f6)",
                    color: "white"
                  }}
                >
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                  Welcome back, Haider Saleemi!
                  </Typography>
                  <Typography variant="body1">
                    Here's what's happening with your healthcare system today.
                  </Typography>
                </Paper>
              
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography color="text.secondary" gutterBottom>
                        Doctors
                      </Typography>
                      <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }}>
                        <DoctorIcon fontSize="small" />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.doctors}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        {stats.doctorsIncrease}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography color="text.secondary" gutterBottom>
                        Patients
                      </Typography>
                      <Avatar sx={{ bgcolor: "#fef3c7", color: "#d97706" }}>
                        <PatientIcon fontSize="small" />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.patients}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        {stats.patientsIncrease}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography color="text.secondary" gutterBottom>
                        Appointments
                      </Typography>
                      <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a" }}>
                        <AppointmentIcon fontSize="small" />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.appointments}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        {stats.appointmentsIncrease}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ borderRadius: 2, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography color="text.secondary" gutterBottom>
                        Pending
                      </Typography>
                      <Avatar sx={{ bgcolor: "#fee2e2", color: "#dc2626" }}>
                          <NotificationIcon fontSize="small" />
                      </Avatar>
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stats.pendingRequests}
                    </Typography>
                    <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                        {stats.pendingMessage}
                    </Typography>
                  </CardContent>
                </Card>
                </Grid>
              </Grid>
              
              {/* Email Dashboard Section */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <EmailDashboard />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Health Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AdminMain;