import { storageService } from './storageService';

export class VoiceAssistantEngine {
  constructor() {
    this.SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    this.recognition = null;
    this.isListeningActive = false;
    this.status = 'Ready';
  }

  isSupported() {
    return !!this.SpeechRecognition;
  }

  initRecognitionInstance() {
    if (!this.SpeechRecognition) return null;
    try {
      const rec = new this.SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN';
      return rec;
    } catch (e) {
      console.warn('Failed to construct SpeechRecognition instance:', e);
      return null;
    }
  }

  startListening(callbacks = {}) {
    const { onStart, onTranscript, onFinalQuery, onError, onStatusChange } = callbacks;

    if (!this.SpeechRecognition) {
      this.status = 'Voice unavailable — use text input';
      onStatusChange && onStatusChange(this.status);
      onError && onError('Voice recognition is temporarily unavailable on this browser. You can type your question below!');
      return;
    }

    this.isListeningActive = true;
    this.recognition = this.initRecognitionInstance();

    if (!this.recognition) {
      this.status = 'Voice unavailable — use text input';
      onStatusChange && onStatusChange(this.status);
      onError && onError('Voice recognition is temporarily unavailable.');
      return;
    }

    this.recognition.onstart = () => {
      this.status = 'Listening…';
      onStatusChange && onStatusChange(this.status);
      onStart && onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const part = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += part;
        } else {
          interimTranscript += part;
        }
      }

      if (interimTranscript) {
        onTranscript && onTranscript(interimTranscript);
      }

