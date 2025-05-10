import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Button, Grid, Paper } from '@mui/material'; // Import Material UI components
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material'; // Import AddCircleOutline icon from Material UI icons
import TestForm from './TestResultForm';

const TestResult = ({ userId }) => {
  const [showNewComponent, setShowNewComponent] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showUpdated, setShowUpdated] = useState(false);

  const handleClick = () => {
    setShowNewComponent(true);
  };

  useEffect(() => {
    fetchTestResults();
  }, [userId]);

  const fetchTestResults = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${userId}/check_test_results`);
      console.log("Test results GET:", response.data);
      setTestResults(response.data);
      setShowUpdated(true);
      setShowNewComponent(false);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Test Results
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ marginBottom: '20px', textTransform: 'none' }}
        startIcon={<AddCircleOutlineIcon />}
      >
        Add Test Results
      </Button>
      {showNewComponent && (
        <TestForm userId={userId} fetchTestResults={fetchTestResults} setShowNewComponent={setShowNewComponent} />
      )}
      <Grid container spacing={2}>
        {testResults.map((result, index) => (
          <Grid item xs={12} key={index}>
            <Paper style={{ padding: '20px', borderRadius: '10px' }}>
              <Typography variant="body1" gutterBottom>
                Upper BP: {result.upperBP}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Lower BP: {result.lowerBP}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Heart Rate: {result.heartRate}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date: {result.date}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TestResult;
