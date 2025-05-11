import axios from 'axios';

// Default production API URL
const PRODUCTION_API_URL = 'https://healthmanagementsystem-9wbb.onrender.com';
// Local development API URL - empty string means use relative URLs
const LOCAL_API_URL = 'http://localhost:5000';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Check if we should use local API (stored in localStorage)
const getApiBaseUrl = () => {
  // If there's no explicit setting in localStorage, default to local API in development
  if (localStorage.getItem('useLocalApi') === null) {
    localStorage.setItem('useLocalApi', 'true');
  }
  const useLocalApi = localStorage.getItem('useLocalApi') === 'true';
  return useLocalApi ? LOCAL_API_URL : PRODUCTION_API_URL;
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || getApiBaseUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  const apiUrl = process.env.REACT_APP_API_URL || getApiBaseUrl();
  const fullUrl = apiUrl ? `${apiUrl}${endpoint}` : endpoint;
  console.log('API Request URL:', fullUrl);
  return fullUrl;
};

// Function to toggle between local and production API
export const toggleApiEnvironment = () => {
  const currentSetting = localStorage.getItem('useLocalApi') === 'true';
  localStorage.setItem('useLocalApi', (!currentSetting).toString());
  return !currentSetting;
};

// Function to get current API environment name
export const getApiEnvironmentName = () => {
  return localStorage.getItem('useLocalApi') === 'true' ? 'Local' : 'Production';
}; 