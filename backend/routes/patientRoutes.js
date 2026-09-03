const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Patient profile
router.get('/:id', (req, res) => {
  const profile = memoryStore.getPatientProfile(req.params.id);
  res.json(profile);
});

// UPDATE Patient status or location
router.put('/:id', (req, res) => {
  const { status, location } = req.body;
  if (status) {
    memoryStore.updatePatientStatus(status);
  }
  if (location) {
    memoryStore.updatePatientLocation(location.address, location.lat, location.lng);
  }
  res.json(memoryStore.getPatientProfile(req.params.id));
});

module.exports = router;
