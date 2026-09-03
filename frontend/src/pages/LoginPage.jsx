import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Lock, Mail, User, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { loginDemo } = useAuth();
  const { getTextSizeClass } = useAccessibility();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickDemo = async (selectedRole) => {
    await loginDemo(selectedRole);
    navigate(selectedRole === 'caregiver' ? '/caregiver' : '/patient');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleQuickDemo(role);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100">
        
        {/* Logo Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
            🧠
          </div>
          <h2 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950`}>
            MEMORY BRIDGE
          </h2>
          <p className="text-xs font-semibold text-emerald-700">Bridging memories, people and care</p>
        </div>

        {/* 1-Click Quick Demo Login Section */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 text-center mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Hackathon 1-Click Quick Login
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => handleQuickDemo('patient')}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 shadow transition-all flex items-center justify-between"
            >
              <span>👴 Login as Patient (Sanjay Singhania)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickDemo('caregiver')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 shadow transition-all flex items-center justify-between"
            >
              <span>👩 Login as Caregiver (Meera Sharma)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        <div className="relative my-6 text-center">
          <hr className="border-slate-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-bold text-slate-400">
            OR REGULAR LOGIN
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                  role === 'patient' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                👴 Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('caregiver')}
                className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                  role === 'caregiver' ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                👩 Caregiver
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'patient' ? 'sanjay@memorybridge.org' : 'caregiver@memorybridge.org'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-extrabold text-base hover:bg-emerald-800 shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
};
