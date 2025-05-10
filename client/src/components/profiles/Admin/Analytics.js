import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  LinearProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import AdminSidebar from './AdminSidebar';

const Analytics = () => {
  // Sample data - replace with actual API data
  const appointmentData = [
    { month: 'Jan', appointments: 65 },
    { month: 'Feb', appointments: 75 },
    { month: 'Mar', appointments: 85 },
    { month: 'Apr', appointments: 70 },
    { month: 'May', appointments: 90 },
    { month: 'Jun', appointments: 100 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 8000 },
    { month: 'Apr', revenue: 18000 },
    { month: 'May', revenue: 14000 },
    { month: 'Jun', revenue: 22000 }
  ];

  const performanceMetrics = [
    { name: 'Patient Satisfaction', value: 85 },
    { name: 'Doctor Attendance', value: 92 },
    { name: 'Appointment Completion', value: 88 },
    { name: 'Treatment Success Rate', value: 90 }
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Analytics Dashboard
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
              {/* Performance Metrics */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Performance Metrics
                  </Typography>
                  <Grid container spacing={3}>
                    {performanceMetrics.map((metric) => (
                      <Grid item xs={12} sm={6} md={3} key={metric.name}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {metric.name}
                            </Typography>
                            <Typography variant="h4" color="primary">
                              {metric.value}%
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={metric.value} 
                              sx={{ mt: 1 }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              {/* Appointment Trends */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Appointment Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="appointments" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Analytics; 