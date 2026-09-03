const express = require('express');
const router = express.Router();
const { memoryStore } = require('../utils/memoryStore');

// GET Routines
router.get('/:patientId', (req, res) => {
  res.json(memoryStore.getRoutines(req.params.patientId));
});

// POST Add routine task
router.post('/', (req, res) => {
  const { title, time, icon } = req.body;
  const newTask = {
    id: 'rt_' + Date.now(),
    patientId: req.body.patientId || 'pat_ravi_72',
    title,
    time,
    icon: icon || '📅',
    completed: false
  };
  memoryStore.data.routines.push(newTask);
  res.status(201).json(newTask);
});

// PUT Toggle completed
router.put('/:id/toggle', (req, res) => {
  const task = memoryStore.toggleRoutine(req.params.id);
  res.json(task);
});

module.exports = router;
