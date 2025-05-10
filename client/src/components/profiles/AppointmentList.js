import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  List, ListItem, ListItemText, Divider, Typography, Paper, Grid, Box,
  Card, CardContent, CardActions, Button, Chip, Avatar, IconButton,
  Collapse, Tooltip
} from '@mui/material';
import { 
  Event, Person, Schedule, Done, AccessTime, Alarm,
  LocationOn, Notes, ExpandMore, ExpandLess,
  CheckCircle, Cancel, HourglassFull, ConfirmationNumber,
  Phone, Email
} from '@mui/icons-material';

const AppointmentList = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/appointments/doctor/${doctorId}`);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Error fetching appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'completed') {
      return { 
        icon: <CheckCircle />, 
        color: '#2e7d32',
        bgcolor: '#e8f5e9',
        label: 'Completed'
      };
    } else if (statusLower === 'pending') {
      return { 
        icon: <HourglassFull />, 
        color: '#ed6c02',
        bgcolor: '#fff3e0',
        label: 'Pending'
      };
    } else if (statusLower === 'cancelled') {
      return { 
        icon: <Cancel />, 
        color: '#d32f2f',
        bgcolor: '#ffebee',
        label: 'Cancelled'
      };
    } else if (statusLower === 'confirmed') {
      return { 
        icon: <ConfirmationNumber />, 
        color: '#1976d2',
        bgcolor: '#e3f2fd',
        label: 'Confirmed'
      };
    }
    
    return { 
      icon: <Event />, 
      color: '#757575',
      bgcolor: '#f5f5f5',
      label: status
    };
  };

  // Check if an appointment is today
  const isToday = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return (
      today.getDate() === appointmentDate.getDate() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getFullYear() === appointmentDate.getFullYear()
    );
  };

  // Check if an appointment is upcoming (within next 3 days)
  const isUpcoming = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  };

  if (loading) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6">Loading appointments...</Typography>
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3, bgcolor: '#ffebee', borderRadius: 2 }}>
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  );

  if (appointments.length === 0) return (
    <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h6">No appointments found</Typography>
    </Box>
  );

  return (
    <Grid container spacing={3}>
      {appointments.map((appointment, index) => {
        const statusInfo = getStatusInfo(appointment.status);
        const isAppointmentToday = isToday(appointment.date);
        const isAppointmentUpcoming = isUpcoming(appointment.date);
        
        return (
        <Grid item xs={12} md={6} key={index}>
            <Card 
              elevation={3} 
              sx={{ 
                borderRadius: '12px',
                position: 'relative',
                overflow: 'visible',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                },
                borderLeft: `4px solid ${statusInfo.color}`,
              }}
            >
              {/* Status badge */}
              <Box sx={{ 
                position: 'absolute', 
                top: '-10px', 
                right: '20px', 
                zIndex: 1 
              }}>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  sx={{
                    bgcolor: statusInfo.color,
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                />
              </Box>

              {/* Today/Upcoming badge */}
              {(isAppointmentToday || isAppointmentUpcoming) && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: '-10px', 
                  left: '20px', 
                  zIndex: 1 
                }}>
                  <Chip
                    label={isAppointmentToday ? 'TODAY' : 'UPCOMING'}
                    sx={{
                      bgcolor: isAppointmentToday ? '#ff4081' : '#7c4dff',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {appointment.patientName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Patient ID: {appointment._id.substring(0, 8)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Event sx={{ mr: 1, color: '#1976d2' }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Date</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(appointment.date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ mr: 1, color: '#1976d2' }} />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Shift</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {appointment.shift}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 2, 
                  p: 1.5, 
                  bgcolor: 'rgba(0, 0, 0, 0.04)', 
                  borderRadius: 1 
                }}>
                  <AccessTime sx={{ mr: 1, color: '#1976d2' }} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">Time Slot</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {appointment.timeSlotStart} - {appointment.timeSlotEnd}
                    </Typography>
                  </Box>
                </Box>

                <Collapse in={expandedId === index} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #e0e0e0' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Additional Information
                    </Typography>
                    
                    {appointment.reason && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Notes sx={{ mr: 1, color: '#757575', fontSize: '1rem' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">Reason</Typography>
                          <Typography variant="body2">{appointment.reason}</Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {appointment.location && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: '#757575', fontSize: '1rem' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">Location</Typography>
                          <Typography variant="body2">{appointment.location}</Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {appointment.contactNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Phone sx={{ mr: 1, color: '#757575', fontSize: '1rem' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">Contact</Typography>
                          <Typography variant="body2">{appointment.contactNumber}</Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {appointment.email && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Email sx={{ mr: 1, color: '#757575', fontSize: '1rem' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">Email</Typography>
                          <Typography variant="body2">{appointment.email}</Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {appointment.reminder && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Alarm sx={{ mr: 1, color: '#757575', fontSize: '1rem' }} />
                        <Box>
                          <Typography variant="body2" color="textSecondary">Reminder</Typography>
                          <Typography variant="body2">{appointment.reminder}</Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="primary"
                  onClick={() => handleExpandClick(index)}
                  endIcon={expandedId === index ? <ExpandLess /> : <ExpandMore />}
                >
                  {expandedId === index ? 'Less' : 'More'}
                </Button>
                
                <Box>
                  {appointment.status === 'Pending' && (
                    <Tooltip title="Confirm Appointment">
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        Confirm
                      </Button>
                    </Tooltip>
                  )}
                  
                  {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
                    <Tooltip title="Cancel Appointment">
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                      >
                        Cancel
                      </Button>
                    </Tooltip>
                  )}
                  
                  {appointment.status === 'Confirmed' && (
                    <Tooltip title="Mark as Completed">
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        sx={{ mr: 1 }}
                      >
                        Complete
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </CardActions>
            </Card>
        </Grid>
        );
      })}
    </Grid>
  );
};

export default AppointmentList;
