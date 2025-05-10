import React, { useState } from 'react';

const ClientBookAppointment = ({ doctor, availableDates, userId, onBookAppointment, onCancel, onDateSelect }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('NULL');

  const handleBookAppointmentClick = () => {
    // Check if client name and email are provided
    if (selectedDate === 'NULL') {
      alert('Please select the date before booking the appointment.');
      return;
    }
  
    // Check if a date is selected
    if (!selectedDate) {
      alert('Please select a date for the appointment.');
      return;
    }
  
    // Check if the selected date is in the future
    const selectedDateTime = new Date(selectedDate).getTime();
    const currentDateTime = new Date().getTime();
  
    if (selectedDateTime < currentDateTime) {
      alert('Please select a future date for the appointment.');
      return;
    }
  
    // Pass client info to the parent component
    onBookAppointment({
      client_id: userId,
      name: clientName,
      email: clientEmail,
    });
  
    // Reset client name and email fields after booking appointment
    setClientName('');
    setClientEmail('');
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate); // Set the selected date
    onDateSelect(selectedDate); // Pass the selected date to the parent component
  };

  return (
    <div className="appointment-form" style={styles.container}>
      <h3 style={styles.header}>Book Appointment</h3>
      <p style={styles.text}>Doctor: {doctor.user.fullName}</p>
      <p style={styles.text}>DoctorId: {doctor.user._id}</p>
      <p style={styles.text}>ClientId: {userId}</p>
      <label>
        Select Date:
        <select style={styles.select} onChange={handleDateChange}>
          <option value="NULL">Select Date</option>
          {availableDates && availableDates.length > 0 ? (
            availableDates.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))
          ) : (
            <option value="" disabled>No available dates</option>
          )}
        </select>
      </label>
      <button style={styles.button} onClick={handleBookAppointmentClick}>Book Appointment</button>
      <button style={styles.button} onClick={onCancel}>Cancel</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    margin: '0 10px',
    transition: 'background-color 0.3s ease',
  },
};

export default ClientBookAppointment;
