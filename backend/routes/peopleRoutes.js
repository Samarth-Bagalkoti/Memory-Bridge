const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Familiar registered people
router.get('/:patientId', (req, res) => {
  const people = memoryStore.getPeople(req.params.patientId);
  res.json(people);
});

// POST Add familiar person
router.post('/', (req, res) => {
  const { name, relationship, notes, photoUrl, faceDescriptor } = req.body;
  if (!name || !relationship) {
    return res.status(400).json({ message: 'Name and relationship are required' });
  }
  const newPerson = memoryStore.addPerson(req.body);
  res.status(201).json(newPerson);
});

module.exports = router;