      if (finalTranscript) {
        this.status = 'Processing…';
        onStatusChange && onStatusChange(this.status);
        onTranscript && onTranscript(finalTranscript);
        onFinalQuery && onFinalQuery(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition error event:', event.error);

      if (event.error === 'network') {
        this.status = 'Voice unavailable — use text input';
        onStatusChange && onStatusChange(this.status);
        onError && onError('Voice recognition is temporarily unavailable.');
        this.isListeningActive = false;
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.status = 'Voice unavailable — use text input';
        onStatusChange && onStatusChange(this.status);
        onError && onError('Microphone access blocked. Please check browser permissions or use text input.');
        this.isListeningActive = false;
      } else if (event.error === 'audio-capture') {
        this.status = 'Voice unavailable — use text input';
        onStatusChange && onStatusChange(this.status);
        onError && onError('No microphone hardware detected on your device.');
        this.isListeningActive = false;
      } else if (event.error === 'no-speech') {
        // Do not crash or display fatal error for no-speech, auto-restart in onend will keep listener alive
        console.log('No speech detected during window, keeping microphone listener active.');
      } else {
        onError && onError(`Voice recognition note: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      // Auto restart if user didn't explicitly click stop and no fatal error occurred
      if (this.isListeningActive) {
        setTimeout(() => {
          if (this.isListeningActive) {
            try {
              this.recognition = this.initRecognitionInstance();
              if (this.recognition) {
                this.startListening(callbacks);
              }
            } catch (e) {
              console.warn('Auto restart speech recognition error:', e);
            }
          }
        }, 300);
      } else {
        if (this.status !== 'Voice unavailable — use text input') {
          this.status = 'Ready';
          onStatusChange && onStatusChange(this.status);
        }
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start caught exception:', e);
    }
  }

  stopListening() {
    this.isListeningActive = false;
    this.status = 'Ready';
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
  }

  // Unified Intent Parser for Spoken & Typed Input
  processQuery(query) {
    const q = (query || '').toLowerCase().trim();
    const data = storageService.getData();

    const people = data.people || [];
    const meds = data.medications || [];
    const routines = data.routines || [];
    const peopleMet = data.peopleMet || [];

    // Query 1: Who is Roohi?
    if (q.includes('roohi')) {
      const roohi = people.find(p => p.name.toLowerCase().includes('roohi'));
      return {
        answer: roohi
          ? `Roohi is your loving daughter. ${roohi.notes || 'She calls you every evening at 6:00 PM.'}`
          : 'Roohi is your daughter. She calls you every evening and visits frequently.',
        intent: 'person_roohi'
      };
    }

    // Query 2: Who is Vansh?
    if (q.includes('vansh')) {
      const vansh = people.find(p => p.name.toLowerCase().includes('vansh'));
      return {
        answer: vansh
          ? `Vansh is your son. ${vansh.notes || 'He visits you every Sunday.'}`
          : 'Vansh is your son. He visits you on Sundays for lunch.',
        intent: 'person_vansh'
      };
    }

    // Query 3: Who is Kalpana?
    if (q.includes('kalpana') || q.includes('wife')) {
      const kalpana = people.find(p => p.name.toLowerCase().includes('kalpana'));
      return {
        answer: kalpana
          ? `Kalpana is your beloved wife. ${kalpana.notes || 'You go for morning garden walks together.'}`
          : 'Kalpana is your wife. You share morning walks in the garden.',
        intent: 'person_kalpana'
      };
    }

    // Query 4: Who is my caregiver? / Meera
    if (q.includes('caregiver') || q.includes('meera')) {
      const caregiver = people.find(p => p.relationship.toLowerCase().includes('caregiver') || p.name.toLowerCase().includes('meera'));
      return {
        answer: caregiver
          ? `${caregiver.name} is your dedicated caregiver. ${caregiver.notes || 'She helps with medicines and daily routine.'}`
          : 'Meera Sharma is your caregiver. She assists with morning medicines and health checkups.',
        intent: 'caregiver_inquiry'
      };
    }

    // Query 5: When is my medicine? / meds
    if (q.includes('medicine') || q.includes('meds') || q.includes('tablet') || q.includes('pill')) {
      const nextPending = meds.find(m => !m.taken) || meds[0];
      if (nextPending) {
        return {
          answer: `Your next medication is ${nextPending.name} scheduled for ${nextPending.time}. Dosage: ${nextPending.dosage}. ${nextPending.taken ? 'You have already taken it.' : 'Please remember to take it with water.'}`,
          intent: 'medication_inquiry'
        };
      }
      return {
        answer: 'You have completed all scheduled medications for today! Great job Sanjay.',
        intent: 'medication_inquiry'
      };
    }

    // Query 6: What do I have today? / schedule
    if (q.includes('today') || q.includes('schedule') || q.includes('routine')) {
      const pendingRoutines = routines.filter(r => !r.completed);
      if (pendingRoutines.length > 0) {
        const itemsList = pendingRoutines.map(r => `${r.title} at ${r.time}`).join(', ');
        return {
          answer: `Today your remaining schedule includes: ${itemsList}.`,
          intent: 'schedule_inquiry'
        };
      }
      return {
        answer: 'All routine activities for today are completed! Relax and enjoy your time.',
        intent: 'schedule_inquiry'
      };
    }

    // Query 7: What is my next task?
    if (q.includes('next task') || q.includes('next activity') || q.includes('what should i do')) {
      const nextMed = meds.find(m => !m.taken);
      const nextRoutine = routines.find(r => !r.completed);
      if (nextMed) {
        return {
          answer: `Your next priority task is taking ${nextMed.name} at ${nextMed.time}.`,
          intent: 'next_task'
        };
      }
      if (nextRoutine) {
        return {
          answer: `Your next routine item is ${nextRoutine.title} scheduled at ${nextRoutine.time}.`,
          intent: 'next_task'
        };
      }
      return {
        answer: 'You have no pending tasks right now. You are doing fantastic!',
        intent: 'next_task'
      };
    }

    // Query 8: Who did I meet today?
    if (q.includes('meet') || q.includes('who did i meet') || q.includes('visited')) {
      if (peopleMet.length > 0) {
        const recentNames = peopleMet.slice(0, 3).map(p => `${p.detectedName} (${p.relationship})`).join(' and ');
        return {
          answer: `Today you met ${recentNames}.`,
          intent: 'people_met'
        };
      }
      return {
        answer: 'You met your caregiver Meera Sharma and your daughter Roohi today.',
        intent: 'people_met'
      };
    }

    // Query 9: Emergency / Help
    if (q.includes('help') || q.includes('emergency')) {
      return {
        answer: 'Emergency button available. Tap the red Emergency button on screen to send immediate location alert to Roohi and Meera.',
        intent: 'emergency'
      };
    }

    // Default warm fallback for Sanjay
    return {
      answer: `Hello Sanjay! I am your Memory Bridge voice companion. You can ask me "Who is Roohi?", "Who is Vansh?", "Who is Kalpana?", "When is my medicine?", "What do I have today?", "Who is my caregiver?", "Who did I meet today?", or "What is my next task?"`,
      intent: 'fallback'
    };
  }
}

export const voiceEngine = new VoiceAssistantEngine();
