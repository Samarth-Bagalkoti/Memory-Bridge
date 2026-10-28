import React, { useState, useEffect, useRef } from 'react';
import { faceService } from '../services/faceService';
import { dbService } from '../services/dbService';
import { api } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Camera, X, CheckCircle, ShieldCheck, AlertCircle, RefreshCw, UserPlus, Lock } from 'lucide-react';

export const FaceRegistrationModal = ({ isOpen, onClose, onPersonRegistered }) => {
  const { speak, getTextSizeClass, highContrast } = useAccessibility();
  const videoRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [capturedData, setCapturedData] = useState(null); // { snapshot, descriptor }

  // Form fields
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const initCamera = async () => {
    const s = await faceService.startWebcam(videoRef);
    if (!s) {
      setCameraError(true);
    } else {
      setStream(s);
    }
  };

  const handleCaptureFace = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const snapshot = faceService.captureCanvasSnapshot(videoRef.current);
      const descriptor = faceService.extractFaceDescriptor(videoRef.current);

      setIsCapturing(false);

      if (!snapshot) {
        alert('Could not capture frame. Please ensure camera permission is allowed.');
        return;
      }

      setCapturedData({ snapshot, descriptor });
      speak('Face image captured clearly. Please enter your name and relationship.');
    }, 800);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name || !relationship || !capturedData) return;

    // 1. Save permanently in IndexedDB
    const registeredPerson = await dbService.saveRegisteredFace({
      name,
      relationship,
      descriptor: capturedData.descriptor,
      photoUrl: capturedData.snapshot,
      notes: notes || 'Registered using Remember Me Face Scanner.'
    });

    // 2. Also save to familiar directory storage
    await api.addPerson({
      name,
      relationship,
      notes,
      photoUrl: capturedData.snapshot
    });

    setSavedSuccess(true);
    speak(`Saved! ${name} is now registered in Memory Bridge. You will be recognized automatically in future scans.`);

    setTimeout(() => {
      if (onPersonRegistered) onPersonRegistered(registeredPerson);
      handleClose();
    }, 1800);
  };

  const handleClose = () => {
    if (stream) faceService.stopWebcam(stream);
    setStream(null);
    setCapturedData(null);
    setName('');
    setRelationship('');
    setNotes('');
    setSavedSuccess(false);
    onClose();
  };

  useEffect(() => {
    let currentStream = null;
    if (isOpen) {
      setCapturedData(null);
      setCameraError(false);
      setSavedSuccess(false);
      faceService.startWebcam(videoRef).then(s => {
        if (!s) {
          setCameraError(true);
        } else {
          currentStream = s;
          setStream(s);
        }
      });
    } else {
      if (stream) faceService.stopWebcam(stream);
      setStream(null);
    }

    return () => {
      if (currentStream) faceService.stopWebcam(currentStream);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className={`w-full max-w-xl rounded-3xl p-6 shadow-2xl border ${
        highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-emerald-100 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0">
              👤
            </div>
            <div>
              <h2 className={`font-bold ${getTextSizeClass('text-xl')} text-emerald-950`}>
                REMEMBER ME — FACE REGISTRATION
              </h2>
              <p className="text-xs text-slate-500 font-medium">Register your face once for automatic recognition in future sessions</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Privacy Guaranteed: Your face embedding descriptor is saved locally in browser IndexedDB only. No cloud upload.</span>
        </div>

        {/* Success Confirmation State */}
        {savedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-black text-2xl text-emerald-950">Registration Complete! 🎉</h3>
            <p className="text-sm font-semibold text-emerald-800">
              {name} ({relationship}) has been saved to Memory Bridge. You will now be recognized automatically!
            </p>
          </div>
        ) : !capturedData ? (
          /* Step 1: Camera Feed & Capture */
          <div className="space-y-4">
            {cameraError ? (
              <div className="w-full aspect-video bg-amber-50 rounded-2xl border-2 border-amber-300 p-6 flex flex-col items-center justify-center text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-amber-600" />
                <h3 className="font-extrabold text-base text-amber-900">
                  Could not access camera for registration.
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  Please allow camera permission in your browser or try another browser.
                </p>
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Facial Target Oval */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-64 border-4 border-emerald-400 border-dashed rounded-full animate-pulse" />
                </div>

                {isCapturing && (
                  <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-10 h-10 animate-spin text-amber-400 mb-2" />
                    <span className="font-bold text-base">Extracting Face Descriptor Vector...</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleCaptureFace}
              disabled={isCapturing || cameraError}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Camera className="w-6 h-6" />
              <span>[ 📷 CAPTURE MY FACE PHOTO ]</span>
            </button>
          </div>
        ) : (
          /* Step 2: Form to enter Name & Relationship */
          <form onSubmit={handleSaveProfile} className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <img
                src={capturedData.snapshot}
                alt="Captured Face"
                className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Face Descriptor Generated ✓
                </span>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  Vector embedding extracted (128 features). Now add your details for Sanjay:
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Roohi Singhania or Aunt Sunita"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Relationship to Sanjay Singhania *
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Daughter, Son, Wife, Caregiver, Neighbor"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notes / Reminders for Sanjay (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Calls every evening at 6 PM with tea."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCapturedData(null)}
                className="flex-1 py-3.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm"
              >
                Retake Photo
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow"
              >
                Save To Remember Me Database
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
