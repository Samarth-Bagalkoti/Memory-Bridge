import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToStorage } from '../services/storageService';
import { useAccessibility } from '../context/AccessibilityContext';
import { Heart, Volume2, Plus, MapPin, Calendar, Tag, Trash2, Edit3, X, Check } from 'lucide-react';

export const MemoriesPage = () => {
  const { speak, getTextSizeClass, highContrast } = useAccessibility();
  const [memories, setMemories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state for Add/Edit Memory
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Family');
  const [relationship, setRelationship] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadMemories();

    const unsubscribe = subscribeToStorage(() => {
      loadMemories();
    });

    return () => unsubscribe();
  }, []);

  const loadMemories = async () => {
    const data = await api.getMemories();
    setMemories(data);
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editingMemoryId) {
      // Edit Memory
      await api.editMemory(editingMemoryId, {
        title,
        description,
        category,
        relationship: relationship || 'Family',
        location: location || 'Home',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
      });
      speak(`Memory story ${title} updated.`);
    } else {
      // Add Memory
      await api.addMemory({
        title,
        description,
        category,
        relationship: relationship || 'Family',
        location: location || 'Home',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
      });
      speak(`New memory titled ${title} saved permanently.`);
    }

    resetForm();
    loadMemories();
  };

  const startEditMemory = (mem) => {
    setEditingMemoryId(mem.id);
    setTitle(mem.title);
    setDescription(mem.description);
    setCategory(mem.category || 'Family');
    setRelationship(mem.relationship || '');
    setLocation(mem.location || '');
    setImageUrl(mem.imageUrl || '');
    setShowAddForm(true);
  };

  const handleDeleteMemory = async (id) => {
    await api.deleteMemory(id);
    setDeleteConfirmId(null);
    loadMemories();
    speak('Memory deleted.');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Family');
    setRelationship('');
    setLocation('');
    setImageUrl('');
    setEditingMemoryId(null);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-1">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <span>SANJAY SINGHANIA'S MEMORY BANK</span>
          </div>
          <h1 className={`font-black ${getTextSizeClass('text-4xl')} text-emerald-950`}>
            Your Cherished Memories ❤️
          </h1>
          <p className="text-slate-600 font-medium text-base mt-1">
            Stories, places, events, and family moments preserved forever.
          </p>
        </div>

        <button
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>{showAddForm ? 'Close Form' : 'Add New Memory'}</span>
        </button>
      </div>

      {/* Add / Edit Memory Form */}
      {showAddForm && (
        <form onSubmit={handleAddMemory} className="p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-xl text-emerald-950">
              {editingMemoryId ? 'Edit Memory Story' : 'Add a New Memory Story'}
            </h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Memory Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Family Villa in Shimla or Roohi's Graduation"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Family">Family</option>
                <option value="Childhood">Childhood</option>
                <option value="Important Events">Important Events</option>
                <option value="Places">Places</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Personal Stories">Personal Stories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Memory Story / Notes *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this cherished memory in detail..."
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Relationship / Person</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Daughter Roohi, Wife Kalpana"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Shimla or Old Town"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Photo URL (Optional)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-base hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-black text-base hover:bg-emerald-700 shadow"
            >
              {editingMemoryId ? 'Update Memory' : 'Save Memory Permanently'}
            </button>
          </div>
        </form>
      )}

      {/* Memory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className={`rounded-3xl border overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between ${
              highContrast ? 'bg-zinc-900 border-yellow-400 text-yellow-300' : 'bg-white border-amber-200/80 text-slate-900'
            }`}
          >
            <div>
              {/* Photo */}
              {mem.imageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 bg-slate-900/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                      {mem.category || 'Family'}
                    </span>
                    <span className="px-3 py-1 bg-emerald-700/80 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                      {mem.relationship || 'Family'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full bg-emerald-100 flex items-center justify-center text-4xl">
                  📸
                </div>
              )}

              {/* Memory Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950`}>
                    {mem.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditMemory(mem)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Edit Memory"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(mem.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className={`font-medium ${getTextSizeClass('text-base')} text-slate-700 leading-relaxed mb-4`}>
                  "{mem.description}"
                </p>

                <div className="space-y-1.5 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-3">
                  {mem.location && (
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{mem.location}</span>
                    </div>
                  )}
                  {mem.date && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mem.date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Read Aloud Footer Button */}
            <div className="p-4 bg-amber-50/60 border-t border-amber-100">
              <button
                onClick={() => speak(`${mem.title}. ${mem.description}. Location: ${mem.location || 'Home'}`)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow transition-all flex items-center justify-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                <span>LISTEN TO STORY 🔊</span>
              </button>
            </div>

            {/* DELETE CONFIRMATION OVERLAY */}
            {deleteConfirmId === mem.id && (
              <div className="p-4 bg-rose-50 border-t-2 border-rose-300 text-rose-950 animate-fadeIn">
                <p className="text-xs font-extrabold text-rose-900 mb-3 text-center">
                  Are you sure you want to delete this memory permanently?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow"
                  >
                    Yes, Delete Memory
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
