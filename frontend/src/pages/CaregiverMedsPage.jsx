import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToStorage } from '../services/storageService';
import { Pill, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const CaregiverMedsPage = () => {
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [schedule, setSchedule] = useState('Daily');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    loadMeds();

    const unsubscribe = subscribeToStorage(() => {
      loadMeds();
    });

    return () => unsubscribe();
  }, []);

  const loadMeds = async () => {
    const data = await api.getMedications();
    setMedications(data);
  };

  const handleAddMed = async (e) => {
    e.preventDefault();
    if (!name || !dosage || !time) return;

    // FIX: call api.addMedication instead of api.addMemory!
    await api.addMedication({
      name,
      dosage,
      time,
      schedule: schedule || 'Daily',
      instructions: instructions || 'Take with water after meals'
    });

    setName('');
    setDosage('');
    setTime('');
    setSchedule('Daily');
    setInstructions('');
    setShowForm(false);
    loadMeds();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn pb-24 text-white">
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4" /> Medication Compliance Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Prescribed Medications for Sanjay Singhania
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            All added medications automatically appear on Sanjay's daily timetable and priority task list.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddMed} className="p-6 rounded-3xl bg-slate-900 border border-slate-700 space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-xl">Add New Prescribed Medication</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Medication Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning Heart & Memory Care"
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Dosage *</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet (10mg)"
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Scheduled Time *</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                required
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Frequency / Schedule</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Daily Morning"
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Special Instructions</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with water after breakfast"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 font-extrabold text-white text-base hover:bg-emerald-700 shadow">
            Save Prescription to Local Storage
          </button>
        </form>
      )}

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medications.map((med) => (
          <div key={med.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg flex items-start justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Scheduled for {med.time}
              </span>
              <h3 className="text-2xl font-black text-white">{med.name}</h3>
              <p className="text-sm font-semibold text-slate-300">Dosage: {med.dosage}</p>
              <p className="text-xs text-slate-400">{med.schedule} • {med.instructions || 'Take with water'}</p>
            </div>

            {med.taken ? (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 font-extrabold text-xs flex items-center gap-1 shrink-0">
                <CheckCircle className="w-4 h-4" /> [ TAKEN ]
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 font-extrabold text-xs shrink-0">
                Pending
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
