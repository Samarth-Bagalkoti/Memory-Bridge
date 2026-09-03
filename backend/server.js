const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const peopleRoutes = require('./routes/peopleRoutes');
const peopleMetRoutes = require('./routes/peopleMetRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const routineRoutes = require('./routes/routineRoutes');
const gameRoutes = require('./routes/gameRoutes');
const alertRoutes = require('./routes/alertRoutes');
const messageRoutes = require('./routes/messageRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Enable CORS and body parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'MEMORY BRIDGE Backend API',
    tagline: 'Bridging memories, people and care.',
    timestamp: new Date().toISOString(),
    demoMode: true
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/people-met', peopleMetRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/location', locationRoutes);

// MongoDB connection attempt (with smooth fallback to in-memory store)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/memory_bridge';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB database successfully.'))
  .catch(err => {
    console.log('ℹ️ MongoDB connection optional note:', err.message);
    console.log('⚡ Memory Bridge is running with robust fallback Data Store for instant offline hackathon testing.');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 MEMORY BRIDGE API Server running on port ${PORT}`);
  console.log(`Tagline: "Bridging memories, people and care."`);
  console.log(`Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
