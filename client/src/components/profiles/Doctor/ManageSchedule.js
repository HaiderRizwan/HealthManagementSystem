import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, TextField, Button, Container, Grid, Paper, MenuItem } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { buildApiUrl } from '../../../config/api';

const localizer = momentLocalizer(moment);

const ManageSchedule = ({ userId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/api/schedule/${userId}`));
      setSchedule(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setLoading(false);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(buildApiUrl(`/api/schedule/${userId}`));
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(buildApiUrl(`/api/schedule/${userId}`));
      setSchedule(response.data);

      if (!endTime) {
        alert('Please select an end time.');
        return;
      }

      const existingSchedule = schedule.find(item => {
        const scheduleDate = new Date(item.date);
        const selectedDate = new Date(date);
        return (
          scheduleDate.getDate() === selectedDate.getDate() &&
          scheduleDate.getMonth() === selectedDate.getMonth() &&
          scheduleDate.getFullYear() === selectedDate.getFullYear() &&
          item.startTime === startTime &&
          item.endTime === endTime
        );
      });
      if (existingSchedule) {
        alert('A schedule for the selected date already exists. Please choose another date.');
        return;
      }

      await axios.post(buildApiUrl('/api/schedule'), {
        user_id: userId,
        date,
        shift_id: shiftId,
        startTime,
        endTime
      });
      fetchSchedule();
      setDate('');
      setShiftId('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error adding/updating schedule:', error);
      alert('An error occurred while adding/updating the schedule. Please try again later.');
    }
  };
  
  const generateEndTimeOptions = () => {
    const endTimes = [];
    const start = new Date(`1970-01-01T${startTime}`);
    const currentHour = start.getHours();
    const currentMinute = start.getMinutes();
    let hour = currentHour;
    let minute = currentMinute + 30;

    while (hour < 24) {
      if (minute >= 60) {
        hour++;
        minute -= 60;
      }
      endTimes.push({
        value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      });
      minute += 30;
    }
    return endTimes;
  };

  return (
    <Container maxWidth="lg">
    <Typography variant="h4" gutterBottom style={{ marginBottom: '20px',marginTop:'20px', color: 'green' }}>Manage Schedule</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: '20px', border: '1px solid #dcdcdc' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder="Select Date"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Shift ID"
                    value={shiftId}
                    onChange={(e) => setShiftId(e.target.value)}
                    required
                    placeholder="Enter Shift ID"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder="Select Start Time"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  >
                    {generateEndTimeOptions().map((time, index) => (
                      <MenuItem key={index} value={time.value}>{time.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">Add/Update Schedule</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: '20px', height: '500px', overflowY: 'auto', border: '2px solid #bdbdbd' }}>
            <Typography variant="h5" gutterBottom>Schedule List</Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              schedule.map((item) => (
                <Paper key={item._id} elevation={3} style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', border: '2px solid #3f51b5' }}>
                <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold' }}>Date: {new Date(item.date).toLocaleDateString()}</Typography>
                <Typography variant="subtitle1" gutterBottom>Shift ID: {item.shift_id}</Typography>
                <Typography variant="subtitle1" gutterBottom>Start Time: {item.startTime}</Typography>
                <Typography variant="subtitle1" gutterBottom>End Time: {item.endTime}</Typography>
              </Paper>

              ))
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>Calendar</Typography>
            <Calendar
              localizer={localizer}
              events={schedule.map(item => ({
                title: `Shift ID: ${item.shift_id}`,
                start: moment(`${item.date} ${item.startTime}`, 'YYYY-MM-DD HH:mm').toDate(),
                end: moment(`${item.date} ${item.endTime}`, 'YYYY-MM-DD HH:mm').toDate(),
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageSchedule;

