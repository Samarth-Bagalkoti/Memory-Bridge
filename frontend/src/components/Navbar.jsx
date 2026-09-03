import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Home, Heart, Users, Brain, Mic, AlertTriangle, LogOut, Shield, Activity, MapPin, Pill } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTextSizeClass, highContrast } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isPatient = user.role === 'patient';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`border-b transition-colors ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : isPatient ? 'bg-amber-50 border-amber-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <Link to={isPatient ? "/patient" : "/caregiver"} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform">
            🧠
          </div>
          <div>
            <span className={`font-extrabold tracking-tight text-xl ${highContrast ? 'text-yellow-300' : isPatient ? 'text-emerald-900' : 'text-white'}`}>
              MEMORY BRIDGE
            </span>
            <p className="text-xs text-emerald-600 font-medium hidden sm:block">Bridging memories, people and care</p>
          </div>
        </Link>

        {/* Primary Role Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {isPatient ? (
            <>
              <Link
                to="/patient"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  location.pathname === '/patient'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'hover:bg-emerald-100/70 text-slate-800'
                } ${getTextSizeClass('text-base')}`}
              >
                <Home className="w-5 h-5 text-emerald-500" />
                <span>🏠 Home</span>
              </Link>

              <Link
                to="/patient/memories"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  location.pathname === '/patient/memories'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'hover:bg-emerald-100/70 text-slate-800'
                } ${getTextSizeClass('text-base')}`}
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <span>❤️ Memories</span>
              </Link>

              <Link
                to="/patient/people"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  location.pathname === '/patient/people'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'hover:bg-emerald-100/70 text-slate-800'
                } ${getTextSizeClass('text-base')}`}
              >
                <Users className="w-5 h-5 text-blue-500" />
                <span>👥 People</span>
              </Link>

              <Link
                to="/patient/games"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  location.pathname === '/patient/games'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'hover:bg-emerald-100/70 text-slate-800'
                } ${getTextSizeClass('text-base')}`}
              >
                <Brain className="w-5 h-5 text-purple-500" />
                <span>🎮 Mind & Memory</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/caregiver"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  location.pathname === '/caregiver' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/caregiver/people-met"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  location.pathname === '/caregiver/people-met' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>People Met Today</span>
              </Link>

              <Link
                to="/caregiver/medications"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                  location.pathname === '/caregiver/medications' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Pill className="w-4 h-4 text-amber-400" />
                <span>Medications</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
            isPatient ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-800 text-slate-200 border-slate-700'
          }`}>
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isPatient ? 'Patient View: Sanjay' : 'Caregiver: Meera'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition-all"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
