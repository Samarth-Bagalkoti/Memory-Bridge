const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Patient current location
router.get('/:patientId', (req, res) => {
  const profile = memoryStore.getPatientProfile(req.params.patientId);
  res.json(profile.currentLocation);
});

// POST Refresh / Update location (supports browser GPS or simulated location refresh)
router.post('/', (req, res) => {
  const { address, lat, lng } = req.body;
  const updatedLocation = memoryStore.updatePatientLocation(
    address || 'Home — Living Room',
    lat || 12.9716,
    lng || 77.5946
  );
  res.json({
    message: 'Location updated successfully',
    location: updatedLocation
  });
});

module.exports = router;
