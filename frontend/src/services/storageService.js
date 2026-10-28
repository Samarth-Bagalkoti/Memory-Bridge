// Centralized LocalStorage Layer for Memory Bridge
// Single Key: memory_bridge_data
// No External Database Dependency

import { dbService } from './dbService';

const STORAGE_KEY = 'memory_bridge_data';

export const initialDemoData = {
  patients: [
    {
      id: 'pat_sanjay_72',
      fullName: 'Sanjay Singhania',
      age: 72,
      family: [
        { name: 'Roohi', relationship: 'Daughter', phone: '8019552347' },
        { name: 'Vansh', relationship: 'Son', phone: '8019552347' },
        { name: 'Kalpana', relationship: 'Wife', phone: '8019552347' }
      ],
      caregiver: { name: 'Meera Sharma', phone: '8019552347' },
      emergencyContact: { name: 'Roohi (Daughter)', phone: '8019552347' },
      currentLocation: {
        address: 'Home — Living Room, Bengaluru',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        isSimulated: true,
        lastUpdated: new Date().toISOString()
      },
      status: 'safe'
    }
  ],
  caregivers: [
    { id: 'usr_caregiver_1', name: 'Meera Sharma', email: 'meera@memorybridge.org', phone: '8019552347' }
  ],
  memories: [
    {
      id: 'mem_1',
      title: 'Family Villa in Shimla',
      description: 'Our cozy summer villa surrounded by pine trees where Kalpana and I spent our anniversaries.',
      category: 'Places',
      date: '1990 - Present',
      relationship: 'Wife Kalpana',
      location: 'Shimla, Himachal Pradesh',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mem_2',
      title: "Roohi's University Graduation",
      description: 'Roohi graduated with high distinction. We had a wonderful dinner together as a family.',
      category: 'Important Events',
      date: 'June 2018',
      relationship: 'Daughter Roohi',
      location: 'University Hall',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mem_3',
      title: "Vansh's First Tech Award",
      description: 'Vansh presented his innovative engineering project and won first place. Extremely proud moment for all of us.',
      category: 'Family',
      date: 'November 2021',
      relationship: 'Son Vansh',
      location: 'Tech Convention Center',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mem_4',
      title: 'Childhood Mornings in Old Town',
      description: 'Playing in the courtyard of our ancestral home with childhood friends and drinking fresh hot tea.',
      category: 'Childhood',
      date: '1960s',
      relationship: 'Family',
      location: 'Old Town Courtyard',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mem_5',
      title: 'Golden Wedding Anniversary',
      description: 'Kalpana, Roohi, Vansh, and all our close relatives gathered for a traditional feast and music evening.',
      category: 'Celebrations',
      date: 'December 2023',
      relationship: 'Wife Kalpana',
      location: 'Grand Banquet House',
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
    }
  ],
  people: [
    {
      id: 'person_1',
      name: 'Roohi',
      relationship: 'Daughter',
      phone: '8019552347',
      notes: 'Calls every evening at 6:00 PM and loves sharing stories.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'person_2',
      name: 'Vansh',
      relationship: 'Son',
      phone: '8019552347',
      notes: 'Visits on Sundays for afternoon lunch.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'person_3',
      name: 'Kalpana',
      relationship: 'Wife',
      phone: '8019552347',
      notes: 'Beloved wife, manages morning garden walk together.',
      photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'person_4',
      name: 'Meera Sharma',
      relationship: 'Caregiver',
      phone: '8019552347',
      notes: 'Helps with medicines, daily exercises, and health tracking.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    }
  ],
  peopleMet: [],
  medications: [
    {
      id: 'med_1',
      name: 'Morning Heart & Memory Care',
      dosage: '1 Tablet (10mg)',
      time: '09:00 AM',
      schedule: 'Daily Morning',
      instructions: 'Take with water after breakfast',
      taken: true
    },
    {
      id: 'med_2',
      name: 'Afternoon Memory Booster',
      dosage: '1 Capsule',
      time: '02:00 PM',
      schedule: 'Daily Afternoon',
      instructions: 'Take after lunch',
      taken: false
    },
    {
      id: 'med_3',
      name: 'Evening BP Supplement',
      dosage: '1 Tablet (5mg)',
      time: '08:00 PM',
      schedule: 'Daily Evening',
      instructions: 'Take before dinner',
      taken: false
    }
  ],
  medicationLogs: [],
  appointments: [
    { id: 'apt_1', title: 'Doctor Vasudev Routine Checkup', time: '2:00 PM', doctor: 'Dr. Vasudev', location: 'City Clinic' }
  ],
  routines: [
    { id: 'rt_1', title: 'Wake up & Morning Tea', time: '7:00 AM', icon: '🌅', completed: true },
    { id: 'rt_2', title: 'Breakfast with Kalpana', time: '8:00 AM', icon: '🍳', completed: true },
    { id: 'rt_3', title: 'Morning Medicine', time: '9:00 AM', icon: '💊', completed: true },
    { id: 'rt_4', title: 'Doctor Appointment with Dr. Vasudev', time: '2:00 PM', icon: '🩺', completed: false },
    { id: 'rt_5', title: 'Call Daughter Roohi', time: '6:00 PM', icon: '📞', completed: false }
  ],
  gameSessions: [
    { id: 'gs_1', gameId: 'who_is_this', gameName: 'Who Is This?', score: 100, accuracy: 100, currentDifficulty: 1, timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'gs_2', gameId: 'family_memory', gameName: 'Family Memory Game', score: 80, accuracy: 80, currentDifficulty: 1, timestamp: new Date(Date.now() - 43200000).toISOString() }
  ],
  cognitivePerformance: {
    overallAccuracy: 85,
    totalGamesCompleted: 6,
    currentDifficultyLevel: 2,
    trend: 'Active & High Engagement',
    categoryPerformance: [
      { name: 'Who Is This?', accuracy: 90, sessionsCount: 2, avgResponseTimeSec: 3.4 },
      { name: 'Family Memory Game', accuracy: 85, sessionsCount: 2, avgResponseTimeSec: 4.1 },
      { name: 'Remember The Numbers', accuracy: 75, sessionsCount: 1, avgResponseTimeSec: 5.2 },
      { name: 'Place Recognition', accuracy: 90, sessionsCount: 1, avgResponseTimeSec: 3.8 }
    ]
  },
  alerts: [
    { id: 'alt_1', type: 'info', message: 'Morning medication taken successfully.', timestamp: new Date(Date.now() - 28800000).toISOString() }
  ],
  notifications: [],
  messages: [
    {
      id: 'msg_1',
      caregiverName: 'Meera Sharma (Caregiver)',
      message: "Good morning Sanjay! I'll visit you at 5 PM today with fresh fruit.",
      timestamp: new Date(Date.now() - 14400000).toISOString()
    }
  ],
  locations: [
    { id: 'loc_1', address: 'Home — Living Room, Bengaluru', coordinates: { lat: 12.9716, lng: 77.5946 }, isSimulated: true, timestamp: new Date().toISOString() }
  ]
};

// Event Listeners for Storage Updates
const listeners = new Set();

export const subscribeToStorage = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = (data) => {
  listeners.forEach((listener) => {
    try {
      listener(data);
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
};

export const storageService = {
  getData: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let parsed = {};
      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          console.warn('Malformed JSON in localStorage, using defaults');
          parsed = {};
        }
      }

      // Safely ensure every key from initialDemoData is present and non-null
      const result = {};
      for (const key of Object.keys(initialDemoData)) {
        if (parsed && parsed[key] !== undefined && parsed[key] !== null) {
          result[key] = parsed[key];
        } else {
          result[key] = initialDemoData[key];
        }
      }

      // Enforce valid array structures for all list fields
      const arrayKeys = ['patients', 'caregivers', 'memories', 'people', 'peopleMet', 'medications', 'medicationLogs', 'appointments', 'routines', 'gameSessions', 'alerts', 'notifications', 'messages', 'locations'];
      for (const k of arrayKeys) {
        if (!Array.isArray(result[k])) {
          result[k] = initialDemoData[k] || [];
        }
      }

      // Ensure patients array has Sanjay Singhania
      if (result.patients.length === 0) {
        result.patients = initialDemoData.patients;
      }

      return result;
    } catch (err) {
      console.error('Failed to access localStorage, returning fallback demo data:', err);
      return initialDemoData;
    }
  },

  saveData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      notifyListeners(data);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  },

  updateSection: (sectionKey, updaterOrValue) => {
    const fullData = storageService.getData();
    const currentSection = fullData[sectionKey];
    let nextSection;
    if (typeof updaterOrValue === 'function') {
      nextSection = updaterOrValue(currentSection);
    } else {
      nextSection = updaterOrValue;
    }
    const updatedData = { ...fullData, [sectionKey]: nextSection };
    storageService.saveData(updatedData);
    return nextSection;
  },

  resetDemoData: async () => {
    try {
      // 1. Wipe all persistent IndexedDB tables (registered faces & encounters)
      await dbService.resetAllPersistentData();

      // 2. Prepare clean demo data payload
      const cleanDemo = {
        ...initialDemoData,
        peopleMet: []
      };

      // 3. Clear and save clean initial demo state in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanDemo));
      notifyListeners(cleanDemo);
      return cleanDemo;
    } catch (e) {
      console.error('Error resetting demo data:', e);
      return initialDemoData;
    }
  }
};
