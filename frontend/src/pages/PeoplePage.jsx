import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToStorage } from '../services/storageService';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { Users, Volume2, Phone, Heart, Sparkles, UserPlus, Plus } from 'lucide-react';

export const PeoplePage = () => {
  const { speak, getTextSizeClass, highContrast } = useAccessibility();
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const isCaregiver = user?.role === 'caregiver';

  useEffect(() => {
    loadPeople();

    const unsubscribe = subscribeToStorage(() => {
      loadPeople();
    });

    return () => unsubscribe();
  }, []);

  const loadPeople = async () => {
    const data = await api.getPeople();
    setPeople(data);
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!name || !relationship) return;

    await api.addPerson({
      name,
      relationship,
      notes,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    });

    setName('');
    setRelationship('');
    setNotes('');
    setPhotoUrl('');
    setShowAddForm(false);
    loadPeople();
    speak(`New familiar person ${name} registered.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
            <Users className="w-5 h-5 text-blue-500" />
            <span>FAMILIAR PEOPLE DIRECTORY</span>
          </div>
          <h1 className={`font-black ${getTextSizeClass('text-4xl')} text-emerald-950`}>
            People Who Love & Care For Sanjay 👥
          </h1>
          <p className="text-slate-600 font-medium text-base mt-1">
            Family members and caregiver registered in Memory Bridge.
          </p>
        </div>

        {isCaregiver && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Register New Person'}</span>
          </button>
        )}
      </div>

      {/* Add Person Form (Caregiver feature) */}
      {showAddForm && (
        <form onSubmit={handleAddPerson} className="p-6 rounded-3xl bg-white border-2 border-blue-300 shadow-xl space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-xl text-blue-950">Register New Familiar Person</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aunt Sunita or Dr. Vasudev"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Relationship to Patient *</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Sister, Neighbor, Family Doctor"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Notes / Reminders for Sanjay</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Visits on Tuesdays and brings fresh flowers."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Photo URL (Optional)</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-extrabold text-base hover:bg-blue-700 shadow"
          >
            Save Person to Face Registry
          </button>
        </form>
      )}

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {people.map((person) => (
          <div
            key={person.id}
            className={`rounded-3xl border overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between ${
              highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-amber-200/80 text-slate-900'
            }`}
          >
            <div>
              {/* Photo Avatar */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 bg-slate-900/80 text-white rounded-xl backdrop-blur-sm flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-300">{person.relationship}</span>
                  <span className="text-xs">❤️ Family</span>
                </div>
              </div>

              {/* Information */}
              <div className="p-6">
                <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950 mb-1`}>
                  {person.name}
                </h3>
                <p className="font-extrabold text-emerald-700 text-base mb-3">
                  {person.relationship}
                </p>

                {person.notes && (
                  <p className="text-sm font-medium text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    "{person.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Audio Button */}
            <div className="p-4 bg-emerald-50/60 border-t border-emerald-100 space-y-2">
              <button
                onClick={() => speak(`${person.name}. Your ${person.relationship}. ${person.notes || ''}`)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                <span>WHO IS THIS? 🔊</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
