import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { buildApiUrl } from '../../../config/api';

const EmailDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCompose, setOpenCompose] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/emails'));
      setEmails(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch emails');
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(buildApiUrl('/api/send-email'), newEmail);
      setOpenCompose(false);
      setNewEmail({ to: '', subject: '', message: '' });
      fetchEmails(); // Refresh the email list
    } catch (err) {
      setError('Failed to send email');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Email Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCompose(true)}
        >
          Compose Email
        </Button>
      </Box>

      <List>
        {emails.map((email, index) => (
          <React.Fragment key={email._id || index}>
            <ListItem>
              <ListItemText
                primary={email.subject}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      To: {email.to}
                    </Typography>
                    <br />
                    {email.message}
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < emails.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Dialog open={openCompose} onClose={() => setOpenCompose(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Compose Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="To"
            type="email"
            fullWidth
            value={newEmail.to}
            onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            value={newEmail.subject}
            onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Message"
            multiline
            rows={4}
            fullWidth
            value={newEmail.message}
            onChange={(e) => setNewEmail({ ...newEmail, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompose(false)}>Cancel</Button>
          <Button onClick={handleSendEmail} variant="contained" color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmailDashboard; 