import React, { useState } from 'react';
import { api } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { AlertOctagon, PhoneCall, CheckCircle, X, ShieldAlert } from 'lucide-react';

export const EmergencyModal = ({ isOpen, onClose }) => {
  const { speak, getTextSizeClass } = useAccessibility();
  const [confirmed, setConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleConfirmEmergency = async () => {
    setIsSending(true);
    await api.triggerEmergency();
    setIsSending(false);
    setConfirmed(true);
    speak('Emergency alert dispatched! Caregiver Meera and your daughter Roohi have been notified with your current location.');
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-rose-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rose-600 text-slate-900">
        {!confirmed ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertOctagon className="w-12 h-12" />
            </div>

            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full uppercase tracking-wider mb-2">
              🚨 EMERGENCY HELP
            </span>

            <h2 className={`font-black ${getTextSizeClass('text-3xl')} text-rose-950 mb-3`}>
              Do you need help right now?
            </h2>

            <p className="text-slate-600 font-medium text-base mb-8 max-w-md mx-auto">
              Clicking below will immediately alert caregiver Meera Sharma and daughter Roohi (8019552347) with your location.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleClose}
                className="flex-1 py-4 rounded-2xl bg-slate-200 text-slate-800 font-extrabold text-lg hover:bg-slate-300 transition-colors"
              >
                [ CANCEL ]
              </button>

              <a
                href="tel:8019552347"
                onClick={handleConfirmEmergency}
                className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-lg hover:bg-rose-700 shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-6 h-6" />
                <span>[ YES, SEND ALERT ]</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12" />
            </div>

            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full uppercase tracking-wider mb-2">
              Prototype Behavior Labeled
            </span>

            <h2 className={`font-black ${getTextSizeClass('text-3xl')} text-emerald-950 mb-4`}>
              🚨 EMERGENCY ALERT SENT
            </h2>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-left max-w-md mx-auto mb-6 space-y-3 font-bold text-emerald-900 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Caregiver Meera Sharma notified ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Emergency contact (Daughter Roohi - 8019552347) notified ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Location shared (Home — Living Room, Bengaluru) ✓</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-4 rounded-2xl bg-emerald-700 text-white font-extrabold text-lg hover:bg-emerald-800 transition-colors"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
