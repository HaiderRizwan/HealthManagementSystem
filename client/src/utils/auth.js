import axios from 'axios';

// Set auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Check if user is authenticated
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};

// Get current user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  delete axios.defaults.headers.common['Authorization'];
};