import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalHospital as DoctorIcon,
  People as PatientIcon,
  EventNote as AppointmentIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  BarChart as AnalyticsIcon,
  MonetizationOn as BillingIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/AdminProfile' },
    { text: 'Doctors', icon: <DoctorIcon />, path: '/doctors' },
    { text: 'Patients', icon: <PatientIcon />, path: '/patients' },
    { text: 'Appointments', icon: <AppointmentIcon />, path: '/appointments' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Billing', icon: <BillingIcon />, path: '/billing' }
  ];

  return (
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
          {menuItems.map((item, index) => (
            <ListItemButton
              key={index}
              component={Link} 
              to={item.path} 
              selected={isCurrentPath(item.path)}
              sx={{ 
                borderRadius: 1, 
                mb: 1, 
                bgcolor: isCurrentPath(item.path) ? "#e0e7ff" : "transparent",
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
                  fontWeight: isCurrentPath(item.path) ? "medium" : "normal" 
                }} 
              />
            </ListItemButton>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <ListItemButton
            component={Link} 
            to="/profile" 
            selected={isCurrentPath('/profile')}
            sx={{ 
              borderRadius: 1, 
              mb: 1, 
              bgcolor: isCurrentPath('/profile') ? "#e0e7ff" : "transparent",
              '&:hover': {
                bgcolor: '#f0f7ff'
              }
            }}
          >
            <ListItemIcon>
              <ProfileIcon color={isCurrentPath('/profile') ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
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
  );
};

export default AdminSidebar; 