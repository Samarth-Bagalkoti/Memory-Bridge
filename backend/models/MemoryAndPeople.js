const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['family', 'place', 'event', 'routine', 'general'], default: 'family' },
  date: { type: String },
  imageUrl: { type: String },
  relationship: { type: String },
  location: { type: String },
  tags: [String]
}, { timestamps: true });

const personSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  notes: { type: String },
  photoUrl: { type: String },
  faceDescriptor: [Number] // Array of numerical vector embeddings for face match
}, { timestamps: true });

const peopleMetLogSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  detectedName: { type: String, default: 'Unknown Person' },
  relationship: { type: String, default: 'Unknown' },
  status: { type: String, enum: ['known', 'unknown'], default: 'unknown' },
  timestamp: { type: Date, default: Date.now },
  photoUrl: { type: String },
  caregiverAssigned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = {
  Memory: mongoose.model('Memory', memorySchema),
  Person: mongoose.model('Person', personSchema),
  PeopleMetLog: mongoose.model('PeopleMetLog', peopleMetLogSchema)
};
