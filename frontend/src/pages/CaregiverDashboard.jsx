import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToStorage } from '../services/storageService';
import { NotificationBell } from '../components/NotificationBell';
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  RefreshCw,
  CheckCircle,
  Pill,
  Calendar,
  Users,
  Brain,
  MessageSquare,
  Sparkles,
  Send,
  Activity,
  RotateCcw
} from 'lucide-react';

export const CaregiverDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [peopleMet, setPeopleMet] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [messageSentStatus, setMessageSentStatus] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadCaregiverData();

    // Subscribe to storage updates
    const unsubscribe = subscribeToStorage(() => {
      loadCaregiverData();
    });

    return () => unsubscribe();
  }, []);

  const loadCaregiverData = async () => {
    try {
      const prof = await api.getPatientProfile();
      const meds = await api.getMedications();
      const rts = await api.getRoutines();
      const pm = await api.getPeopleMet();
      const perf = await api.getGamePerformance();
      const alts = await api.getAlerts();

      setProfile(prof || { fullName: 'Sanjay Singhania', age: 72, status: 'safe', emergencyContact: { name: 'Roohi (Daughter)', phone: '8019552347' } });
      setMedications(meds || []);
      setRoutines(rts || []);
      setPeopleMet(pm || []);
      setPerformance(perf || null);
      setAlerts(alts || []);
    } catch (e) {
      console.error('Error loading caregiver dashboard:', e);
    }
  };

  const handleSimulateSafetyAlert = async () => {
    await api.simulateSafetyAlert();
    loadCaregiverData();
  };

  const handleRefreshLocation = async () => {
    // Try browser geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await api.updatePatientLocation({
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude },
            isSimulated: false
          });
          loadCaregiverData();
        },
        async (err) => {
          console.warn('Geolocation permission denied or unavailable, using prototype location:', err.message);
          await api.updatePatientStatus('safe');
          loadCaregiverData();
        }
      );
    } else {
      await api.updatePatientStatus('safe');
      loadCaregiverData();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    await api.sendCaregiverMessage(messageText);
    setMessageText('');
    setMessageSentStatus(true);
    setTimeout(() => setMessageSentStatus(false), 3000);
    loadCaregiverData();
  };

  const handleConfirmResetData = async () => {
    await api.resetDemoData();
    setShowResetConfirm(false);
    loadCaregiverData();
  };

  if (!profile) return <div className="p-8 text-center text-slate-400 font-bold bg-slate-900 min-h-screen">Loading Caregiver Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn pb-24 text-white">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" /> Caregiver Monitoring Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            PATIENT: {profile.fullName} (Age: {profile.age})
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Caregiver: Meera Sharma • Emergency Contact: {profile.emergencyContact?.name || 'Roohi (8019552347)'}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <NotificationBell alerts={alerts} />

          <button
            onClick={handleSimulateSafetyAlert}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 border border-rose-500"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>[ SIMULATE SAFETY ALERT ]</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            title="Reset storage to initial demo dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>[ Reset Demo Data ]</span>
          </button>
        </div>
      </div>

      {/* TOP STATUS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Patient Safety Status */}
        <div className={`p-6 rounded-3xl border shadow-lg ${
          profile.status === 'safe'
            ? 'bg-slate-900 border-emerald-500/50 text-white'
            : 'bg-rose-950 border-rose-600 text-rose-100'
        }`}>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            CURRENT PATIENT STATUS
          </span>
          <div className="flex items-center gap-3 mt-3">
            <div className={`w-4 h-4 rounded-full ${profile.status === 'safe' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'}`} />
            <h3 className="text-2xl font-black">
              {profile.status === 'safe' ? '🟢 Safe' : '🚨 Wandering Safety Alert'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {profile.status === 'safe' ? 'Sanjay is safe in home living boundary.' : 'Possible wandering detected near main boundary.'}
          </p>
        </div>

        {/* Real-time Location Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                PATIENT LOCATION
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                {profile.currentLocation?.isSimulated ? '📍 Prototype Location' : '📍 GPS Live'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <h3 className="text-lg font-bold text-white">{profile.currentLocation?.address || 'Home — Living Room, Bengaluru'}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Last updated: {profile.currentLocation?.lastUpdated ? new Date(profile.currentLocation.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </p>
          </div>

          <button
            onClick={handleRefreshLocation}
            className="mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>[ Refresh Location ]</span>
          </button>
        </div>

        {/* Today's Medication & Routine Summary */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-lg">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            TODAY MEDICATIONS & ROUTINE
          </span>
          <div className="mt-3 space-y-2 text-sm font-semibold">
            {medications.slice(0, 3).map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80">
                <span className="flex items-center gap-2 text-xs truncate max-w-[170px]">
                  <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {m.name} ({m.time})
                </span>
                {m.taken ? (
                  <span className="text-emerald-400 font-bold text-xs">Taken ✓</span>
                ) : (
                  <span className="text-amber-400 font-bold text-xs">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PEOPLE MET TODAY SECTION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-black text-white">People Met Today</h2>
          </div>
          <span className="text-xs text-slate-400">Daily Encounter Log</span>
        </div>

        {peopleMet.length === 0 ? (
          <p className="text-sm font-semibold text-slate-400 italic">No encounter logs yet today.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {peopleMet.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  log.status === 'known' ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-950/40 border-amber-700 text-amber-200'
                }`}
              >
                <img
                  src={log.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={log.detectedName}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-600"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <h3 className="font-extrabold text-base text-white">{log.detectedName}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{log.relationship}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COGNITIVE PERFORMANCE ANALYTICS */}
      {performance && (
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-2xl font-black text-white">Cognitive Performance & Game History</h2>
                <p className="text-xs text-slate-400">Personalized engagement and memory stimulation tracking for Sanjay</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-950 text-purple-300 rounded-full text-xs font-bold border border-purple-800">
              Current Adaptive Level {performance.currentDifficultyLevel || 1}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            {performance.categoryPerformance?.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                <span className="text-xs font-bold text-slate-400">{cat.name}</span>
                <p className="text-3xl font-black text-emerald-400 mt-1">{cat.accuracy}%</p>
                <span className="text-[10px] text-slate-500">{cat.sessionsCount} sessions</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Engagement Trend: <strong className="text-emerald-400">{performance.trend}</strong></span>
            </div>
            <span className="text-xs text-slate-400">Total Games Completed: {performance.totalGamesCompleted || 0}</span>
          </div>
        </section>
      )}

      {/* SEND MESSAGE TO PATIENT DASHBOARD */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-black text-white">Send Note to Sanjay's Dashboard</h2>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="e.g. Good morning Sanjay! I'll visit you at 5:00 PM today with fresh tea and snacks."
            rows={3}
            className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Note to Sanjay</span>
            </button>

            {messageSentStatus && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fadeIn">
                <CheckCircle className="w-4 h-4" /> Sent to Patient Dashboard!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* CONFIRMATION MODAL FOR RESET DEMO DATA */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <h3 className="font-extrabold text-xl text-amber-400 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" /> Reset Demo Data?
            </h3>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              This will restore all memories, medications, people, and game sessions for Sanjay Singhania to the initial demo state.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetData}
                className="flex-1 py-3 rounded-xl bg-amber-600 text-slate-950 font-black text-sm hover:bg-amber-500 shadow"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
