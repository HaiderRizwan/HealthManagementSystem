export const API_BASE_URL = 'http://localhost:5000';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const fullUrl = `${apiUrl}${endpoint}`;
  console.log('API Request URL:', fullUrl);
  return fullUrl;
}; 