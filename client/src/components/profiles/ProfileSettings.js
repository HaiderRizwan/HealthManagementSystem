import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import { buildApiUrl } from '../../config/api';

const ProfileSettings = ({ userId, userRole }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(buildApiUrl(`/api/users/${userId}`));
        const user = response.data.user;
        
        setUserData(user);
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          contactNumber: user.contactNumber || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('Failed to load user data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.fullName) newErrors.fullName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    // Password validation (only if user is trying to change password)
    if (formData.newPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
      if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
      if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      // Prepare data for API
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber
      };
      
      // Add password change data if provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // Make API call to update profile
      await axios.put(buildApiUrl(`/api/users/${userId}`), updateData);
      
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      showNotification(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold',
        color: '#1976d2',
        borderBottom: '2px solid #1976d2',
        paddingBottom: 1,
        marginBottom: 3
      }}>
        Profile Settings
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Profile Photo Section */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  bgcolor: '#1976d2',
                  fontSize: '3rem'
                }}
              >
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{ mb: 2 }}
              >
                <input hidden accept="image/*" type="file" />
                <PhotoCameraIcon />
              </IconButton>
              <Typography variant="body2" color="textSecondary" align="center">
                Click to upload a profile photo
              </Typography>
              
              <Box sx={{ mt: 3, width: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Account Type
                </Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {userRole || 'User'}
                </Typography>
              </Box>
            </Grid>
            
            {/* Personal Information Section */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Submit Buttons */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                type="submit"
                disabled={saving}
                sx={{ mr: 2 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LockResetIcon />}
                disabled={saving || !formData.newPassword}
              >
                Reset Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileSettings; 