import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { subscribeToStorage } from '../services/storageService';
import { useAccessibility } from '../context/AccessibilityContext';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import { FaceDetectorModal } from '../components/FaceDetectorModal';
import { EmergencyModal } from '../components/EmergencyModal';
import {
  CheckCircle,
  Clock,
  Calendar,
  Mic,
  Camera,
  AlertTriangle,
  PhoneCall,
  Volume2,
  Heart,
  MessageSquare,
  Users,
  Sun,
  Brain,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const PatientDashboard = () => {
  const { speak, getTextSizeClass, highContrast } = useAccessibility();
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [messages, setMessages] = useState([]);
  const [peopleMet, setPeopleMet] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Modal controls
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isFaceOpen, setIsFaceOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Subscribe to localStorage updates so any caregiver changes immediately reflect!
    const unsubscribe = subscribeToStorage(() => {
      loadDashboardData();
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const prof = await api.getPatientProfile();
      const meds = await api.getMedications();
      const rts = await api.getRoutines();
      const msgs = await api.getCaregiverMessages();
      const pm = await api.getPeopleMet();

      setProfile(prof || {
        fullName: 'Sanjay Singhania',
        age: 72,
        family: [
          { name: 'Roohi', relationship: 'Daughter' },
          { name: 'Vansh', relationship: 'Son' },
          { name: 'Kalpana', relationship: 'Wife' }
        ],
        caregiver: { name: 'Meera Sharma' }
      });

      setMedications(Array.isArray(meds) ? meds : []);
      setRoutines(Array.isArray(rts) ? rts : []);
      setMessages(Array.isArray(msgs) ? msgs : []);
      setPeopleMet(Array.isArray(pm) ? pm : []);
    } catch (err) {
      console.error('Error loading patient dashboard data:', err);
      // Fallback defaults so app never crashes
      setProfile({ fullName: 'Sanjay Singhania', age: 72 });
      setMedications([]);
      setRoutines([]);
      setMessages([]);
      setPeopleMet([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeMedicine = async (medId) => {
    if (!medId) return;
    await api.takeMedication(medId);
    speak('Good job Sanjay! Morning medicine marked as taken.');
    loadDashboardData();
  };

  // Format date & time safely
  const formattedTime = currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM';
  const formattedDate = currentTime ? currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Today';

  // Safe Hero medication item
  const safeMeds = Array.isArray(medications) ? medications : [];
  const heroMed = safeMeds.find(m => m && !m.taken) || safeMeds[0];

  // Safe list fallbacks
  const safeRoutines = Array.isArray(routines) ? routines : [];
  const safePeopleMet = Array.isArray(peopleMet) ? peopleMet : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold text-emerald-900 text-lg">Loading Sanjay Singhania's Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn pb-24">
      
      {/* 1. Live Date & Greeting Header */}
      <section className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
        highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-amber-200/80 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>{formattedDate}</span>
            </div>
            <h1 className={`font-black tracking-tight ${getTextSizeClass('text-4xl')} text-emerald-950`}>
              Good Morning, {profile?.fullName || 'Sanjay Singhania'} 👋
            </h1>
            <p className="text-slate-600 font-medium text-base mt-1">
              You are safe at home. Here is your daily timetable and memory companion.
            </p>
          </div>

          {/* 2. Large Time Display */}
          <div className="px-6 py-3.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-950 font-black text-3xl sm:text-4xl shadow-inner flex items-center gap-2">
            <Clock className="w-8 h-8 text-amber-700" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </section>

      {/* 3 & 4. HERO SECTION: NEXT TASK / MEDICATION */}
      <section className={`p-6 sm:p-8 rounded-3xl border-4 shadow-xl transition-all ${
        highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-emerald-600 border-emerald-500 text-white'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
            PRIORITY TASK
          </span>
        </div>

        <h2 className={`font-black tracking-tight ${getTextSizeClass('text-3xl')} mb-6`}>
          WHAT SHOULD I DO NOW?
        </h2>

        {heroMed ? (
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-2 border-emerald-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl shrink-0 shadow-md">
                💊
              </div>
              <div>
                <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950`}>
                  {heroMed.name || 'Scheduled Medicine'}
                </h3>
                <p className="text-slate-600 font-bold text-base mt-1">
                  Scheduled for {heroMed.time || '09:00 AM'} • {heroMed.dosage || '1 Tablet'}
                </p>
                <p className="text-emerald-700 text-xs font-semibold mt-1">
                  {heroMed.schedule || 'Daily'} — {heroMed.instructions || 'Take with water'}
                </p>
              </div>
            </div>

            {heroMed.taken ? (
              <div className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-100 text-emerald-900 font-extrabold text-xl flex items-center justify-center gap-2 border border-emerald-300">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
                <span>TAKEN ALREADY ✓</span>
              </div>
            ) : (
              <button
                onClick={() => handleTakeMedicine(heroMed.id)}
                className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-emerald-400"
              >
                <CheckCircle className="w-7 h-7" />
                <span>[ I TOOK IT ]</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/90 text-slate-900 rounded-2xl p-6 text-center font-bold text-lg">
            🎉 All scheduled medications for today are taken! Relax and enjoy your day.
          </div>
        )}
      </section>

      {/* 5 & 6. QUICK ASSISTANCE BUTTONS: VOICE & FACIAL SCANNER */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="p-6 rounded-3xl bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-5 text-left group"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform shrink-0">
            🎤
          </div>
          <div>
            <h3 className={`font-black ${getTextSizeClass('text-xl')} text-amber-950`}>
              TALK TO MEMORY BRIDGE
            </h3>
            <p className="text-xs font-bold text-amber-800 mt-1">
              Ask questions aloud: "Who is Roohi?", "When is my medicine?"
            </p>
          </div>
        </button>

        <button
          onClick={() => setIsFaceOpen(true)}
          className="p-6 rounded-3xl bg-blue-100 hover:bg-blue-200 text-blue-950 border-2 border-blue-300 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-5 text-left group"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform shrink-0">
            📷
          </div>
          <div>
            <h3 className={`font-black ${getTextSizeClass('text-xl')} text-blue-950`}>
              WHO AM I LOOKING AT?
            </h3>
            <p className="text-xs font-bold text-blue-800 mt-1">
              Scan face with camera to recognize family & visitors instantly
            </p>
          </div>
        </button>
      </section>

      {/* 7 & 8. MEMORIES & MIND & MEMORY NAVIGATION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/patient/memories"
          className="p-6 rounded-3xl bg-rose-50 hover:bg-rose-100 text-rose-950 border-2 border-rose-200 shadow-md hover:scale-[1.02] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-3xl shadow">
              ❤️
            </div>
            <div>
              <h3 className={`font-black ${getTextSizeClass('text-xl')} text-rose-950`}>
                YOUR SPECIAL MEMORIES
              </h3>
              <p className="text-xs font-bold text-rose-700 mt-0.5">
                Listen to cherished family stories & vacation photos
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-rose-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/patient/games"
          className="p-6 rounded-3xl bg-purple-50 hover:bg-purple-100 text-purple-950 border-2 border-purple-200 shadow-md hover:scale-[1.02] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-3xl shadow">
              🎮
            </div>
            <div>
              <h3 className={`font-black ${getTextSizeClass('text-xl')} text-purple-950`}>
                MIND & MEMORY GAMES
              </h3>
              <p className="text-xs font-bold text-purple-700 mt-0.5">
                Fun games: Who is This?, Family Memory & Number Recall
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* 9. PEOPLE MET TODAY */}
      <section className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
        highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-amber-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            <h2 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950`}>
              PEOPLE MET TODAY
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Encounter Log</span>
        </div>

        {safePeopleMet.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500 italic text-center py-4">No face encounters logged yet today.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {safePeopleMet.map((log) => (
              <div
                key={log?.id || Math.random()}
                className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  log?.status === 'known' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <img
                  src={log?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={log?.detectedName || 'Person'}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-sm"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    {log?.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">{log?.detectedName || 'Visitor'}</h3>
                  <p className="text-xs text-emerald-700 font-bold">{log?.relationship || 'Family'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 10. CAREGIVER MESSAGE SECTION */}
      {safeMessages.length > 0 && safeMessages[0] && (
        <section className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shrink-0 shadow">
            ❤️
          </div>
          <div className="flex-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
              Note from Caregiver {safeMessages[0].caregiverName || 'Meera Sharma'}
            </span>
            <p className={`font-extrabold ${getTextSizeClass('text-xl')} text-rose-900 mt-1`}>
              "{safeMessages[0].message}"
            </p>
            <button
              onClick={() => speak(safeMessages[0].message)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Message Aloud</span>
            </button>
          </div>
        </section>
      )}

      {/* 11. TODAY TIMELINE / ROUTINE */}
      <section className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
        highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-amber-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-emerald-600" />
            <h2 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950`}>
              TODAY'S ROUTINE
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Scheduled Activities</span>
        </div>

        <div className="space-y-4">
          {safeRoutines.map((item, idx) => (
            <div
              key={item?.id || idx}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                item?.completed
                  ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  {item?.icon || '📌'}
                </span>
                <div>
                  <h3 className={`font-bold ${getTextSizeClass('text-xl')}`}>
                    {item?.title || 'Routine Task'}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {item?.time || 'Scheduled'}
                  </p>
                </div>
              </div>

              {item?.completed ? (
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                  Completed ✓
                </span>
              ) : (
                <button
                  onClick={async () => {
                    if (item?.id) await api.toggleRoutine(item.id);
                    loadDashboardData();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow transition-colors"
                >
                  Mark Done
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. QUICK CONTACTS & EMERGENCY */}
      <section className="p-6 rounded-3xl bg-emerald-950 text-white border border-emerald-800 shadow-xl">
        <h2 className={`font-black ${getTextSizeClass('text-xl')} text-emerald-300 mb-4`}>
          QUICK CONTACTS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <a
            href="tel:8019552347"
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-center shadow-md hover:scale-105 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-3xl">❤️</span>
            <span className="text-sm">Call Roohi</span>
          </a>

          <a
            href="tel:8019552347"
            className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-center shadow-md hover:scale-105 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-3xl">👨</span>
            <span className="text-sm">Call Vansh</span>
          </a>

          <a
            href="tel:8019552347"
            className="p-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-center shadow-md hover:scale-105 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-3xl">👵</span>
            <span className="text-sm">Call Kalpana</span>
          </a>

          <a
            href="tel:8019552347"
            className="p-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-center shadow-md hover:scale-105 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span className="text-3xl">👩</span>
            <span className="text-sm">Call Caregiver</span>
          </a>

          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-center shadow-md hover:scale-105 transition-all flex flex-col items-center justify-center gap-1 border-2 border-red-400"
          >
            <span className="text-3xl">🚨</span>
            <span className="text-sm">EMERGENCY</span>
          </button>
        </div>
      </section>

      {/* MODALS */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
      <FaceDetectorModal isOpen={isFaceOpen} onClose={() => setIsFaceOpen(false)} onPersonDetected={() => loadDashboardData()} />
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </div>
  );
};
