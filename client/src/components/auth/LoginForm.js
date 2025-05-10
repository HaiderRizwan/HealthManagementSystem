import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../utils/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // Store token and set auth header
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);

      // Redirect based on role
      navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard');

    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
