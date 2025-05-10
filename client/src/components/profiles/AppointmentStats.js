import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Alarm, CheckCircle, Cancel, Schedule } from '@mui/icons-material'; // Icons for different appointment types
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';


const AppointmentCount = ({ count, type, isLoading, error, text }) => {
  let icon;
  let color;

  switch (type) {
    case 'pending':
      icon = <Schedule fontSize="large" />;
      color = '#FFA726'; // Orange color for pending
      break;
    case 'confirmed':
      icon = <CheckCircle fontSize="large" />;
      color = '#4CAF50'; // Green color for confirmed
      break;
    case 'cancelled':
      icon = <Cancel fontSize="large" />;
      color = '#F44336'; // Red color for cancelled
      break;
    case 'completed':
      icon = <Alarm fontSize="large" />;
      color = '#2196F3'; // Blue color for completed
      break;
    default:
      break;
  }

  return (
    <Paper
      elevation={3}
      style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: color,
        borderRadius: '10px',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: '#5c6bc0',
          cursor: 'pointer',
          transform: 'translateY(-10px)' // Move component up when hovered
        }
      }}
    >
      {icon && (
        <div style={{ color: '#FFFFFF', marginBottom: '10px' }}>
          {icon}
        </div>
      )}
      <Typography variant="h4" style={{ color: '#FFFFFF' }}>
        {isLoading ? 'Loading...' : count}
      </Typography>
      {text && (
        <Typography style={{ color: '#FFFFFF', marginTop: '10px' }}>
          {text}
        </Typography>
      )}
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
    </Paper>
  );
};

const AppointmentStats = ({ appointmentsData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3} sx={{ '&:hover': { transform: 'scale(1.07)', transition: 'transform 0.29s' } }}>
        <AppointmentCount
          count={appointmentsData.pending.count}
          type="pending"
          isLoading={appointmentsData.pending.isLoading}
          error={appointmentsData.pending.error}
          text={"The Pending Appointments"}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ '&:hover':  { transform: 'scale(1.07)', transition: 'transform 0.29s' } }}>
        <AppointmentCount
          count={appointmentsData.confirmed.count}
          type="confirmed"
          isLoading={appointmentsData.confirmed.isLoading}
          error={appointmentsData.confirmed.error}
          text="Confirmed Appointments"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ '&:hover':  { transform: 'scale(1.07)', transition: 'transform 0.29s' } }}>
        <AppointmentCount
          count={appointmentsData.cancelled.count}
          type="cancelled"
          isLoading={appointmentsData.cancelled.isLoading}
          error={appointmentsData.cancelled.error}
          text="Cancelled Appointments"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} sx={{ '&:hover':  { transform: 'scale(1.07)', transition: 'transform 0.29s' } }}>
        <AppointmentCount
          count={appointmentsData.completed.count}
          type="completed"
          isLoading={appointmentsData.completed.isLoading}
          error={appointmentsData.completed.error}
          text="Completed Appointments"
        />
      </Grid>
      {/* Bar chart for appointment details */}
      <Grid item xs={12}>
  <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f5f5f5' }}>
    <Typography variant="h5" gutterBottom style={{ color: '#333', marginBottom: '20px' }}>Appointment Details</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={[
          { name: 'Pending', count: appointmentsData.pending.count, color: '#8884d8' },
          { name: 'Confirmed', count: appointmentsData.confirmed.count, color: '#82ca9d' },
          { name: 'Cancelled', count: appointmentsData.cancelled.count, color: '#ff9900' },
          { name: 'Completed', count: appointmentsData.completed.count, color: '#ff0000' },
        ]}
        barSize={30}
      >
        <XAxis dataKey="name" style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }} />
        <YAxis style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
        <Bar dataKey="count" fill="#82ca9d" />
        <Bar dataKey="count" fill="#ff9900" />
        <Bar dataKey="count" fill="#ff0000" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
</Grid>

    </Grid>
  );
};

export default AppointmentStats;
