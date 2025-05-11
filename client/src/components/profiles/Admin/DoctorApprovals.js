import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  AppBar,
  Toolbar,
  Box,
  Container,
  Breadcrumbs,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';
import { buildApiUrl } from '../../../config/api';

function DoctorApprovals() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl('/api/admin/pending-doctors'));
      setDoctors(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprovalAction = (doctor, action) => {
    setSelectedDoctor(doctor);
    setActionType(action);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    try {
      const status = actionType === 'approve' ? 'Approved' : 'Rejected';
      await axios.put(buildApiUrl(`/api/admin/doctor-approval/${selectedDoctor._id}`), {
        approvalStatus: status
      });
      
      // Update the local state
      setDoctors(doctors.map(doctor => 
        doctor._id === selectedDoctor._id 
          ? { ...doctor, approvalStatus: status } 
          : doctor
      ));
      
      setActionSuccess(`Doctor ${selectedDoctor.fullName} has been ${status.toLowerCase()}.`);
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err) {
      console.error('Error updating doctor status:', err);
      setError(`Failed to ${actionType} doctor. Please try again.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setDialogOpen(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Approved':
        return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" />;
      case 'Rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" />;
      default:
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Doctor Approvals
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
              {/* Breadcrumb navigation */}
              <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link 
                  to="/AdminProfile"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#2d90d2',
                    textDecoration: 'none' 
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Admin Dashboard
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                  Doctor Approvals
                </Typography>
              </Breadcrumbs>

              {/* Success/Error Messages */}
              {actionSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {actionSuccess}
                </Alert>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Doctor Approvals Table */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : doctors.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">No doctors found</Typography>
                </Paper>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Specialization</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>License Number</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                          <TableCell>{doctor.fullName}</TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.specializationName}</TableCell>
                          <TableCell>{doctor.medicalLicenseNumber}</TableCell>
                          <TableCell>{getStatusChip(doctor.approvalStatus)}</TableCell>
                          <TableCell>
                            {doctor.approvalStatus === 'Pending' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleApprovalAction(doctor, 'approve')}
                                  sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleApprovalAction(doctor, 'reject')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {doctor.approvalStatus === 'Rejected' && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApprovalAction(doctor, 'approve')}
                              >
                                Approve
                              </Button>
                            )}
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

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Doctor' : 'Reject Doctor'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'approve' 
              ? `Are you sure you want to approve Dr. ${selectedDoctor?.fullName}? This will allow them to log in and use the system.` 
              : `Are you sure you want to reject Dr. ${selectedDoctor?.fullName}? They will not be able to log in to the system.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmAction} 
            color={actionType === 'approve' ? 'success' : 'error'} 
            variant="contained"
            autoFocus
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DoctorApprovals; 