import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, CircularProgress, Container, Paper, TextField, IconButton, 
  MenuItem, Select, FormControl, InputLabel, Grid, Box, Chip, Avatar,
  Button, Card, CardContent, Divider, Badge
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { 
  ErrorOutline as ErrorIcon, 
  Event as EventIcon, 
  AccessTime as AccessTimeIcon, 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  PersonOutline as DoctorIcon,
  CalendarMonth as CalendarIcon,
  CheckCircleOutline as CompletedIcon,
  PendingActions as PendingIcon,
  Cancel as CancelledIcon,
  ScheduleSend as ConfirmedIcon,
  LocationOn as LocationIcon,
  Notes as NotesIcon
} from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
  },
  appointment: {
    marginBottom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'middle',
  },
  statusBadge: {
    position: 'absolute',
    top: '15px',
    right: '15px',
  },
  statusChip: {
    fontWeight: 'bold',
  },
  appointmentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  appointmentDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
  appointmentTime: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: theme.spacing(1),
    borderRadius: '8px',
  },
  doctorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  doctorAvatar: {
    backgroundColor: theme.palette.primary.main,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  noAppointments: {
    textAlign: 'center',
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
  }
}));

const AppointmentView = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/appointments/user/${userId}`);
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, appointments]);

  const filterAppointments = () => {
    let filtered = appointments.filter(appointment => {
      const doctorNameMatch = appointment.doctor_id.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const dateMatch = new Date(appointment.date).toDateString().toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = appointment.status.toLowerCase().includes(statusFilter.toLowerCase()) || statusFilter === '';

      if (searchTerm === '' && statusFilter === '') {
        return true;
      }
      
      if (searchTerm === '') {
        return statusMatch;
      }
  
      if (statusFilter === '') {
        return doctorNameMatch || dateMatch;
      }
  
      return (doctorNameMatch || dateMatch) && statusMatch;
    });
  
    setFilteredAppointments(filtered);
  };

  const handleSearch = () => {
    filterAppointments();
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilteredAppointments(appointments);
  };

  // Format time to 12-hour format with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    // Check if already in 12-hour format
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('completed')) {
      return { 
        icon: <CompletedIcon />, 
        color: '#2e7d32', 
        bgColor: '#e8f5e9',
        borderColor: '#a5d6a7'
      };
    } else if (statusLower.includes('pending')) {
      return { 
        icon: <PendingIcon />, 
        color: '#ed6c02', 
        bgColor: '#fff3e0',
        borderColor: '#ffcc80'
      };
    } else if (statusLower.includes('cancelled')) {
      return { 
        icon: <CancelledIcon />, 
        color: '#d32f2f', 
        bgColor: '#ffebee',
        borderColor: '#ef9a9a'
      };
    } else if (statusLower.includes('confirmed')) {
      return { 
        icon: <ConfirmedIcon />, 
        color: '#1976d2', 
        bgColor: '#e3f2fd',
        borderColor: '#90caf9'
      };
    }
    
    return { 
      icon: <EventIcon />, 
      color: '#757575', 
      bgColor: '#f5f5f5',
      borderColor: '#e0e0e0'
    };
  };

  if (loading) {
    return (
      <Container maxWidth="md" className={classes.container}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className={classes.container}>
        <Paper elevation={2} sx={{ p: 3, bgcolor: '#ffebee', borderRadius: '8px' }}>
          <Typography variant="h6" color="error" display="flex" alignItems="center">
            <ErrorIcon className={classes.icon} /> Error: {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Card elevation={3} sx={{ mb: 3, borderRadius: '12px', overflow: 'hidden' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
            <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> 
            My Appointments
          </Typography>
          
          <Grid container spacing={2} className={classes.header}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search by doctor name or date"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={resetFilters}
                size="medium"
                sx={{ height: '40px' }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredAppointments.length === 0 ? (
        <Box className={classes.noAppointments}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No appointments found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search filters or schedule a new appointment
          </Typography>
        </Box>
      ) : (
        filteredAppointments.map(appointment => {
          const statusInfo = getStatusInfo(appointment.status);
          
          return (
            <Paper 
              key={appointment._id} 
              elevation={2} 
              className={classes.paper}
              sx={{ 
                borderLeft: `4px solid ${statusInfo.color}`,
                backgroundColor: statusInfo.bgColor,
              }}
            >
              <Box className={classes.statusBadge}>
                <Chip 
                  icon={statusInfo.icon} 
                  label={appointment.status} 
                  className={classes.statusChip}
                  sx={{ 
                    bgcolor: statusInfo.color,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>

              <Box className={classes.doctorInfo}>
                <Avatar className={classes.doctorAvatar}>
                  <DoctorIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Dr. {appointment.doctor_id.fullName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {appointment.doctor_id.specialization || 'General Physician'}
                  </Typography>
                </Box>
              </Box>

              <Divider className={classes.divider} />

              <Box className={classes.appointmentDetails}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarIcon color="primary" />
                  <Typography variant="body1">
                    <strong>Date:</strong> {formatDate(appointment.date)}
                  </Typography>
                </Box>
                
                <Box className={classes.appointmentTime}>
                  <AccessTimeIcon color="action" />
                  <Typography variant="body1">
                    <strong>Time:</strong> {formatTime(appointment.timeSlot_id.startTime)} - {formatTime(appointment.timeSlot_id.endTime)}
                  </Typography>
                </Box>
                
                {appointment.location && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationIcon color="action" />
                    <Typography variant="body1">
                      <strong>Location:</strong> {appointment.location}
                    </Typography>
                  </Box>
                )}
                
                {appointment.reason && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <NotesIcon color="action" />
                    <Typography variant="body1">
                      <strong>Reason:</strong> {appointment.reason}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Reschedule
                </Button>
                {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Paper>
          );
        })
      )}
    </Container>
  );
};

export default AppointmentView;
