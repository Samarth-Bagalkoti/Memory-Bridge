const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Active alerts for patient
router.get('/:patientId', (req, res) => {
  res.json(memoryStore.getAlerts(req.params.patientId));
});

// POST Create generic alert
router.post('/', (req, res) => {
  const alert = memoryStore.addAlert(req.body);
  res.status(201).json(alert);
});

// POST Simulate Safety Alert (Caregiver dashboard button)
router.post('/simulate-safety', (req, res) => {
  const patientId = req.body.patientId || 'pat_ravi_72';
  memoryStore.updatePatientStatus('wandering_alert');
  
  const alert = memoryStore.addAlert({
    patientId,
    type: 'safety',
    title: '🚨 SAFETY ALERT',
    message: 'Ravi may have moved outside his usual safe area near Living Room.'
  });

  res.json({
    message: 'Safety alert simulated successfully (Prototype Demo)',
    alert,
    patientProfile: memoryStore.getPatientProfile(patientId)
  });
});

// POST Trigger Emergency Help (Patient button)
router.post('/emergency', (req, res) => {
  const patientId = req.body.patientId || 'pat_ravi_72';
  memoryStore.updatePatientStatus('emergency');

  const alert = memoryStore.addAlert({
    patientId,
    type: 'emergency',
    title: '🚨 EMERGENCY HELP REQUESTED',
    message: 'Patient Ravi pressed Emergency Help button. Caregiver notified & location shared.'
  });

  res.json({
    message: 'Emergency alert sent successfully. Caregiver and emergency contacts notified! (Prototype Demo)',
    alert,
    patientProfile: memoryStore.getPatientProfile(patientId)
  });
});

module.exports = router;
