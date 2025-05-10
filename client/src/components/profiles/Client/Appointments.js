import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DoctorList from './DoctorList';
import ClientBookAppointment from './ClientBookAppointment';
import { buildApiUrl } from '../../../config/api';

const Appointments = ({ userId }) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorAvailableDates, setDoctorAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(buildApiUrl('/api/doctors_list'));
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const fetchAvailableDates = async (doctorId) => {
    try {
      console.log('Fetching available dates for Doctor:', doctorId);
      const response = await axios.get(buildApiUrl(`/doctor/${doctorId}/available_dates`));
      console.log('Available dates response:', response.data);
      
      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log('No available dates found for this doctor');
        alert('This doctor has not set any available dates yet. Please select another doctor.');
      }
      
      setDoctorAvailableDates(response.data);
    } catch (error) {
      console.error('Error fetching available dates:', error);
      alert('Error fetching available dates. Please try again later.');
    }
  };
  
  useEffect(() => {
    console.log('Doctor available dates:', doctorAvailableDates);
    console.log('Client ID:', userId);
  }, [doctorAvailableDates]);
  

  const handleBookAppointment = (doctor) => {
    console.log('Book appointment for doctor:', doctor);
    console.log('Doctor ID:', doctor.user._id);
    setSelectedDoctor(doctor);
    if (doctor && doctor.user._id) {
      fetchAvailableDates(doctor.user._id);
      console.log('Available dates in book:', doctorAvailableDates);
    }
  };
  

  const handleCancelAppointment = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
  };
  // Function to check availability of time slots for a specific date and doctor
  const checkAvailability = async () => {
    try {
      const response = await axios.get(buildApiUrl('/api/check_availability'), {
        params: {
          doctorId: selectedDoctor,
          date: selectedDate
        }
      });
      return response.data.availableSlots;
    } catch (error) {
      console.error('Error checking availability:', error);
      return [];
    }
  };
  const handleBookAppointmentForDoctor = async (clientInfo) => {
    try {
      console.log(`Book appointment for Doctor: ${selectedDoctor.name} Id: ${selectedDoctor.user._id}, Date: ${selectedDate}, Client: ${clientInfo.name}`);
      
      // Check availability of time slots
      const availableSlots = await checkAvailability();
      
      // Find an available time slot to book the appointment
      if (availableSlots.length > 0) {
        const timeSlotId = availableSlots[0]._id; // Assuming you want to book the first available slot
  
        // Make API call to book appointment
        console.log('request parameters to book appointment:', selectedDoctor.user._id, clientInfo.client_id, selectedDate, timeSlotId)
        const response = await axios.post(buildApiUrl('/api/book_appointment'), {
          doctorId: selectedDoctor.user._id,
          patientId: clientInfo.client_id, // Assuming clientInfo contains patient ID
          date: selectedDate,
          timeSlotId
        });
  
        console.log('Appointment booked successfully:', response.data);
  
        // Clear the selected doctor
        setSelectedDoctor(null);
      } else {
        console.log('No available time slots for booking.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      // Handle error
    }
  };

  return (
    <section className="appointments">
      <h2>Appointments</h2>
      {selectedDoctor && (
        <ClientBookAppointment
          doctor={selectedDoctor}
          availableDates={doctorAvailableDates}
          userId={userId}
          onBookAppointment={handleBookAppointmentForDoctor}
          onCancel={handleCancelAppointment}
          onDateSelect={setSelectedDate} // Pass a function to set selectedDate
        />
      )}
      <DoctorList doctors={doctors} handleBookAppointment={handleBookAppointment} />
    </section>
  );
};

export default Appointments;
