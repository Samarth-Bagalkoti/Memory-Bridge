import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const NotificationBell = ({ alerts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-amber-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-white animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Caregiver Notifications
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active alerts right now.</p>
            ) : (
              alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs ${
                    alert.type === 'safety' || alert.type === 'emergency'
                      ? 'bg-rose-950/60 border-rose-700 text-rose-200'
                      : 'bg-amber-950/50 border-amber-800 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>{alert.title}</span>
                    <span className="text-[10px] opacity-75">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="opacity-90">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
