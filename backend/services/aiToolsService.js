// Backend Controlled Data Access Tools for Memory Bridge AI Assistant
const { memoryStore } = require('../utils/memoryStore');

const aiToolsService = {
  getPatientProfile: (patientId = 'pat_ravi_72') => {
    return memoryStore.getPatientProfile(patientId);
  },

  getMemories: (patientId = 'pat_ravi_72') => {
    return memoryStore.getMemories(patientId);
  },

  getPeople: (patientId = 'pat_ravi_72') => {
    return memoryStore.getPeople(patientId);
  },

  getPeopleMetToday: (patientId = 'pat_ravi_72') => {
    return memoryStore.getPeopleMet(patientId);
  },

  getMedications: (patientId = 'pat_ravi_72') => {
    return memoryStore.getMedications(patientId);
  },

  getMedicationStatus: (patientId = 'pat_ravi_72') => {
    const meds = memoryStore.getMedications(patientId);
    const pending = meds.filter(m => !m.taken);
    const taken = meds.filter(m => m.taken);
    return { pending, taken, total: meds.length };
  },

  getAppointments: (patientId = 'pat_ravi_72') => {
    return memoryStore.getAppointments(patientId);
  },

  getRoutine: (patientId = 'pat_ravi_72') => {
    return memoryStore.getRoutines(patientId);
  },

  getAlerts: (patientId = 'pat_ravi_72') => {
    return memoryStore.getAlerts(patientId);
  },

  getLocation: (patientId = 'pat_ravi_72') => {
    const profile = memoryStore.getPatientProfile(patientId);
    return profile ? profile.currentLocation : null;
  },

  getCaregiverMessages: (patientId = 'pat_ravi_72') => {
    return memoryStore.getCaregiverMessages(patientId);
  },

  getCognitivePerformance: (patientId = 'pat_ravi_72') => {
    const sessions = memoryStore.getGameSessions(patientId);
    return {
      totalGames: sessions.length,
      sessions
    };
  },

  // Compile full verified context summary for AI prompt
  getFullContextSummary: (clientSyncData = null, patientId = 'pat_ravi_72') => {
    const profile = clientSyncData?.patient || aiToolsService.getPatientProfile(patientId);
    const people = clientSyncData?.people || aiToolsService.getPeople(patientId);
    const memories = clientSyncData?.memories || aiToolsService.getMemories(patientId);
    const meds = clientSyncData?.medications || aiToolsService.getMedications(patientId);
    const routines = clientSyncData?.routines || aiToolsService.getRoutine(patientId);
    const appointments = clientSyncData?.appointments || aiToolsService.getAppointments(patientId);
    const peopleMet = clientSyncData?.peopleMet || aiToolsService.getPeopleMetToday(patientId);
    const messages = clientSyncData?.messages || aiToolsService.getCaregiverMessages(patientId);

    return {
      patient: {
        name: profile?.fullName || 'Sanjay Singhania',
        age: profile?.age || 72,
        emergencyContact: profile?.emergencyContact || 'Roohi (Daughter - 8019552347)',
        status: profile?.status || 'safe',
        currentLocation: profile?.currentLocation?.address || 'Home — Living Room'
      },
      people: people.map(p => ({ name: p.name, relationship: p.relationship, notes: p.notes })),
      memories: memories.map(m => ({ title: m.title, story: m.description, category: m.category, location: m.location, date: m.date })),
      medications: meds.map(m => ({ name: m.name, dosage: m.dosage, time: m.time, instructions: m.instructions, taken: m.taken })),
      routines: routines.map(r => ({ title: r.title, time: r.time, completed: r.completed })),
      appointments: appointments.map(a => ({ title: a.title, doctorOrPlace: a.doctorOrPlace || a.doctor, time: a.time, date: a.date })),
      peopleMetToday: peopleMet.map(pm => ({ name: pm.detectedName, relationship: pm.relationship, time: pm.timestamp })),
      recentCaregiverMessage: messages && messages.length > 0 ? messages[0].message : null
    };
  }
};

module.exports = aiToolsService;
