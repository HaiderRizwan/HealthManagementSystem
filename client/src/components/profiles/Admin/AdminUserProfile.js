import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import AdminSidebar from './AdminSidebar';

const AdminUserProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Haider Saleemi',
    email: 'admin@example.com',
    role: 'Admin',
    joinDate: '2024-02-01',
    lastLogin: new Date().toLocaleString(),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Profile
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
              {/* Profile Overview */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: '#2563eb',
                      fontSize: '2.5rem',
                      mr: 3
                    }}
                  >
                    HS
                  </Avatar>
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {profileData.fullName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {profileData.role}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={profileData.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Join Date"
                      secondary={profileData.joinDate}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Last Login"
                      secondary={profileData.lastLogin}
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Additional Profile Sections */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      System Access
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Role"
                          secondary="System Administrator"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Access Level"
                          secondary="Full Access"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Account Status"
                          secondary="Active"
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="System Update"
                          secondary="Updated system settings - 2 hours ago"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="User Management"
                          secondary="Added new doctor - 1 day ago"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Configuration"
                          secondary="Modified security settings - 3 days ago"
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminUserProfile; 