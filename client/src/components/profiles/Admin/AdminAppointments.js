import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { buildApiUrl } from '../../../config/api';
import AdminSidebar from './AdminSidebar';

const AdminAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/appointments/all'));
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      // Use sample data for demonstration
      setAppointments([
        {
          id: 1,
          patientName: 'John Doe',
          doctorName: 'Dr. Smith',
          date: '2024-02-20T10:00:00',
          status: 'Confirmed',
          reason: 'General Checkup'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          doctorName: 'Dr. Johnson',
          date: '2024-02-21T14:30:00',
          status: 'Pending',
          reason: 'Follow-up'
        },
        {
          id: 3,
          patientName: 'Mike Wilson',
          doctorName: 'Dr. Brown',
          date: '2024-02-19T09:15:00',
          status: 'Completed',
          reason: 'Consultation'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Confirmed': 'primary',
      'Pending': 'warning',
      'Completed': 'success',
      'Cancelled': 'error'
    };
    return statusColors[status] || 'default';
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(buildApiUrl(`/appointments/${appointmentId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to update appointment status');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Appointments Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <Grid item xs={12} md={9} lg={10}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search by patient or doctor name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Doctor Name</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.patientName}</TableCell>
                          <TableCell>{appointment.doctorName}</TableCell>
                          <TableCell>
                            {new Date(appointment.date).toLocaleString()}
                          </TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={appointment.status}
                                onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                size="small"
                              >
                                <MenuItem value="Confirmed">Confirm</MenuItem>
                                <MenuItem value="Completed">Complete</MenuItem>
                                <MenuItem value="Cancelled">Cancel</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminAppointments; 