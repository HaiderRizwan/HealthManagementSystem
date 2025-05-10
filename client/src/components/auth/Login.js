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
import { buildApiUrl } from '../../config/api';

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
    }
  });
  

const Login = ({ selectedOption }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            console.log('Attempting login with:', formData);
            
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await axios.post(buildApiUrl('/api/login'), formData, {
                signal: controller.signal,
                timeout: 10000
            });
            
            clearTimeout(timeoutId);
            
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
                setError(error.response.data?.message || 'Login failed. Please check your credentials.');
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
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                fullWidth
                                margin="normal"
                                autoComplete="email"
                                className={classes.input}
                                variant="outlined"
                            />
                        </div>
                        <div>
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                fullWidth
                                margin="normal"
                                autoComplete="current-password"
                                className={classes.input}
                                variant="outlined"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth
                            className={classes.loginButton}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={handleSignup} 
                            fullWidth
                            className={classes.signupButton}
                        >
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
