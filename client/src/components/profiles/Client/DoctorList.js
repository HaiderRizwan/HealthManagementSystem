import React from 'react';
import { Typography, Card, CardContent, Button, Grid } from '@mui/material';

const DoctorList = ({ doctors, handleBookAppointment }) => {
  return (
    <div className="doctor-list">
      <Typography variant="h4" gutterBottom>Doctors</Typography>
      <Grid container spacing={3}>
        {doctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5">{doctor.user.fullName}</Typography>
                <Typography variant="body1">Contact Number: {doctor.user.contactNumber || 'N/A'}</Typography>
                <Typography variant="body1">Specialization: {doctor.specializationName || 'N/A'}</Typography>
                <Typography variant="body1">Medical License Number: {doctor.medicalLicenseNumber}</Typography>
                <Typography variant="body1">Clinic or Hospital: {doctor.clinicOrHospital || 'N/A'}</Typography>
                <Button onClick={() => handleBookAppointment(doctor)} variant="contained" color="primary">Book Appointment</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DoctorList;
