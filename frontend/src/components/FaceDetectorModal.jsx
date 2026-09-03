import React, { useState, useEffect, useRef } from 'react';
import { faceService } from '../services/faceService';
import { api } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Camera, X, CheckCircle, AlertCircle, RefreshCw, Sparkles, UserPlus } from 'lucide-react';

export const FaceDetectorModal = ({ isOpen, onClose, onPersonDetected }) => {
  const { speak, getTextSizeClass, highContrast } = useAccessibility();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [cameraError, setCameraError] = useState(false);

  const initCamera = async () => {
    const s = await faceService.startWebcam(videoRef);
    if (!s) {
      setCameraError(true);
    } else {
      setStream(s);
    }
  };

  const handleScanFace = async () => {
    setIsScanning(true);
    setMatchResult(null);

    // Fetch familiar registered people list from localStorage
    const people = await api.getPeople();
    
    // Process face match with video element
    setTimeout(async () => {
      const match = await faceService.detectAndMatchFace(people, videoRef.current);
      setIsScanning(false);
      setMatchResult(match);

      if (match.matched) {
        speak(`${match.person.name}. ${match.person.relationship}. ${match.person.notes || ''}`);
        // Log into People Met Today
        await api.logPersonMet({
          detectedName: match.person.name,
          relationship: match.person.relationship,
          status: 'known',
          photoUrl: match.snapshot || match.person.photoUrl,
          timestamp: new Date().toISOString()
        });
      } else {
        speak('Unknown Person detected. Caregiver can name this person in the dashboard.');
        // Log unknown person into People Met Today
        await api.logPersonMet({
          detectedName: 'Unknown Person',
          relationship: 'Unknown Visitor',
          status: 'unknown',
          photoUrl: match.snapshot || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          timestamp: new Date().toISOString()
        });
      }

      if (onPersonDetected) onPersonDetected(match);
    }, 1200);
  };

  useEffect(() => {
    if (isOpen) {
      setMatchResult(null);
      setCameraError(false);
      initCamera();
    } else {
      if (stream) faceService.stopWebcam(stream);
      setStream(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-xl rounded-3xl p-6 shadow-2xl border ${
        highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-emerald-100 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
              📷
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className={`font-bold ${getTextSizeClass('text-xl')} text-emerald-950`}>
                  PROTOTYPE FACE RECOGNITION
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Local Browser Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Recognize Family & Visitors for Sanjay Singhania</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed or Permission Fallback Container */}
        {cameraError ? (
          <div className="w-full aspect-video bg-amber-50 rounded-2xl border-2 border-amber-300 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-600" />
            <h3 className="font-extrabold text-base text-amber-900">
              Sorry, I couldn't access the camera.
            </h3>
            <p className="text-xs text-amber-800 font-medium max-w-sm">
              Please check your browser camera permission or use prototype simulation mode below.
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

            {/* Facial Alignment Overlay Box */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className={`w-48 h-64 border-4 rounded-3xl transition-colors ${
                isScanning ? 'border-amber-400 animate-pulse' : matchResult ? (matchResult.matched ? 'border-emerald-500' : 'border-rose-500') : 'border-white/50 border-dashed'
              }`} />
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white">
                <RefreshCw className="w-10 h-10 animate-spin text-amber-400 mb-2" />
                <span className="font-bold text-lg">Matching Face...</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleScanFace}
            disabled={isScanning}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-6 h-6" />
            <span>CAPTURE & SCAN FACE</span>
          </button>
        </div>

        {/* Match Result Display */}
        {matchResult && (
          <div className={`mt-5 p-5 rounded-2xl border animate-fadeIn ${
            matchResult.matched ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            {matchResult.matched ? (
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Familiar Person Recognized
                  </span>
                  <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-900 mt-1`}>
                    {matchResult.person.name}
                  </h3>
                  <p className="font-bold text-emerald-800 text-base">
                    {matchResult.person.relationship}
                  </p>
                  {matchResult.person.notes && (
                    <p className="mt-2 text-sm text-emerald-900 font-medium italic bg-white/70 p-2.5 rounded-xl border border-emerald-200">
                      "{matchResult.person.notes}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md">
                    Unknown Person
                  </span>
                  <h3 className={`font-black ${getTextSizeClass('text-xl')} text-rose-900 mt-1`}>
                    Unknown Person
                  </h3>
                  <p className="text-sm text-rose-800 font-medium mt-1">
                    Logged in "People Met Today" at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  </p>
                  <p className="text-xs text-rose-700 font-semibold mt-2">
                    Caregiver can click "Name This Person" in Caregiver Dashboard.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
