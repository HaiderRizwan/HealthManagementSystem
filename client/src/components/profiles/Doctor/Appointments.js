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

const AppointmentDoctor = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/appointments/doctor/${userId}`));
      console.log('Appointments:', response.data);
      setAppointments(response.data);
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

  return (
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsActiveIcon sx={{ mr: 1 }} />
                    Pending ({pendingCount})
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventAvailableIcon sx={{ mr: 1 }} />
                    Confirmed ({confirmedCount})
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DoneAllIcon sx={{ mr: 1 }} />
                    Completed ({completedCount})
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventBusyIcon sx={{ mr: 1 }} />
                    Cancelled ({cancelledCount})
                  </Box>
                } 
              />
            </Tabs>
            
            <TextField
              placeholder="Search appointments..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '250px' }}
            />
          </Box>

          <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            {filteredAppointments.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No {getStatusLabel(tabValue === 0 ? 'Pending' : tabValue === 1 ? 'Confirmed' : tabValue === 2 ? 'Completed' : 'Cancelled')} appointments found
                </Typography>
              </Box>
            ) : (
              <TableContainer>
            <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow 
                        key={appointment._id}
                        sx={{ 
                          '&:hover': { bgcolor: '#f9f9f9' },
                          borderLeft: appointment.status === 'Pending' ? '4px solid orange' : 
                                     appointment.status === 'Confirmed' ? '4px solid #1976d2' :
                                     appointment.status === 'Completed' ? '4px solid green' :
                                     '4px solid red'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={{ mr: 1, color: '#666' }} fontSize="small" />
                            {formatDate(appointment.date)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ mr: 1, color: '#666' }} fontSize="small" />
                            {`${appointment.timeSlotStart} - ${appointment.timeSlotEnd}`}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, color: '#666' }} fontSize="small" />
                            {appointment.patientName}
                          </Box>
                        </TableCell>
                      <TableCell>
                          <StatusChip status={appointment.status} />
                      </TableCell>
                      <TableCell>
                          {appointment.status === 'Pending' && (
                            <>
                              <Tooltip title="Confirm Appointment">
                                <Button 
                                  onClick={() => openConfirmationDialog(appointment, 'confirm')} 
                                  variant="contained" 
                                  color="primary" 
                                  size="small" 
                                  startIcon={<CheckCircleIcon />}
                                  sx={{ mr: 1, borderRadius: 2 }}
                                >
                                  Confirm
                                </Button>
                              </Tooltip>
                              <Tooltip title="Cancel Appointment">
                                <Button 
                                  onClick={() => openConfirmationDialog(appointment, 'cancel')} 
                                  variant="outlined" 
                                  color="error" 
                                  size="small" 
                                  startIcon={<CancelIcon />}
                                  sx={{ borderRadius: 2 }}
                                >
                                  Cancel
                                </Button>
                              </Tooltip>
                            </>
                          )}
                          {appointment.status === 'Confirmed' && (
                            <Tooltip title="Mark as Completed">
                              <Button 
                                onClick={() => openConfirmationDialog(appointment, 'complete')} 
                                variant="contained" 
                                color="success" 
                                size="small" 
                                startIcon={<DoneAllIcon />}
                                sx={{ borderRadius: 2 }}
                              >
                                Complete
                              </Button>
                            </Tooltip>
                          )}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            )}
          </Paper>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {actionType === 'confirm' ? 'Confirm Appointment' : 
           actionType === 'cancel' ? 'Cancel Appointment' : 'Complete Appointment'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'confirm' ? 'Are you sure you want to confirm this appointment?' : 
             actionType === 'cancel' ? 'Are you sure you want to cancel this appointment?' : 
             'Are you sure you want to mark this appointment as completed?'}
          </DialogContentText>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Patient:</strong> {selectedAppointment.patientName}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(selectedAppointment.date)}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {`${selectedAppointment.timeSlotStart} - ${selectedAppointment.timeSlotEnd}`}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={() => handleBookAppointment(
              selectedAppointment._id, 
              actionType === 'confirm' ? 'Confirmed' : 
              actionType === 'cancel' ? 'Cancelled' : 'Completed'
            )} 
            color={actionType === 'confirm' ? 'primary' : actionType === 'cancel' ? 'error' : 'success'}
            variant="contained"
            autoFocus
          >
            {actionType === 'confirm' ? 'Confirm' : actionType === 'cancel' ? 'Cancel Appointment' : 'Mark as Completed'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentDoctor;
