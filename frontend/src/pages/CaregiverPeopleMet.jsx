import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { dbService } from '../services/dbService';
import { subscribeToStorage } from '../services/storageService';
import { Users, UserPlus, CheckCircle, Clock, X, Sparkles } from 'lucide-react';

export const CaregiverPeopleMet = () => {
  const [peopleMet, setPeopleMet] = useState([]);
  const [selectedUnknownLog, setSelectedUnknownLog] = useState(null);

  // Form states for naming unknown person
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadLogs();

    const unsubscribe = subscribeToStorage(() => {
      loadLogs();
    });

    return () => unsubscribe();
  }, []);

  const loadLogs = async () => {
    const dbLogs = await dbService.getEncounterLogs();
    const apiLogs = await api.getPeopleMet();
    setPeopleMet(dbLogs.length > 0 ? dbLogs : apiLogs);
  };

  const handleIdentifySubmit = async (e) => {
    e.preventDefault();
    if (!name || !relationship || !selectedUnknownLog) return;

    // Convert unknown encounter to registered face profile in IndexedDB!
    await dbService.convertUnknownToRegistered(selectedUnknownLog.id, name, relationship, notes);
    await api.identifyPerson(selectedUnknownLog.id, name, relationship, notes);

    setSelectedUnknownLog(null);
    setName('');
    setRelationship('');
    setNotes('');
    loadLogs();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn pb-24 text-white">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Daily Face Detection Logs
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            People Met Today
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Review visitors recognized by camera for Sanjay Singhania and convert unknown visitors to registered identity.
          </p>
        </div>
      </div>

      {/* Logs Grid */}
      {peopleMet.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-bold bg-slate-900 rounded-3xl border border-slate-800">
          No encounter logs registered today yet. Use camera scanner on patient view.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {peopleMet.map((log) => (
            <div
              key={log.id}
              className={`p-6 rounded-3xl border shadow-lg flex flex-col justify-between ${
                log.status === 'known'
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-amber-950/60 border-amber-600 text-amber-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    log.status === 'known' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                  }`}>
                    {log.status === 'known' ? 'Recognized Familiar Person' : 'Unknown Visitor'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={log.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={log.detectedName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow"
                  />
                  <div>
                    <h3 className="text-xl font-black text-white">{log.detectedName}</h3>
                    <p className="text-sm font-bold text-emerald-400">{log.relationship}</p>
                  </div>
                </div>
              </div>

              {log.status === 'unknown' ? (
                <button
                  onClick={() => {
                    setSelectedUnknownLog(log);
                    setName('');
                    setRelationship('');
                    setNotes('');
                  }}
                  className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>[ NAME THIS PERSON ]</span>
                </button>
              ) : (
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4" /> Registered in familiar face database
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* NAME THIS PERSON MODAL */}
      {selectedUnknownLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Name Unknown Visitor
              </h3>
              <button onClick={() => setSelectedUnknownLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIdentifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Vasudev or Aunt Sunita"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Relationship to Sanjay Singhania *
                </label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Family Doctor, Neighbor, Sister"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Notes / Routine Info
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Visits on Tuesday mornings for routine checkup."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow transition-colors"
              >
                Save Identity & Register Face
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
