import React, { useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '../../config/api';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #001f3f 0%, #0074D9 100%)',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  card: {
    backgroundColor: '#ffffff',
    marginTop: '35px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    maxWidth: '450px',
    padding: '30px',
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.3)',
    },
  },
  title: {
    color: '#0055a4',
    fontSize: '38px',
    marginBottom: '25px',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  input: {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: '0 0 5px rgba(25, 118, 210, 0.3)',
      },
    },
  },
  button: {
    marginTop: '25px',
    borderRadius: '10px',
    padding: '12px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #0055a4 30%, #1976d2 90%)',
    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
    transition: 'all 0.3s',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 5px 10px 2px rgba(25, 118, 210, .4)',
    },
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    marginBottom: '15px',
  },
  checkbox: {
    marginRight: '10px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#555',
  },
});

const AdminSignup = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',
    contactNumber: '',
    termsAndConditions: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Admin Signup Data:', formData);
    
    // Input validation conditions
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(buildApiUrl('/api/signup/admin'), formData);
      console.log('Signup successful:', response.data);
      
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Admin',
        contactNumber: '',
        termsAndConditions: false,
      });
      
      // Show success message
      setSuccessMessage('Registration successful! Redirecting to login...');
      setOpenSnackbar(true);
      
      // Redirect after showing the message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      setErrorMessage(error.response?.data?.message || 'Signup failed. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h1" className={classes.title}>Admin Signup</Typography>

          <TextField
            type="text"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
          />

          <TextField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
          />

          <TextField
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
          />

          <TextField
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
          />

          <TextField
            type="text"
            name="role"
            label="Role"
            value={formData.role}
            readOnly
            className={classes.input}
            fullWidth
            variant="outlined"
          />

          <TextField
            type="text"
            name="contactNumber"
            label="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
          />

          <div className={classes.checkboxContainer}>
            <input
              type="checkbox"
              name="termsAndConditions"
              checked={formData.termsAndConditions}
              onChange={handleChange}
              required
              className={classes.checkbox}
            />
            <span className={classes.checkboxLabel}>Agree to Terms and Conditions</span>
          </div>

          <Button 
            type="submit" 
            variant="contained" 
            className={classes.button} 
            onClick={handleSubmit}
            fullWidth
          >
            Signup
          </Button>
        </CardContent>
      </Card>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={successMessage ? "success" : "error"} 
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminSignup;
