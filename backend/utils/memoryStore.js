// In-Memory Data Store fallback & MongoDB seeder data

const initialData = {
  users: [
    {
      id: 'usr_patient_1',
      name: 'Ravi Kumar',
      email: 'patient@memorybridge.org',
      passwordHash: '$2a$10$w8T0M4j/c1c5.m2Z2u6A3.8c7jW.lYvK9O8R2Q', // 'demo123'
      role: 'patient',
      patientId: 'pat_ravi_72'
    },
    {
      id: 'usr_caregiver_1',
      name: 'Meera Sharma',
      email: 'caregiver@memorybridge.org',
      passwordHash: '$2a$10$w8T0M4j/c1c5.m2Z2u6A3.8c7jW.lYvK9O8R2Q', // 'demo123'
      role: 'caregiver',
      patientId: 'pat_ravi_72'
    }
  ],

  patientProfile: {
    id: 'pat_ravi_72',
    fullName: 'Ravi Kumar',
    age: 72,
    emergencyContact: {
      name: 'Ananya Kumar (Daughter)',
      phone: '+1 (555) 019-2834'
    },
    quickContacts: [
      { name: 'Ananya', relation: 'Daughter', phone: '+1 (555) 019-2834', icon: '❤️' },
      { name: 'Raj', relation: 'Son', phone: '+1 (555) 012-9988', icon: '👨' },
      { name: 'Meera', relation: 'Caregiver', phone: '+1 (555) 018-4422', icon: '👩' }
    ],
    currentLocation: {
      address: 'Home — Living Room',
      coordinates: { lat: 12.9716, lng: 77.5946 },
      lastUpdated: new Date().toISOString(),
      isSimulated: true
    },
    status: 'safe'
  },

  people: [
    {
      id: 'person_1',
      patientId: 'pat_ravi_72',
      name: 'Ananya Kumar',
      relationship: 'Daughter',
      notes: 'Calls every evening at 6:00 PM. Loves baking.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      faceDescriptor: [0.12, 0.45, 0.88, 0.23, 0.67]
    },
    {
      id: 'person_2',
      patientId: 'pat_ravi_72',
      name: 'Raj Kumar',
      relationship: 'Son',
      notes: 'Visits on Sundays. Works as an engineer.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      faceDescriptor: [0.55, 0.12, 0.34, 0.91, 0.04]
    },
    {
      id: 'person_3',
      patientId: 'pat_ravi_72',
      name: 'Meera Sharma',
      relationship: 'Caregiver',
      notes: 'Helps with morning medicines and daily walks.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      faceDescriptor: [0.89, 0.76, 0.12, 0.43, 0.21]
    }
  ],

  memories: [
    {
      id: 'mem_1',
      patientId: 'pat_ravi_72',
      title: 'Our Family Home',
      description: 'The cozy green house where we grew roses in the garden.',
      category: 'place',
      date: '1985 - Present',
      relationship: 'Family Home',
      location: 'Green Park Estate',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mem_2',
      patientId: 'pat_ravi_72',
      title: "Ananya's Graduation",
      description: 'Ananya finished university with top honors in biology.',
      category: 'event',
      date: 'June 2018',
      relationship: 'Daughter Ananya',
      location: 'City University Hall',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mem_3',
      patientId: 'pat_ravi_72',
      title: 'Family Summer Trip to Hills',
      description: 'Walking by the cool lake and enjoying hot tea with Raj and Ananya.',
      category: 'event',
      date: 'May 2019',
      relationship: 'Family',
      location: 'Shimla Hills',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
    }
  ],

  medications: [
    {
      id: 'med_1',
      patientId: 'pat_ravi_72',
      name: 'Morning Heart & Memory Care',
      dosage: '1 Tablet (10mg)',
      time: '9:00 AM',
      schedule: 'Daily Morning with water',
      taken: false
    },
    {
      id: 'med_2',
      patientId: 'pat_ravi_72',
      name: 'Evening Vitamin D & Supplement',
      dosage: '1 Capsule',
      time: '7:00 PM',
      schedule: 'Daily Evening after meal',
      taken: false
    }
  ],

  medicationLogs: [
    {
      id: 'medlog_1',
      patientId: 'pat_ravi_72',
      medicationName: 'Yesterday Morning Tablet',
      scheduledTime: '9:00 AM',
      status: 'taken',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ],

  appointments: [
    {
      id: 'apt_1',
      patientId: 'pat_ravi_72',
      title: 'Doctor Appointment',
      doctorOrPlace: 'Dr. Vasudev (Neurology Clinic)',
      date: 'Today',
      time: '2:00 PM',
      reminder: '30 mins before',
      completed: false
    },
    {
      id: 'apt_2',
      patientId: 'pat_ravi_72',
      title: 'Daughter Call',
      doctorOrPlace: 'Ananya Video Call',
      date: 'Today',
      time: '6:00 PM',
      reminder: '10 mins before',
      completed: false
    }
  ],

  routines: [
    { id: 'rt_1', patientId: 'pat_ravi_72', title: 'Wake up & Morning Tea', time: '7:00 AM', icon: '🌅', completed: true },
    { id: 'rt_2', patientId: 'pat_ravi_72', title: 'Breakfast', time: '8:00 AM', icon: '🍳', completed: true },
    { id: 'rt_3', patientId: 'pat_ravi_72', title: 'Morning Medicine', time: '9:00 AM', icon: '💊', completed: false },
    { id: 'rt_4', patientId: 'pat_ravi_72', title: 'Garden Walk', time: '11:00 AM', icon: '🌿', completed: false },
    { id: 'rt_5', patientId: 'pat_ravi_72', title: 'Lunch', time: '1:00 PM', icon: '🍽️', completed: false },
    { id: 'rt_6', patientId: 'pat_ravi_72', title: 'Doctor Appointment', time: '2:00 PM', icon: '🩺', completed: false },
    { id: 'rt_7', patientId: 'pat_ravi_72', title: 'Call Ananya', time: '6:00 PM', icon: '📞', completed: false },
    { id: 'rt_8', patientId: 'pat_ravi_72', title: 'Evening Medicine', time: '8:00 PM', icon: '💊', completed: false }
  ],

  peopleMetLogs: [
    {
      id: 'pml_1',
      patientId: 'pat_ravi_72',
      personId: 'person_1',
      detectedName: 'Ananya Kumar',
      relationship: 'Daughter',
      status: 'known',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      caregiverAssigned: false
    },
    {
      id: 'pml_2',
      patientId: 'pat_ravi_72',
      personId: 'person_3',
      detectedName: 'Meera Sharma',
      relationship: 'Caregiver',
      status: 'known',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      caregiverAssigned: false
    },
    {
      id: 'pml_3',
      patientId: 'pat_ravi_72',
      detectedName: 'Unknown Person',
      relationship: 'Unknown Visitor',
      status: 'unknown',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      caregiverAssigned: false
    }
  ],

  gameSessions: [
    {
      id: 'gs_1',
      patientId: 'pat_ravi_72',
      gameId: 'who_is_this',
      gameName: 'Who Is This?',
      score: 90,
      accuracy: 90,
      responseTimeSec: 4.2,
      hintsUsed: 0,
      difficultyLevel: 2,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'gs_2',
      patientId: 'pat_ravi_72',
      gameId: 'family_memory',
      gameName: 'Family Memory Game',
      score: 80,
      accuracy: 80,
      responseTimeSec: 5.1,
      hintsUsed: 1,
      difficultyLevel: 2,
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 'gs_3',
      patientId: 'pat_ravi_72',
      gameId: 'remember_numbers',
      gameName: 'Remember The Numbers',
      score: 70,
      accuracy: 70,
      responseTimeSec: 6.8,
      hintsUsed: 1,
      difficultyLevel: 1,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],

  alerts: [
    {
      id: 'alt_1',
      patientId: 'pat_ravi_72',
      type: 'medication_missed',
      title: 'Morning Medicine Alert',
      message: 'Morning heart medicine was scheduled for 9:00 AM.',
      status: 'active',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ],

  caregiverMessages: [
    {
      id: 'msg_1',
      patientId: 'pat_ravi_72',
      caregiverName: 'Meera (Caregiver)',
      message: "Good morning Dad! I'll visit you at 5:00 PM today with fresh fruit.",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false
    }
  ]
};

// In-Memory store operations
class MemoryStore {
  constructor() {
    this.data = JSON.parse(JSON.stringify(initialData));
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
  }

  getPatientProfile(patientId) {
    return this.data.patientProfile;
  }

  updatePatientStatus(status) {
    this.data.patientProfile.status = status;
    return this.data.patientProfile;
  }

  updatePatientLocation(address, lat, lng) {
    this.data.patientProfile.currentLocation = {
      address,
      coordinates: { lat: lat || 12.9716, lng: lng || 77.5946 },
      lastUpdated: new Date().toISOString(),
      isSimulated: true
    };
    return this.data.patientProfile.currentLocation;
  }

  getPeople(patientId) {
    return this.data.people;
  }

  addPerson(person) {
    const newPerson = {
      id: 'person_' + Date.now(),
      patientId: person.patientId || 'pat_ravi_72',
      ...person
    };
    this.data.people.push(newPerson);
    return newPerson;
  }

  getMemories(patientId) {
    return this.data.memories;
  }

  addMemory(memory) {
    const newMem = {
      id: 'mem_' + Date.now(),
      patientId: memory.patientId || 'pat_ravi_72',
      ...memory
    };
    this.data.memories.unshift(newMem);
    return newMem;
  }

  getMedications(patientId) {
    return this.data.medications;
  }

  markMedicationTaken(medId) {
    const med = this.data.medications.find(m => m.id === medId);
    if (med) {
      med.taken = true;
      med.takenAt = new Date().toISOString();
      // Add log entry
      this.data.medicationLogs.unshift({
        id: 'medlog_' + Date.now(),
        patientId: med.patientId,
        medicationName: med.name,
        scheduledTime: med.time,
        status: 'taken',
        timestamp: new Date().toISOString()
      });
      // Mark routine task completed if matching
      const routineItem = this.data.routines.find(r => r.title.toLowerCase().includes('medicine'));
      if (routineItem) routineItem.completed = true;
    }
    return med;
  }

  getPeopleMet(patientId) {
    return this.data.peopleMetLogs;
  }

  logPersonMet(entry) {
    const newLog = {
      id: 'pml_' + Date.now(),
      patientId: entry.patientId || 'pat_ravi_72',
      detectedName: entry.detectedName || 'Unknown Person',
      relationship: entry.relationship || 'Unknown',
      status: entry.status || 'unknown',
      timestamp: new Date().toISOString(),
      photoUrl: entry.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      caregiverAssigned: false
    };
    this.data.peopleMetLogs.unshift(newLog);
    return newLog;
  }

  identifyUnknownPerson(logId, name, relationship, notes) {
    const log = this.data.peopleMetLogs.find(p => p.id === logId);
    if (log) {
      log.detectedName = name;
      log.relationship = relationship;
      log.status = 'known';
      log.caregiverAssigned = true;

      // Register new Person in familiar registry
      const newPerson = {
        id: 'person_' + Date.now(),
        patientId: log.patientId,
        name,
        relationship,
        notes: notes || 'Assigned by caregiver',
        photoUrl: log.photoUrl
      };
      this.data.people.push(newPerson);
    }
    return log;
  }

  getAppointments(patientId) {
    return this.data.appointments;
  }

  addAppointment(app) {
    const newApp = {
      id: 'apt_' + Date.now(),
      patientId: app.patientId || 'pat_ravi_72',
      ...app,
      completed: false
    };
    this.data.appointments.push(newApp);
    return newApp;
  }

  getRoutines(patientId) {
    return this.data.routines;
  }

  toggleRoutine(taskTitle) {
    const task = this.data.routines.find(r => r.title === taskTitle || r.id === taskTitle);
    if (task) {
      task.completed = !task.completed;
    }
    return task;
  }

  saveGameSession(session) {
    const newSession = {
      id: 'gs_' + Date.now(),
      patientId: session.patientId || 'pat_ravi_72',
      timestamp: new Date().toISOString(),
      ...session
    };
    this.data.gameSessions.unshift(newSession);
    return newSession;
  }

  getGameSessions(patientId) {
    return this.data.gameSessions;
  }

  getAlerts(patientId) {
    return this.data.alerts;
  }

  addAlert(alert) {
    const newAlert = {
      id: 'alt_' + Date.now(),
      patientId: alert.patientId || 'pat_ravi_72',
      timestamp: new Date().toISOString(),
      status: 'active',
      ...alert
    };
    this.data.alerts.unshift(newAlert);
    return newAlert;
  }

  getCaregiverMessages(patientId) {
    return this.data.caregiverMessages;
  }

  addCaregiverMessage(msg) {
    const newMsg = {
      id: 'msg_' + Date.now(),
      patientId: msg.patientId || 'pat_ravi_72',
      caregiverName: msg.caregiverName || 'Meera (Caregiver)',
      message: msg.message,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.data.caregiverMessages.unshift(newMsg);
    return newMsg;
  }
}

const memoryStore = new MemoryStore();

module.exports = { memoryStore, initialData };
