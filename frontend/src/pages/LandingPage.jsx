import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Heart, ShieldCheck, Volume2, Sparkles, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';

export const LandingPage = () => {
  const { loginDemo } = useAuth();
  const { getTextSizeClass } = useAccessibility();
  const navigate = useNavigate();

  const handleQuickDemo = async (role) => {
    await loginDemo(role);
    navigate(role === 'caregiver' ? '/caregiver' : '/patient');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-emerald-50/30 to-amber-50/50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center justify-center text-center">
        
        {/* Hackathon Prototype Demo Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Hackathon Prototype Demo</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-emerald-950 tracking-tight leading-none mb-4">
          MEMORY BRIDGE
        </h1>
        <p className="text-xl sm:text-3xl font-extrabold text-emerald-800 tracking-wide mb-6">
          “Bridging memories, people and care.”
        </p>

        {/* Product Purpose Description */}
        <p className={`max-w-3xl font-medium ${getTextSizeClass('text-lg')} text-slate-700 leading-relaxed mb-10`}>
          An intelligent companion that helps people with dementia remember important people, places and routines while keeping caregivers informed and connected.
        </p>

        {/* Large Primary Role Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full max-w-xl mb-12">
          <button
            onClick={() => handleQuickDemo('patient')}
            className="w-full py-5 px-8 rounded-3xl bg-emerald-600 text-white font-extrabold text-xl shadow-xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-emerald-500"
          >
            <UserCheck className="w-7 h-7" />
            <span>[ Patient Login ]</span>
            <ArrowRight className="w-5 h-5 ml-auto" />
          </button>

          <button
            onClick={() => handleQuickDemo('caregiver')}
            className="w-full py-5 px-8 rounded-3xl bg-slate-900 text-white font-extrabold text-xl shadow-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-slate-700"
          >
            <Stethoscope className="w-7 h-7 text-emerald-400" />
            <span>[ Caregiver Login ]</span>
            <ArrowRight className="w-5 h-5 ml-auto text-emerald-400" />
          </button>
        </div>

        {/* Accessibility & Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left mt-6">
          <div className="p-6 rounded-2xl bg-white/80 border border-emerald-100 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
              ❤️
            </div>
            <h3 className="font-bold text-lg text-emerald-950 mb-2">Warm & Reassuring UX</h3>
            <p className="text-sm text-slate-600 font-medium">
              Designed specifically for elderly users with large text, high contrast, clean cards, and speech assistance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-emerald-100 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-4">
              📷
            </div>
            <h3 className="font-bold text-lg text-emerald-950 mb-2">Facial & Voice AI</h3>
            <p className="text-sm text-slate-600 font-medium">
              Instantly recognize visiting family members and ask questions aloud like "Who is Roohi?" or "When is my medicine?".
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-emerald-100 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4">
              🎮
            </div>
            <h3 className="font-bold text-lg text-emerald-950 mb-2">Adaptive Cognitive Games</h3>
            <p className="text-sm text-slate-600 font-medium">
              4 personalized memory games that automatically adjust difficulty based on engagement and response accuracy.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-medium text-slate-500 border-t border-emerald-100">
        <p>MEMORY BRIDGE Prototype Demo • Designed for Elderly Care & Caregiver Assistance</p>
      </footer>
    </div>
  );
};
