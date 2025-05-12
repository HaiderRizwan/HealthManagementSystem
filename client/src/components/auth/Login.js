import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { setAuthToken } from '../../utils/auth';
import { buildApiUrl, toggleApiEnvironment, getApiEnvironmentName } from '../../config/api';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const useStyles = makeStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #001f3f 0%, #0074D9 100%)',
    },
    card: {
      backgroundColor: '#ffffff',
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
    loginButton: {
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
    signupButton: {
      marginTop: '15px',
      borderRadius: '10px',
      padding: '12px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      border: '2px solid #0055a4',
      '&:hover': {
        backgroundColor: 'rgba(0, 85, 164, 0.08)',
        transform: 'scale(1.02)',
      },
    },
    errorMessage: {
      backgroundColor: 'rgba(211, 47, 47, 0.1)',
      color: '#d32f2f',
      padding: '10px 15px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontWeight: '500',
    },
    apiToggle: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }
  });
  

const Login = ({ selectedOption }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');
    const [apiEnv, setApiEnv] = useState(getApiEnvironmentName());
    const [useLocalApi, setUseLocalApi] = useState(localStorage.getItem('useLocalApi') === 'true');

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleApiToggle = () => {
        const isLocal = toggleApiEnvironment();
        setApiEnv(getApiEnvironmentName());
        setUseLocalApi(isLocal);
        // No need to reload the page on the login screen
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear validation errors when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            errors.email = "Please enter a valid email";
        }
        
        if (!formData.password) {
            errors.password = "Password is required";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        try {
            console.log('Attempting login with:', formData);
            console.log('API URL:', buildApiUrl('/api/login'));
            
            const response = await axios.post(buildApiUrl('/api/login'), formData);
            
            console.log('Login response received:', response.data);
            
            if (!response.data.token) {
                console.error('No token in response:', response.data);
                throw new Error('No token received from server');
            }

            // Store token and user role
            localStorage.setItem('token', response.data.token);
            const userRole = response.data.user.role === 'Patient' ? 'client' : response.data.user.role.toLowerCase();
            localStorage.setItem('userRole', userRole);
            
            // Set the auth token for future requests
            setAuthToken(response.data.token);
            
            console.log('Authentication successful, redirecting...');
            console.log('User role from server:', response.data.user.role);
            console.log('Mapped user role for localStorage:', userRole);
            
            // Map roles to their corresponding profile routes
            const roleToRoute = {
                'Admin': 'AdminProfile',
                'Doctor': 'DoctorProfile',
                'Patient': 'ClientProfile'
            };
            
            const redirectPath = `/${roleToRoute[response.data.user.role]}`;
            console.log('Redirect path:', redirectPath);
            
            if (!redirectPath) {
                throw new Error('Invalid user role');
            }
            
            // Navigate to the appropriate profile page
            console.log('Navigating to:', redirectPath);
            navigate(redirectPath, { state: { user: response.data.user } });
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Enhanced error handling
            const errorInfo = {
                message: error.message,
                name: error.name,
                isAxiosError: error.isAxiosError || false,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data,
                isTimeout: error.code === 'ECONNABORTED' || error.name === 'AbortError'
            };
            
            // Set appropriate error message
            if (errorInfo.isTimeout) {
                setError('Request timed out. Please check your internet connection or try again later.');
            } else if (error.response) {
                // Handle doctor approval pending message
                if (error.response.status === 403 && error.response.data?.approvalStatus === 'Pending') {
                    setError('Your doctor account is pending approval. You will be notified when an admin approves your account.');
                } else if (error.response.status === 403 && error.response.data?.approvalStatus === 'Rejected') {
                    setError('Your doctor account registration has been rejected. Please contact the administrator for more information.');
                } else if (error.response.status === 401) {
                    setError('Invalid email or password. Please try again.');
                } else {
                    setError(error.response.data?.message || 'Login failed. Please check your credentials.');
                }
            } else if (error.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    const handleSignup = () => {
        let optval = "/" + selectedOption + "Signup";
        console.log(optval);
        navigate(optval, { replace: true });
    };

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h1" className={classes.title}>
                        Login
                    </Typography>
                    
                    {error && (
                        <Typography className={classes.errorMessage}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleLogin}>
                        <div>
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                fullWidth
                                margin="normal"
                                autoComplete="email"
                                className={classes.input}
                                variant="outlined"
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </div>
                        <div>
                            <TextField
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                fullWidth
                                margin="normal"
                                autoComplete="current-password"
                                className={classes.input}
                                variant="outlined"
                                error={!!formErrors.password}
                                helperText={formErrors.password}
                            />
                        </div>
                        <Button 
                            type="submit"
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            className={classes.loginButton}
                        >
                            Login
                        </Button>
                    </form>
                    
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth 
                        className={classes.signupButton}
                        onClick={handleSignup}
                    >
                        Create an account
                    </Button>
                    
                    <Box className={classes.apiToggle}>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={useLocalApi}
                                    onChange={handleApiToggle}
                                    color="primary"
                                />
                            }
                            label={`API: ${apiEnv}`}
                        />
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
