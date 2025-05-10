const mongoose = require('mongoose');

// Users Schema
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['Doctor', 'Patient', 'Admin'],
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Doctors Schema
const doctorSchema = new mongoose.Schema({
    medicalLicenseNumber: {
        type: String,
        required: true
    },
    specializationName: {
      type: String,
      required: true
  },
    clinicOrHospital: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Patients Schema
const patientSchema = new mongoose.Schema({
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    medicalHistory: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Patient = mongoose.model('Patient', patientSchema);

// Admins Schema
const adminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Admin = mongoose.model('Admin', adminSchema);


//Appointments Schema

const appointmentSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

//Daily schedule Schema
const dailyScheduleSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    shift_id: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  });
  
  const DailySchedule = mongoose.model('DailySchedule', dailyScheduleSchema);
  
// TimeSlots Schema

const timeSlotSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shift_id: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Booked'],
    default: 'Available'
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  }
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);



// MedicalRecords Schema
const medicalRecordSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    doctorName: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    prescription: {
      type: String,
      required: true
    }
  });
  
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// Specializations Schema
const specializationSchema = new mongoose.Schema({
    specializationName: {
        type: String,
        required: true
    }
});

const Specialization = mongoose.model('Specialization', specializationSchema);


// BloodType Schema
const BloodTypeSchema = new mongoose.Schema({
  bloodtype: {
      type: String,
      required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const BloodType = mongoose.model('BloodType', BloodTypeSchema);


const BasicInfoSchema = new mongoose.Schema({
age: {
    type: String,
    required: true
},
height: {
  type: String,
  required: true
},
weight: {
  type: String,
  required: true
},
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
});

const BasicInfo = mongoose.model('BasicInfo', BasicInfoSchema);



// Test Result Schema

const TestResultSchema = new mongoose.Schema({
upperBP: {
  type: String,
  required: true
},
lowerBP: {
  type: String,
  required: true
},
heartRate: {
  type: String,
  required: true
},
date: {
  type: String,
  required: true
},
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
});

const TestResult = mongoose.model('TestResult', TestResultSchema);




module.exports = {
    User,
    Doctor,
    Patient,
    Admin,
    Appointment,
    DailySchedule,
    TimeSlot,
    MedicalRecord,
    Specialization,
    BloodType,
    BasicInfo,
    TestResult
};
