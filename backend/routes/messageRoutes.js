const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Caregiver messages for patient
router.get('/:patientId', (req, res) => {
  res.json(memoryStore.getCaregiverMessages(req.params.patientId));
});

// POST Send caregiver message
router.post('/', (req, res) => {
  const { message, caregiverName } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }
  const newMsg = memoryStore.addCaregiverMessage(req.body);
  res.status(201).json(newMsg);
});

module.exports = router;
