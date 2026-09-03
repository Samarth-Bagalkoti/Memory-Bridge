const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Appointments
router.get('/:patientId', (req, res) => {
  res.json(memoryStore.getAppointments(req.params.patientId));
});

// POST Add appointment
router.post('/', (req, res) => {
  const newApp = memoryStore.addAppointment(req.body);
  res.status(201).json(newApp);
});

module.exports = router;
