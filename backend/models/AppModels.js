const mongoose = require('mongoose');

// Medication & Compliance Log
const medicationSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true }, // e.g. "9:00 AM"
  schedule: { type: String, default: 'Daily Morning' },
  taken: { type: Boolean, default: false },
  takenAt: { type: Date }
}, { timestamps: true });

const medicationLogSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
  medicationName: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ['taken', 'missed', 'pending'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

// Appointment
const appointmentSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  doctorOrPlace: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reminder: { type: String },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

// Routine Task
const routineTaskSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  time: { type: String, required: true },
  icon: { type: String, default: '📅' },
  category: { type: String, default: 'general' },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

// Cognitive Game Performance
const gameSessionSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  gameId: { type: String, required: true }, // e.g. "who_is_this", "family_memory", "remember_numbers", "place_recognition"
  gameName: { type: String, required: true },
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true }, // Percentage (0-100)
  responseTimeSec: { type: Number, default: 0 },
  hintsUsed: { type: Number, default: 0 },
  difficultyLevel: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now }
});

// Safety & Wandering Alert
const alertSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  type: { type: String, enum: ['safety', 'medication_missed', 'emergency', 'unknown_person'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  timestamp: { type: Date, default: Date.now }
});

// Caregiver Notification
const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

// Caregiver Direct Message to Patient
const caregiverMessageSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  caregiverName: { type: String, default: 'Meera (Caregiver)' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = {
  Medication: mongoose.model('Medication', medicationSchema),
  MedicationLog: mongoose.model('MedicationLog', medicationLogSchema),
  Appointment: mongoose.model('Appointment', appointmentSchema),
  RoutineTask: mongoose.model('RoutineTask', routineTaskSchema),
  GameSession: mongoose.model('GameSession', gameSessionSchema),
  Alert: mongoose.model('Alert', alertSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  CaregiverMessage: mongoose.model('CaregiverMessage', caregiverMessageSchema)
};
