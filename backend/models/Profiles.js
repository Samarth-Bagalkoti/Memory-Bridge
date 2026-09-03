const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  age: { type: Number, default: 72 },
  emergencyContact: {
    name: { type: String, default: 'Ananya Kumar (Daughter)' },
    phone: { type: String, default: '+1 (555) 019-2834' }
  },
  quickContacts: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
      avatar: { type: String }
    }
  ],
  currentLocation: {
    address: { type: String, default: 'Home — Living Room' },
    coordinates: { lat: { type: Number, default: 12.9716 }, lng: { type: Number, default: 77.5946 } },
    lastUpdated: { type: Date, default: Date.now },
    isSimulated: { type: Boolean, default: true }
  },
  status: { type: String, enum: ['safe', 'wandering_alert', 'emergency'], default: 'safe' }
}, { timestamps: true });

const caregiverProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PatientProfile' }]
}, { timestamps: true });

module.exports = {
  PatientProfile: mongoose.model('PatientProfile', patientProfileSchema),
  CaregiverProfile: mongoose.model('CaregiverProfile', caregiverProfileSchema)
};
