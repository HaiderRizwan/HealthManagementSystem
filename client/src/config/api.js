export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://healthmanagementsystem-9wbb.onrender.com';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'https://healthmanagementsystem-9wbb.onrender.com';
  const fullUrl = `${apiUrl}${endpoint}`;
  console.log('API Request URL:', fullUrl);
  return fullUrl;
}; 