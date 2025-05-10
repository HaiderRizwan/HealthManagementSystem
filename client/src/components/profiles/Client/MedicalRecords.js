import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddRecord from './AddRecord';
import { Typography, TextField, Button, Container, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Search as SearchIcon, AddCircleOutline as AddCircleOutlineIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../../../config/api';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '16px',
  },
  search: {
    marginBottom: '16px',
    padding: '8px', // Added padding manually
  },
  addButton: {
    marginTop: '16px',
  },
  listItem: {
    backgroundColor: '#f3f3f3',
    borderRadius: '8px',
    marginBottom: '8px',
    padding: '12px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  listItemText: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#333',
  },
  recordInfo: {
    marginBottom: '8px',
    '& p': {
      margin: '4px 0',
      fontSize: '16px',
      color: '#666',
    },
  },
}));

const MedicalRecords = ({ userId }) => {
  
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const navigate = useNavigate();
  
  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/api/medical-records/${userId}`));
      setMedicalRecords(response.data);
      console.log('Medical records fetched successfully.', response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };
  useEffect(() => {
    

    fetchMedicalRecords();
  }, [userId]);

  const handleSearch = () => {
    if (!searchTerm) {
      fetchMedicalRecords();
      return;
    }
    const filtered = medicalRecords.filter(record =>
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(record.date).toLocaleDateString().includes(searchTerm) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.prescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMedicalRecords(filtered);
  };

  const handleAddRecord = () => {
    // navigate("/client/add-record", {
    //   state: {
    //     userId: userId,
    //     prevPath: "/ClientProfile",  // Store the previous path
    //   }
    // });
    setShowAddRecord(true);
  };
  const handleAddSubmitRecord = async (newRecord, userId) => {
    // Check if all required fields are filled in
    if (!newRecord.date || !newRecord.doctorName || !newRecord.diagnosis || !newRecord.prescription) {
      alert('Please fill in all required fields.');
      return; // Stop execution if any required field is missing
    }
  
    // Check if the selected date is in the future
    const selectedDate = new Date(newRecord.date);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      alert('Please select a date in the past or today.');
      return; // Stop execution if the selected date is in the future
    }
  
    try {
      // Save new record to database
      await axios.post(buildApiUrl('/api/medical-records'), {
        userId,
        date: new Date().toISOString().split('T')[0],
        doctorName: newRecord.doctorName,
        diagnosis: newRecord.diagnosis,
        prescription: newRecord.prescription
      });
  
      console.log('New record added successfully', newRecord);
  
      // Navigate back to medical records page
      // You can implement the navigation logic here
    } catch (error) {
      console.error('Error adding new record:', error);
    }
    setShowAddRecord(false);
  };
  

  const handleBack = () => {
    setShowAddRecord(false);
  };
  const handleToggleExpand = (recordId) => {
    setExpandedRecordId(recordId === expandedRecordId ? null : recordId);
  };

  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h3" gutterBottom>Medical Records</Typography>

      {/* Search Bar */}
      <Paper elevation={3} className={classes.search}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by doctor name, date, diagnosis, or prescription..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <Button variant="contained" onClick={handleSearch} endIcon={<SearchIcon />}>
                Search
              </Button>
            ),
          }}
        />
      </Paper>

      {/* Record List */}
      <List>
        {medicalRecords.map((record) => (
          <ListItem key={record._id} className={classes.listItem}>
            <ListItemText
              primaryTypographyProps={{ variant: 'h6', color: 'primary', gutterBottom: true }}
              primary={`Doctor: ${record.doctorName}`}
              secondary={
                expandedRecordId === record._id ? (
                  <div className={classes.recordInfo}>
                    <Typography variant="body1" color="textSecondary">Date: {new Date(record.date).toLocaleDateString()}</Typography>
                    <Typography variant="body1" color="textSecondary">Diagnosis: {record.diagnosis}</Typography>
                    <Typography variant="body1" color="textSecondary">Prescription: {record.prescription}</Typography>
                  </div>
                ) : null
              }
              classes={{ primary: classes.listItemText, secondary: classes.listItemText }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="view" onClick={() => handleToggleExpand(record._id)}>
                {expandedRecordId === record._id ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Add Record Button */}
      <Button
        variant="contained"
        color="primary"
        className={classes.addButton}
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddRecord}
      >
        Add New Record
      </Button>
      <br/><br/><br/><br/><br/>
      {showAddRecord && (
        <Paper elevation={3} className={classes.addRecordContainer}>
          <AddRecord userId={userId} handleAddSubmitRecord={handleAddSubmitRecord} handleBack={handleBack} onCancel={() => setShowAddRecord(false)} />
        </Paper>
      )}
      <br/><br/><br/><br/><br/>
    </Container>
  );
};

export default MedicalRecords;
