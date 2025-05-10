import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import { buildApiUrl } from '../../../config/api';

const AddRecord = ({ userId, handleAddSubmitRecord,handleBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const prevPath = location.state?.prevPath;

  const [newRecord, setNewRecord] = useState({
    date: '',
    doctorName: '',
    diagnosis: '',
    prescription: ''
  });

  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(buildApiUrl(`/api/users/${userId}`));
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(buildApiUrl('/api/medical-records'), {
        ...newRecord,
        userId
      });

      console.log('New record added successfully', userData);

      navigate('/ClientProfile', { state: { user: userData } });
    } catch (error) {
      console.error('Error adding new record:', error);
    }
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Add New Medical Record
          </Typography>

          {userData && (
            <div>
              {/* Add other user details as needed */}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="date"
              name="date"
              label="Date"
              value={newRecord.date}
              onChange={handleInputChange}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              type="text"
              name="doctorName"
              label="Doctor's Name"
              value={newRecord.doctorName}
              onChange={handleInputChange}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              type="text"
              name="diagnosis"
              label="Diagnosis"
              value={newRecord.diagnosis}
              onChange={handleInputChange}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              type="text"
              name="prescription"
              label="Prescription"
              value={newRecord.prescription}
              onChange={handleInputChange}
              required
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" type="submit" sx={{ marginRight: 2 }}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleBack}>
              Cancel
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddRecord;
