import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { buildApiUrl } from '../../../config/api';

const TestForm = ({ userId, fetchTestResults, setShowNewComponent }) => {
  const [upperBP, setUpperBP] = useState('');
  const [lowerBP, setLowerBP] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { upperBP, lowerBP, heartRate, date };
    try {
      console.log(formData);
      const response = await axios.post(buildApiUrl(`/api/${userId}/post_test_result`), formData);
      console.log('Test result saved:', response.data);
      // Optionally, you can handle success response here
      setShowNewComponent(false);
      fetchTestResults();
    } catch (error) {
      console.error('Error saving test result:', error);
      // Optionally, you can handle error response here
    }
  };

  const handleExit = () => {
    setShowNewComponent(false);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '8px', boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Upper Blood Pressure"
                type="number"
                value={upperBP}
                onChange={(e) => setUpperBP(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Lower Blood Pressure"
                type="number"
                value={lowerBP}
                onChange={(e) => setLowerBP(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Heart Rate"
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button sx={{ margin: '5px' }} variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button variant="contained" color="primary" onClick={handleExit}>
                Close
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TestForm;
