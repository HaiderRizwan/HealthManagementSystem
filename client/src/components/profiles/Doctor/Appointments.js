import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  CircularProgress, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper,
  Tabs,
  Tab,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Badge
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { styled } from '@mui/material/styles';
import { buildApiUrl } from '../../../config/api';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const StatusChip = ({ status }) => {
  const getChipProps = () => {
    switch (status) {
      case 'Pending':
        return { color: 'warning', icon: <NotificationsActiveIcon />, label: 'Pending' };
      case 'Confirmed':
        return { color: 'primary', icon: <EventAvailableIcon />, label: 'Confirmed' };
      case 'Completed':
        return { color: 'success', icon: <DoneAllIcon />, label: 'Completed' };
      case 'Cancelled':
        return { color: 'error', icon: <EventBusyIcon />, label: 'Cancelled' };
      default:
        return { color: 'default', icon: null, label: status };
    }
  };

  const { color, icon, label } = getChipProps();
  return <Chip icon={icon} label={label} color={color} variant="outlined" />;
};

const AppointmentDoctor = ({ userId, patientView }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/appointments/doctor/${userId}`));
      console.log('Appointments:', response.data);
      setAppointments(response.data);
      
      // Process patient data if in patient view mode
      if (patientView) {
        // Group appointments by patient
        const patientMap = {};
        response.data.forEach(appointment => {
          if (!patientMap[appointment.patientName]) {
            patientMap[appointment.patientName] = {
              name: appointment.patientName,
              appointments: []
            };
          }
          patientMap[appointment.patientName].appointments.push(appointment);
        });
        
        // Convert map to array
        const patientList = Object.values(patientMap);
        setPatients(patientList);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const handleBookAppointment = async (appointmentId, status) => {
    try {
      const response = await axios.put(buildApiUrl(`/appointments/${appointmentId}/status`), {
        status
      });
      if (response.data) {
        fetchAppointments();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openConfirmationDialog = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return 'Pending';
      case 'Confirmed': return 'Confirmed';
      case 'Completed': return 'Completed';
      case 'Cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getFilteredAppointments = () => {
    let filteredByStatus = appointments;
    
    // Filter by tab/status
    if (tabValue === 0) {
      filteredByStatus = appointments.filter(app => app.status === 'Pending');
    } else if (tabValue === 1) {
      filteredByStatus = appointments.filter(app => app.status === 'Confirmed');
    } else if (tabValue === 2) {
      filteredByStatus = appointments.filter(app => app.status === 'Completed');
    } else if (tabValue === 3) {
      filteredByStatus = appointments.filter(app => app.status === 'Cancelled');
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return filteredByStatus.filter(app => 
        app.patientName.toLowerCase().includes(term) || 
        formatDate(app.date).toLowerCase().includes(term) ||
        app.shift.toLowerCase().includes(term)
      );
    }
    
    return filteredByStatus;
  };

  const pendingCount = appointments.filter(app => app.status === 'Pending').length;
  const confirmedCount = appointments.filter(app => app.status === 'Confirmed').length;
  const completedCount = appointments.filter(app => app.status === 'Completed').length;
  const cancelledCount = appointments.filter(app => app.status === 'Cancelled').length;

  const filteredAppointments = getFilteredAppointments();

  // Add this new function to render the patient view
  const renderPatientView = () => {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: '#1976d2',
          borderBottom: '2px solid #1976d2',
          paddingBottom: 1,
          marginBottom: 3
        }}>
          Patients
        </Typography>

        <TextField
          fullWidth
          placeholder="Search patients..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : patients.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No patients found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {patients
              .filter(patient => 
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((patient, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ mb: 2, boxShadow: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon fontSize="large" sx={{ mr: 2, color: '#1976d2' }} />
                        <Typography variant="h6">{patient.name}</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Appointment History:
                      </Typography>
                      {patient.appointments.map((appointment, appIndex) => (
                        <Box key={appIndex} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">{formatDate(appointment.date)}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {appointment.timeSlotStart} - {appointment.timeSlotEnd}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <StatusChip status={appointment.status} />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    );
  };

  // Modify the return statement to conditionally render the patient view
  return patientView ? renderPatientView() : (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold',
        color: '#1976d2',
        borderBottom: '2px solid #1976d2',
        paddingBottom: 1,
        marginBottom: 3
      }}>
        Appointment Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff8e1', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">Pending</Typography>
                <StyledBadge badgeContent={pendingCount} color="warning">
                  <NotificationsActiveIcon color="warning" fontSize="large" />
                </StyledBadge>
              </Box>
              <Typography variant="h4">{pendingCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">Confirmed</Typography>
                <StyledBadge badgeContent={confirmedCount} color="primary">
                  <EventAvailableIcon color="primary" fontSize="large" />
                </StyledBadge>
              </Box>
              <Typography variant="h4">{confirmedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">Completed</Typography>
                <StyledBadge badgeContent={completedCount} color="success">
                  <DoneAllIcon color="success" fontSize="large" />
                </StyledBadge>
              </Box>
              <Typography variant="h4">{completedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="text.secondary">Cancelled</Typography>
                <StyledBadge badgeContent={cancelledCount} color="error">
                  <EventBusyIcon color="error" fontSize="large" />
                </StyledBadge>
              </Box>
              <Typography variant="h4">{cancelledCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and filter */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          placeholder="Search appointments..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs for filtering by status */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3, 
          borderBottom: '1px solid #e0e0e0',
          '& .MuiTab-root': { fontWeight: 600 }
        }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledBadge badgeContent={pendingCount} color="warning" sx={{ mr: 1 }}>
                <NotificationsActiveIcon />
              </StyledBadge>
              Pending
            </Box>
          } 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledBadge badgeContent={confirmedCount} color="primary" sx={{ mr: 1 }}>
                <EventAvailableIcon />
              </StyledBadge>
              Confirmed
            </Box>
          } 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledBadge badgeContent={completedCount} color="success" sx={{ mr: 1 }}>
                <DoneAllIcon />
              </StyledBadge>
              Completed
            </Box>
          } 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledBadge badgeContent={cancelledCount} color="error" sx={{ mr: 1 }}>
                <EventBusyIcon />
              </StyledBadge>
              Cancelled
            </Box>
          } 
        />
      </Tabs>

      {/* Appointment Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredAppointments.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No appointments found
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{`${appointment.timeSlotStart} - ${appointment.timeSlotEnd}`}</TableCell>
                  <TableCell>
                    <StatusChip status={appointment.status} />
                  </TableCell>
                  <TableCell>
                    {appointment.status === 'Pending' && (
                      <>
                        <Tooltip title="Confirm Appointment">
                          <IconButton 
                            color="primary" 
                            onClick={() => openConfirmationDialog(appointment, 'confirm')}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel Appointment">
                          <IconButton 
                            color="error"
                            onClick={() => openConfirmationDialog(appointment, 'cancel')}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {appointment.status === 'Confirmed' && (
                      <Tooltip title="Mark as Completed">
                        <IconButton 
                          color="success"
                          onClick={() => openConfirmationDialog(appointment, 'complete')}
                        >
                          <DoneAllIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          {actionType === 'confirm' ? 'Confirm Appointment' : 
           actionType === 'cancel' ? 'Cancel Appointment' : 
           'Mark Appointment as Completed'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'confirm' ? 'Are you sure you want to confirm this appointment?' : 
             actionType === 'cancel' ? 'Are you sure you want to cancel this appointment?' : 
             'Are you sure you want to mark this appointment as completed?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button 
            onClick={() => {
              const status = 
                actionType === 'confirm' ? 'Confirmed' : 
                actionType === 'cancel' ? 'Cancelled' : 'Completed';
              handleBookAppointment(selectedAppointment._id, status);
            }} 
            color="primary" 
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentDoctor;
