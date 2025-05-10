import React, { useState } from 'react';
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
  AppBar,
  Toolbar,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminSidebar from './AdminSidebar';

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample billing data - replace with actual API data
  const billingData = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-02-20',
      amount: 150.00,
      service: 'General Consultation',
      status: 'Paid',
      invoiceNo: 'INV-2024-001'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-02-19',
      amount: 300.00,
      service: 'Specialist Consultation',
      status: 'Pending',
      invoiceNo: 'INV-2024-002'
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      date: '2024-02-18',
      amount: 500.00,
      service: 'Medical Test',
      status: 'Paid',
      invoiceNo: 'INV-2024-003'
    },
    {
      id: 4,
      patientName: 'Sarah Williams',
      date: '2024-02-17',
      amount: 200.00,
      service: 'Follow-up',
      status: 'Overdue',
      invoiceNo: 'INV-2024-004'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredBillings = billingData.filter(billing =>
    billing.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    billing.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <AppBar position="static" sx={{ bgcolor: "#2563eb", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Billing Management
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
              {/* Search and Actions */}
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search by patient name or invoice number"
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
                <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  onClick={() => alert('Download report')}
                >
                  Export Report
                </Button>
              </Box>

              {/* Billing Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice No</TableCell>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBillings.map((billing) => (
                      <TableRow key={billing.id}>
                        <TableCell>{billing.invoiceNo}</TableCell>
                        <TableCell>{billing.patientName}</TableCell>
                        <TableCell>{billing.date}</TableCell>
                        <TableCell>{billing.service}</TableCell>
                        <TableCell>${billing.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={billing.status}
                            color={getStatusColor(billing.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => alert(`View invoice ${billing.invoiceNo}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Billing; 