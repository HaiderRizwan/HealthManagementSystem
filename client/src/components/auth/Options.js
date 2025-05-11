import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import Subtitle from './SubTitle';
import SpecialtyDoctorsSlideshow from './SpecialtyDoctorsSlideshow';

// Modern styled button with animation effects
const AnimatedButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  padding: '12px 28px',
  fontSize: '18px',
  fontWeight: '600',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderRadius: '50px',
  overflow: 'hidden',
  background: 'linear-gradient(90deg, #1a237e, #2979ff)',
  color: '#fff',
  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(25, 118, 210, 0.5)',
    background: 'linear-gradient(90deg, #0d47a1, #2962ff)',
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'all 0.6s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

// Modern styled select dropdown
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  margin: theme.spacing(1),
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  },
  '& .MuiSelect-icon': {
    color: '#fff',
  },
}));

// Hero Section Background with Gradient Overlay
const HeroSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '85vh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(4),
  zIndex: 1,
}));

const HeroImage = styled(Box)(({ theme }) => ({
  flex: '1',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(3,38,90,0.4) 100%)',
  }
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  fontSize: '3.5rem',
  background: 'linear-gradient(45deg, #03265a 30%, #2752af 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const Options = ({ onOptionChange }) => {
  const [option, setOption] = useState('Doctor');

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setOption(selectedOption);
    if (onOptionChange) {
      onOptionChange(selectedOption);
    }
  };

  return (
    <div>
      <AppBar position="sticky" sx={{ backgroundColor: '#03265a' }}>
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            letterSpacing: '1px'
          }}>
            Health Hub
          </Typography>
          <StyledFormControl size="small">
            <Select
              value={option}
              onChange={handleOptionChange}
              displayEmpty
              inputProps={{ 'aria-label': 'User Type' }}
            >
              <MenuItem value="Doctor">Doctor</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </StyledFormControl>
        </Toolbar>
      </AppBar>
      
      <HeroSection>
        <HeroContent>
          <Box sx={{ maxWidth: '600px' }}>
            <HeroTitle variant="h1">
              Your Health Solutions Are Here
            </HeroTitle>
            <Subtitle />
          </Box>
        </HeroContent>
        <HeroImage sx={{ 
          backgroundImage: 'url("https://img.freepik.com/free-photo/medium-shot-doctor-with-stethoscope_23-2149191355.jpg?t=st=1714935542~exp=1714939142~hmac=af15fb5d1f7c5d7c89dc428d4b680a83a4f5ec1fce5cd649ce69e7ed4c686fea&w=740")'
        }} />
      </HeroSection>
      
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" sx={{ 
          textAlign: 'center', 
          mb: 4, 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #03265a 30%, #2752af 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Our Medical Specialists
        </Typography>
        <SpecialtyDoctorsSlideshow />
      </Container>
      
      <Box component="footer" sx={{ 
        backgroundColor: '#03265a', 
        color: '#fff', 
        py: 3,
        textAlign: 'center'
      }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Health Hub. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default Options;