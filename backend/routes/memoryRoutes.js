const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Memories for patient
router.get('/:patientId', (req, res) => {
  const memories = memoryStore.getMemories(req.params.patientId);
  res.json(memories);
});

// POST Add memory
router.post('/', (req, res) => {
  const { title, description, category, date, relationship, location, imageUrl } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description required' });
  }
  const newMem = memoryStore.addMemory(req.body);
  res.status(201).json(newMem);
});

// DELETE Memory
router.delete('/:id', (req, res) => {
  memoryStore.data.memories = memoryStore.data.memories.filter(m => m.id !== req.params.id);
  res.json({ message: 'Memory deleted successfully' });
});

module.exports = router;
