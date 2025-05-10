import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '../ProfileSettings';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Avatar, 
  Badge, 
  Tooltip,
  Container,
  Grid
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminSidebar from './AdminSidebar';

const AdminProfileSettings = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Get user ID from token
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
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
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
                >
                  A
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
              {userId && <ProfileSettings userId={userId} userRole="admin" />}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminProfileSettings; 