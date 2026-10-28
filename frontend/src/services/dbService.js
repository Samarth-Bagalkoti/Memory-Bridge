// IndexedDB Biometric & Encounter Storage Layer for Memory Bridge
// Stores 128-dimensional face descriptors, profiles, snapshots, and encounter logs locally

const DB_NAME = 'MemoryBridgeDB';
const DB_VERSION = 1;
const STORE_FACES = 'registered_faces';
const STORE_ENCOUNTERS = 'people_met_encounters';

class IndexedDBService {
  constructor() {
    this.dbPromise = this.initDB();
  }

  initDB() {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn('IndexedDB not supported in this environment.');
        return resolve(null);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 1. Store for registered faces
        if (!db.objectStoreNames.contains(STORE_FACES)) {
          const faceStore = db.createObjectStore(STORE_FACES, { keyPath: 'id' });
          faceStore.createIndex('name', 'name', { unique: false });
          faceStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 2. Store for encounter logs (People Met Today)
        if (!db.objectStoreNames.contains(STORE_ENCOUNTERS)) {
          const encounterStore = db.createObjectStore(STORE_ENCOUNTERS, { keyPath: 'id' });
          encounterStore.createIndex('timestamp', 'timestamp', { unique: false });
          encounterStore.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB opening error:', event.target.error);
        resolve(null);
      };
    });
  }

  // --- REGISTERED FACES OPERATIONS ---

  async saveRegisteredFace(personData) {
    const db = await this.dbPromise;
    const newPerson = {
      id: personData.id || 'face_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: personData.name,
      relationship: personData.relationship,
      descriptor: personData.descriptor ? Array.from(personData.descriptor) : null,
      photoUrl: personData.photoUrl || null,
      notes: personData.notes || '',
      createdAt: personData.createdAt || new Date().toISOString()
    };

    if (!db) return newPerson;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_FACES], 'readwrite');
      const store = transaction.objectStore(STORE_FACES);
      const req = store.put(newPerson);

      req.onsuccess = () => resolve(newPerson);
      req.onerror = (e) => {
        console.error('Error saving face to IndexedDB:', e);
        resolve(newPerson);
      };
    });
  }

  async getRegisteredFaces() {
    const db = await this.dbPromise;
    if (!db) return [];

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_FACES], 'readonly');
      const store = transaction.objectStore(STORE_FACES);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async deleteRegisteredFace(id) {
    const db = await this.dbPromise;
    if (!db) return false;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_FACES], 'readwrite');
      const store = transaction.objectStore(STORE_FACES);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // --- PEOPLE MET ENCOUNTER LOGS ---

  async logEncounter(encounterData) {
    const db = await this.dbPromise;
    const newEncounter = {
      id: encounterData.id || 'pml_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      detectedName: encounterData.detectedName || 'Unknown Person',
      relationship: encounterData.relationship || 'Unknown Visitor',
      status: encounterData.status || 'unknown',
      timestamp: encounterData.timestamp || new Date().toISOString(),
      photoUrl: encounterData.photoUrl || null,
      descriptor: encounterData.descriptor ? Array.from(encounterData.descriptor) : null,
      personId: encounterData.personId || null
    };

    if (!db) return newEncounter;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_ENCOUNTERS], 'readwrite');
      const store = transaction.objectStore(STORE_ENCOUNTERS);
      const req = store.put(newEncounter);

      req.onsuccess = () => resolve(newEncounter);
      req.onerror = () => resolve(newEncounter);
    });
  }

  async getEncounterLogs() {
    const db = await this.dbPromise;
    if (!db) return [];

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_ENCOUNTERS], 'readonly');
      const store = transaction.objectStore(STORE_ENCOUNTERS);
      const req = store.getAll();

      req.onsuccess = () => {
        const sorted = (req.result || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(sorted);
      };
      req.onerror = () => resolve([]);
    });
  }

  // Caregiver converts unknown encounter to registered face
  async convertUnknownToRegistered(encounterId, name, relationship, notes) {
    const encounters = await this.getEncounterLogs();
    const target = encounters.find(e => e.id === encounterId);
    if (!target) return null;

    // Save as new registered face profile with saved descriptor & snapshot!
    const registered = await this.saveRegisteredFace({
      name,
      relationship,
      descriptor: target.descriptor,
      photoUrl: target.photoUrl,
      notes: notes || 'Registered by caregiver from encounter log.'
    });

    // Update encounter in IndexedDB
    target.detectedName = name;
    target.relationship = relationship;
    target.status = 'known';
    target.personId = registered.id;
    await this.logEncounter(target);

    return registered;
  }

  // --- COMPLETE INDEXEDDB CLEANUP FUNCTIONS ---

  async clearAllFaceData() {
    const db = await this.dbPromise;
    if (!db) return false;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_FACES], 'readwrite');
      const store = transaction.objectStore(STORE_FACES);
      const req = store.clear();

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  async clearAllEncounterData() {
    const db = await this.dbPromise;
    if (!db) return false;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_ENCOUNTERS], 'readwrite');
      const store = transaction.objectStore(STORE_ENCOUNTERS);
      const req = store.clear();

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  // Centralized Reset for all Memory Bridge IndexedDB Stores
  async resetAllPersistentData() {
    try {
      await this.clearAllFaceData();
      await this.clearAllEncounterData();
      console.log('✅ IndexedDB MemoryBridgeDB stores cleared completely.');
      return true;
    } catch (e) {
      console.error('Error clearing MemoryBridgeDB IndexedDB stores:', e);
      return false;
    }
  }
}

export const dbService = new IndexedDBService();
