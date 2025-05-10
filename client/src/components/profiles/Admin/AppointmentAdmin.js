import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Button,
  Box,
  CircularProgress,
  Chip
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Appointment() {
  const { id } = useParams(); // More reliable way to get ID from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    const statusColors = {
      "Cancelled": "error",
      "Completed": "success",
      "Pending": "warning",
      "Confirmed": "primary"
    };
    return statusColors[status] || "default";
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/doctors/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!data) {
          throw new Error("No data received");
        }
        
        setUser(data);
        // Ensure appointments is always an array, even if undefined in response
        setAppointments(data.appointmentsData || []);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setError(error.message);
        setAppointments([]); // Ensure appointments is empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error" variant="h6">Error: {error}</Typography>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Appointments
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {user && (
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Doctor Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Name:</strong> {user.fullName}</Typography>
                  <Typography><strong>Email:</strong> {user.email}</Typography>
                  <Typography><strong>Contact:</strong> {user.contactNumber || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>License:</strong> {user.medicalLicenseNumber || 'N/A'}</Typography>
                  <Typography><strong>Specialization:</strong> {user.specializationName}</Typography>
                  <Typography><strong>Clinic:</strong> {user.clinicOrHospital || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              Appointment Records ({appointments.length})
            </Typography>
            
            {appointments.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No appointments found
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {appointments.map((appointment, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1">
                            <strong>Date:</strong> {new Date(appointment.date).toLocaleString()}
                          </Typography>
                          <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)} 
                            size="small"
                          />
                        </Box>
                        <Typography><strong>Patient:</strong> {appointment.patientName || 'N/A'}</Typography>
                        <Typography><strong>Reason:</strong> {appointment.reason || 'N/A'}</Typography>
                        {appointment.notes && (
                          <Typography><strong>Notes:</strong> {appointment.notes}</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Appointment;