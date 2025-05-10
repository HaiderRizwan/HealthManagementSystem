import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  console.log('Current Token:', token);
  console.log('Required Role:', requiredRole);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!checkAuth()) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Check user role if requiredRole is provided
    const userRole = localStorage.getItem('userRole');
    console.log('User Role from localStorage:', userRole);
    
    if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
      console.log('Role mismatch, redirecting to login');
      console.log('Required:', requiredRole.toLowerCase(), 'Actual:', userRole?.toLowerCase());
      navigate('/login');
    } else {
      console.log('Role matched, allowing access');
    }
  }, [navigate, requiredRole]);

  return children;
};

export default ProtectedRoute;