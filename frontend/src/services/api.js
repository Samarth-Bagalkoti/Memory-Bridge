import { storageService } from './storageService';

export const api = {
  // Patient Profile & Location
  getPatientProfile: async (id = 'pat_sanjay_72') => {
    const data = storageService.getData();
    const patient = data.patients.find(p => p.id === id) || data.patients[0];
    return patient;
  },

  updatePatientStatus: async (status, id = 'pat_sanjay_72') => {
    const data = storageService.getData();
    const updatedPatients = data.patients.map(p => {
      if (p.id === id || !id) {
        return { ...p, status };
      }
      return p;
    });
    storageService.updateSection('patients', updatedPatients);
    return { status };
  },

  updatePatientLocation: async (locationObj, id = 'pat_sanjay_72') => {
    const data = storageService.getData();
    const updatedPatients = data.patients.map(p => {
      if (p.id === id || !id) {
        return { ...p, currentLocation: { ...p.currentLocation, ...locationObj, lastUpdated: new Date().toISOString() } };
      }
      return p;
    });
    storageService.updateSection('patients', updatedPatients);
    return updatedPatients[0].currentLocation;
  },

  // Memories (Full CRUD & Persistence)
  getMemories: async () => {
    const data = storageService.getData();
    return data.memories || [];
  },

  addMemory: async (memoryData) => {
    const data = storageService.getData();
    const newMemory = {
      id: 'mem_' + Date.now(),
      title: memoryData.title,
      description: memoryData.description,
      category: memoryData.category || 'Family',
      date: memoryData.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      relationship: memoryData.relationship || 'Family',
      location: memoryData.location || 'Home',
      imageUrl: memoryData.imageUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
    };
    const updated = [newMemory, ...(data.memories || [])];
    storageService.updateSection('memories', updated);
    return newMemory;
  },

  editMemory: async (id, updatedFields) => {
    const data = storageService.getData();
    const updated = (data.memories || []).map(m => m.id === id ? { ...m, ...updatedFields } : m);
    storageService.updateSection('memories', updated);
    return updated.find(m => m.id === id);
  },

  deleteMemory: async (id) => {
    const data = storageService.getData();
    const updated = (data.memories || []).filter(m => m.id !== id);
    storageService.updateSection('memories', updated);
    return { success: true, id };
  },

  // People (Familiar Directory)
  getPeople: async () => {
    const data = storageService.getData();
    return data.people || [];
  },

  addPerson: async (personData) => {
    const data = storageService.getData();
    const newPerson = {
      id: 'person_' + Date.now(),
      name: personData.name,
      relationship: personData.relationship,
      phone: personData.phone || '8019552347',
      notes: personData.notes || '',
      photoUrl: personData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    };
    const updated = [...(data.people || []), newPerson];
    storageService.updateSection('people', updated);
    return newPerson;
  },

  // People Met Encounter Log
  getPeopleMet: async () => {
    const data = storageService.getData();
    return data.peopleMet || [];
  },

  logPersonMet: async (encounterData) => {
    const data = storageService.getData();
    const newEncounter = {
      id: 'pml_' + Date.now(),
      detectedName: encounterData.detectedName || 'Unknown Person',
      relationship: encounterData.relationship || 'Unknown Visitor',
      status: encounterData.status || 'unknown',
      timestamp: encounterData.timestamp || new Date().toISOString(),
      photoUrl: encounterData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    };
    const updated = [newEncounter, ...(data.peopleMet || [])];
    storageService.updateSection('peopleMet', updated);
    return newEncounter;
  },

  identifyPerson: async (encounterId, name, relationship, notes) => {
    const data = storageService.getData();

    // 1. Update encounter in peopleMet log
    let targetEncounterPhoto = null;
    const updatedMet = (data.peopleMet || []).map(log => {
      if (log.id === encounterId) {
        targetEncounterPhoto = log.photoUrl;
        return {
          ...log,
          detectedName: name,
          relationship: relationship,
          status: 'known'
        };
      }
      return log;
    });

    // 2. Add or update person in registered people list
    const existingPersonIndex = (data.people || []).findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    let updatedPeople = [...(data.people || [])];

    if (existingPersonIndex >= 0) {
      updatedPeople[existingPersonIndex] = {
        ...updatedPeople[existingPersonIndex],
        relationship,
        notes: notes || updatedPeople[existingPersonIndex].notes
      };
    } else {
      updatedPeople.push({
        id: 'person_' + Date.now(),
        name,
        relationship,
        phone: '8019552347',
        notes: notes || 'Registered by caregiver after encounter.',
        photoUrl: targetEncounterPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
      });
    }

    storageService.saveData({
      ...data,
      peopleMet: updatedMet,
      people: updatedPeople
    });

    return { id: encounterId, name, relationship, status: 'known' };
  },

  // Medications
  getMedications: async () => {
    const data = storageService.getData();
    return data.medications || [];
  },

  addMedication: async (medData) => {
    const data = storageService.getData();
    const newMed = {
      id: 'med_' + Date.now(),
      name: medData.name,
      dosage: medData.dosage,
      time: medData.time,
      schedule: medData.schedule || 'Daily',
      instructions: medData.instructions || '',
      taken: false
    };
    const updatedMeds = [...(data.medications || []), newMed];

    // Also auto-add to daily routine timetable!
    const newRoutineItem = {
      id: 'rt_med_' + Date.now(),
      title: `💊 ${medData.name}`,
      time: medData.time,
      icon: '💊',
      completed: false
    };
    const updatedRoutines = [...(data.routines || []), newRoutineItem];

    storageService.saveData({
      ...data,
      medications: updatedMeds,
      routines: updatedRoutines
    });

    return newMed;
  },

  takeMedication: async (medId) => {
    const data = storageService.getData();
    let targetName = '';
    const updatedMeds = (data.medications || []).map(m => {
      if (m.id === medId) {
        targetName = m.name;
        return { ...m, taken: true };
      }
      return m;
    });

    // Update corresponding routine if present
    const updatedRoutines = (data.routines || []).map(r => {
      if (targetName && r.title.toLowerCase().includes(targetName.toLowerCase())) {
        return { ...r, completed: true };
      }
      return r;
    });

    storageService.saveData({
      ...data,
      medications: updatedMeds,
      routines: updatedRoutines
    });

    return { message: 'Medication marked taken' };
  },

  // Routines
  getRoutines: async () => {
    const data = storageService.getData();
    return data.routines || [];
  },

  toggleRoutine: async (id) => {
    const data = storageService.getData();
    const updated = (data.routines || []).map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    storageService.updateSection('routines', updated);
    return { id, completed: true };
  },

  // Cognitive Games & Sessions (FIX FOR SCORE ACCUMULATION BUG)
  saveGameSession: async (sessionData) => {
    const data = storageService.getData();

    const newSession = {
      id: 'gs_' + Date.now(),
      gameId: sessionData.gameId,
      gameName: sessionData.gameName,
      score: sessionData.score, // Round accuracy (0 to 100)
      accuracy: sessionData.accuracy,
      responseTimeSec: sessionData.responseTimeSec || 4.0,
      currentDifficulty: sessionData.currentDifficulty || 1,
      timestamp: new Date().toISOString()
    };

    const updatedSessions = [newSession, ...(data.gameSessions || [])];

    // Compute new adaptive difficulty based ONLY on history
    let nextDifficultyLevel = sessionData.currentDifficulty || 1;
    if (sessionData.accuracy >= 80) {
      nextDifficultyLevel = Math.min(3, nextDifficultyLevel + 1);
    } else if (sessionData.accuracy < 50) {
      nextDifficultyLevel = Math.max(1, nextDifficultyLevel - 1);
    }

    // Recalculate overall category performance
    const categorySessions = updatedSessions.filter(s => s.gameId === sessionData.gameId);
    const avgAccuracy = Math.round(categorySessions.reduce((acc, curr) => acc + curr.accuracy, 0) / categorySessions.length);

    const prevPerf = data.cognitivePerformance || {};
    const updatedCategories = (prevPerf.categoryPerformance || []).map(cat => {
      if (cat.name.toLowerCase() === sessionData.gameName.toLowerCase() || cat.name === sessionData.gameId) {
        return {
          ...cat,
          accuracy: avgAccuracy,
          sessionsCount: categorySessions.length
        };
      }
      return cat;
    });

    const totalGames = updatedSessions.length;
    const overallAcc = Math.round(updatedSessions.reduce((acc, curr) => acc + curr.accuracy, 0) / totalGames);

    const updatedPerf = {
      ...prevPerf,
      overallAccuracy: overallAcc,
      totalGamesCompleted: totalGames,
      currentDifficultyLevel: nextDifficultyLevel,
      trend: overallAcc >= 80 ? 'High Engagement / Excellent Progress' : overallAcc >= 60 ? 'Steady Active Engagement' : 'Needs Gentle Practice',
      categoryPerformance: updatedCategories
    };

    storageService.saveData({
      ...data,
      gameSessions: updatedSessions,
      cognitivePerformance: updatedPerf
    });

    let message = 'Great game session!';
    if (sessionData.accuracy >= 80) {
      message = 'Outstanding accuracy! Difficulty increased for next round.';
    } else if (sessionData.accuracy >= 50) {
      message = 'Good effort! Keeping current difficulty level.';
    } else {
      message = 'Nice practice round! Adjusted difficulty level for better comfort.';
    }

    return {
      session: newSession,
      adaptiveFeedback: {
        nextDifficultyLevel,
        message
      }
    };
  },

  getGamePerformance: async () => {
    const data = storageService.getData();
    return data.cognitivePerformance || {
      overallAccuracy: 85,
      totalGamesCompleted: 0,
      currentDifficultyLevel: 1,
      trend: 'Good Engagement',
      categoryPerformance: []
    };
  },

  // Alerts & Safety
  simulateSafetyAlert: async () => {
    const data = storageService.getData();

    // 1. Update patient status to wandering alert
    const updatedPatients = (data.patients || []).map(p => ({ ...p, status: 'wandering' }));

    // 2. Add safety alert
    const newAlert = {
      id: 'alt_' + Date.now(),
      type: 'safety_wandering',
      message: '🚨 SAFETY ALERT: Possible wandering detected near main entrance boundary.',
      timestamp: new Date().toISOString()
    };
    const updatedAlerts = [newAlert, ...(data.alerts || [])];

    storageService.saveData({
      ...data,
      patients: updatedPatients,
      alerts: updatedAlerts
    });

    return { message: 'Safety alert simulated' };
  },

  triggerEmergency: async () => {
    const data = storageService.getData();

    const emergencyAlert = {
      id: 'alt_emerg_' + Date.now(),
      type: 'emergency',
      message: '🚨 EMERGENCY ALERT DISPATCHED: Patient requested immediate assistance!',
      timestamp: new Date().toISOString()
    };
    const updatedAlerts = [emergencyAlert, ...(data.alerts || [])];

    storageService.updateSection('alerts', updatedAlerts);
    return { message: 'Emergency help alert dispatched!' };
  },

  getAlerts: async () => {
    const data = storageService.getData();
    return data.alerts || [];
  },

  // Caregiver Messages
  getCaregiverMessages: async () => {
    const data = storageService.getData();
    return data.messages || [];
  },

  sendCaregiverMessage: async (messageText) => {
    const data = storageService.getData();
    const newMsg = {
      id: 'msg_' + Date.now(),
      caregiverName: 'Meera Sharma (Caregiver)',
      message: messageText,
      timestamp: new Date().toISOString()
    };
    const updated = [newMsg, ...(data.messages || [])];
    storageService.updateSection('messages', updated);
    return newMsg;
  },

  // Full Demo Data Reset
  resetDemoData: async () => {
    return storageService.resetDemoData();
  }
};
