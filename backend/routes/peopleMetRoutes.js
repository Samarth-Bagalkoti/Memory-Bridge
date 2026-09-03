const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET People met logs for patient
router.get('/:patientId', (req, res) => {
  const logs = memoryStore.getPeopleMet(req.params.patientId);
  res.json(logs);
});

// POST Log new person encounter (from camera detection)
router.post('/', (req, res) => {
  const { detectedName, relationship, status, photoUrl } = req.body;
  const newLog = memoryStore.logPersonMet(req.body);
  res.status(201).json(newLog);
});

// PUT Name an unknown person (caregiver action)
router.put('/:id/identify', (req, res) => {
  const { name, relationship, notes } = req.body;
  if (!name || !relationship) {
    return res.status(400).json({ message: 'Name and relationship are required' });
  }
  const updatedLog = memoryStore.identifyUnknownPerson(req.params.id, name, relationship, notes);
  if (!updatedLog) {
    return res.status(404).json({ message: 'Encounter record not found' });
  }
  res.json(updatedLog);
});

module.exports = router;
