const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Medications for patient
router.get('/:patientId', (req, res) => {
  const meds = memoryStore.getMedications(req.params.patientId);
  res.json(meds);
});

// POST Mark medication as taken
router.post('/:id/take', (req, res) => {
  const updatedMed = memoryStore.markMedicationTaken(req.params.id);
  res.json({ message: 'Medication marked as taken', medication: updatedMed });
});

// POST Add new medication
router.post('/', (req, res) => {
  const { name, dosage, time, schedule } = req.body;
  const newMed = {
    id: 'med_' + Date.now(),
    patientId: req.body.patientId || 'pat_ravi_72',
    name,
    dosage,
    time,
    schedule: schedule || 'Daily',
    taken: false
  };
  memoryStore.data.medications.push(newMed);
  res.status(201).json(newMed);
});

module.exports = router;
