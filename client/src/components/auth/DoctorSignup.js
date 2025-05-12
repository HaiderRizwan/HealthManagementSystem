import React, { useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
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
    fontSize: '38px',
    color: '#0055a4',
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

const DoctorSignup = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specializationName: '',
    affiliation: '',
    contactNumber: '',
    termsAndConditions: false,
  });

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validateContactNumber = (number) => {
    // Basic phone number validation
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(number);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear validation errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email";
    
    if (!formData.password) errors.password = "Password is required";
    else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }
    
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.licenseNumber.trim()) errors.licenseNumber = "License number is required";
    if (!formData.specializationName.trim()) errors.specializationName = "Specialization is required";
    
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    else if (!validateContactNumber(formData.contactNumber)) {
      errors.contactNumber = "Please enter a valid contact number";
    }
    
    if (!formData.termsAndConditions) errors.termsAndConditions = "You must agree to the terms and conditions";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Doctor Signup Data:', formData);
  
    // Validate form
    if (!validateForm()) {
      setErrorMessage('Please correct the errors in the form.');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const response = await axios.post(buildApiUrl('/api/signup/doctor'), formData);
      console.log('Signup successful:', response.data);
  
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        specializationName: '',
        affiliation: '',
        contactNumber: '',
        termsAndConditions: false,
      });
  
      // Show success message
      setSuccessMessage('Registration successful! Your account is pending admin approval. You will be notified when your account is approved.');
      setOpenSnackbar(true);
      
      // Redirect after showing the message
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      
      // Handle specific server errors
      if (error.response && error.response.data) {
        if (error.response.data.code === 11000) {
          // MongoDB duplicate key error
          setErrorMessage('This email is already registered. Please use a different email.');
        } else {
          setErrorMessage(error.response.data.message || 'Signup failed. Please try again.');
        }
      } else {
        setErrorMessage('Network error. Please check your connection and try again.');
      }
      
      setOpenSnackbar(true);
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h1" className={classes.title}>Doctor Signup</Typography>

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
            error={!!formErrors.fullName}
            helperText={formErrors.fullName}
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
            error={!!formErrors.email}
            helperText={formErrors.email}
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
            error={!!formErrors.password}
            helperText={formErrors.password}
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
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />

          <TextField
            type="text"
            name="licenseNumber"
            label="Medical License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
            error={!!formErrors.licenseNumber}
            helperText={formErrors.licenseNumber}
          />

          <TextField
            type="text"
            name="specializationName"
            label="Specialization"
            value={formData.specializationName}
            onChange={handleChange}
            required
            className={classes.input}
            fullWidth
            variant="outlined"
            error={!!formErrors.specializationName}
            helperText={formErrors.specializationName}
          />

          <TextField
            type="text"
            name="affiliation"
            label="Hospital/Clinic Affiliation"
            value={formData.affiliation}
            onChange={handleChange}
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
            error={!!formErrors.contactNumber}
            helperText={formErrors.contactNumber}
          />

          <div className={classes.checkboxContainer} style={{color: formErrors.termsAndConditions ? 'red' : 'inherit'}}>
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
          {formErrors.termsAndConditions && (
            <Typography color="error" variant="body2" style={{marginTop: '-10px', marginBottom: '10px'}}>
              {formErrors.termsAndConditions}
            </Typography>
          )}

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

export default DoctorSignup;
