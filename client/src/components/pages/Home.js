import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import Hero from '../Components/Hero';

const Home = () => {
  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: '#f5f5f5'
    }}>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" mb={6}>
          Key Features
        </Typography>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}
        >
          <FeatureCard 
            title="Medical Records" 
            description="Store and access your medical history, diagnoses, and prescriptions securely."
          />
          <FeatureCard 
            title="Book Appointments" 
            description="Schedule appointments with healthcare providers hassle-free."
          />
          <FeatureCard 
            title="Health Monitoring" 
            description="Track your vital statistics and monitor your health progress over time."
          />
        </Box>
      </Container>
    </Box>
  );
};

// Helper component for feature cards
const FeatureCard = ({ title, description }) => (
  <Paper 
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6
      }
    }}
  >
    <Typography variant="h6" component="h3" mb={2} fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

export default Home;