import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Home = () => {
  return (
    <Box>
      <Alert severity="info" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
        Debug: Home component loaded at {new Date().toLocaleString()}
      </Alert>
      
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1">
              Welcome to Health Hub
          </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Your Healthcare Management System
          </Typography>
      </Box>
    </Box>
  );
};

export default Home;