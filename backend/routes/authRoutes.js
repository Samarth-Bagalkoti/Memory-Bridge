const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authMiddleware } = require('../middleware/authMiddleware');
const { memoryStore } = require('../utils/memoryStore');

const JWT_SECRET = process.env.JWT_SECRET || 'memory_bridge_hackathon_super_secret_jwt_key_2026';

// Demo quick-login endpoint for seamless evaluation
router.post('/demo-login', (req, res) => {
  const { role } = req.body;
  const targetRole = role === 'caregiver' ? 'caregiver' : 'patient';
  
  const user = memoryStore.data.users.find(u => u.role === targetRole) || {
    id: targetRole === 'caregiver' ? 'usr_caregiver_1' : 'usr_patient_1',
    name: targetRole === 'caregiver' ? 'Meera Sharma' : 'Ravi Kumar',
    email: targetRole === 'caregiver' ? 'caregiver@memorybridge.org' : 'patient@memorybridge.org',
    role: targetRole,
    patientId: 'pat_ravi_72'
  };

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, patientId: user.patientId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId: user.patientId
    }
  });
});

// Regular Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  const user = memoryStore.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials. Try Demo Login buttons!' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, patientId: user.patientId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId: user.patientId
    }
  });
});

// Register endpoint
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const assignedRole = role === 'caregiver' ? 'caregiver' : 'patient';
  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    passwordHash: 'hashed_' + password,
    role: assignedRole,
    patientId: 'pat_ravi_72'
  };

  memoryStore.data.users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, patientId: newUser.patientId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ token, user: newUser });
});

// Me endpoint
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
