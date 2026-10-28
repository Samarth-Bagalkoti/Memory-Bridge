import React, { useState, useEffect, useRef } from 'react';
import { faceService } from '../services/faceService';
import { dbService } from '../services/dbService';
import { api } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Camera, X, CheckCircle, AlertCircle, RefreshCw, UserPlus, ShieldCheck } from 'lucide-react';

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

    setTimeout(async () => {
      // Real scan & Euclidean vector match against IndexedDB
      const res = await faceService.scanAndRecognize(videoRef.current);
      setIsScanning(false);
      setMatchResult(res);

      if (res.matched) {
        speak(`${res.person.name}. ${res.person.relationship}. ${res.person.notes || ''}`);
        
        // Log encounter into IndexedDB & localStorage
        const encounter = {
          detectedName: res.person.name,
          relationship: res.person.relationship,
          status: 'known',
          photoUrl: res.snapshot || res.person.photoUrl,
          descriptor: res.descriptor,
          personId: res.person.id,
          timestamp: new Date().toISOString()
        };

        await dbService.logEncounter(encounter);
        await api.logPersonMet(encounter);
      } else {
        speak('Unknown person detected. Caregiver can name this person in the dashboard.');

        // Log unknown visitor encounter into IndexedDB & localStorage
        const encounter = {
          detectedName: 'Unknown Person',
          relationship: 'Unknown Visitor',
          status: 'unknown',
          photoUrl: res.snapshot || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          descriptor: res.descriptor,
          timestamp: new Date().toISOString()
        };

        await dbService.logEncounter(encounter);
        await api.logPersonMet(encounter);
      }

      if (onPersonDetected) onPersonDetected(res);
    }, 1000);
  };

  useEffect(() => {
    let currentStream = null;
    if (isOpen) {
      setMatchResult(null);
      setCameraError(false);
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
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shrink-0">
              📷
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className={`font-bold ${getTextSizeClass('text-xl')} text-emerald-950`}>
                  FACIAL RECOGNITION SCANNER
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  IndexedDB Local Biometrics
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Recognize registered family members & visitors for Sanjay Singhania</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed Container */}
        {cameraError ? (
          <div className="w-full aspect-video bg-amber-50 rounded-2xl border-2 border-amber-300 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-amber-600" />
            <h3 className="font-extrabold text-base text-amber-900">
              Could not access camera.
            </h3>
            <p className="text-xs text-amber-800 font-medium max-w-sm">
              Please check your browser camera permission to scan visitors.
            </p>
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-inner flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target Box Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className={`w-48 h-64 border-4 rounded-3xl transition-colors ${
                isScanning ? 'border-amber-400 animate-pulse' : matchResult ? (matchResult.matched ? 'border-emerald-500' : 'border-rose-500') : 'border-white/50 border-dashed'
              }`} />
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white">
                <RefreshCw className="w-10 h-10 animate-spin text-amber-400 mb-2" />
                <span className="font-bold text-lg">Matching Face Vectors in IndexedDB...</span>
              </div>
            )}
          </div>
        )}

        {/* Scan Button */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleScanFace}
            disabled={isScanning || cameraError}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-6 h-6" />
            <span>[ 📷 CAPTURE & RECOGNIZE PERSON ]</span>
          </button>
        </div>

        {/* Match Result Display */}
        {matchResult && (
          <div className={`mt-5 p-5 rounded-2xl border animate-fadeIn ${
            matchResult.matched ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            {matchResult.matched ? (
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-md">
                      Familiar Person Matched
                    </span>
                    {matchResult.confidence && (
                      <span className="text-xs font-bold text-emerald-700">
                        ({Math.round(matchResult.confidence * 100)}% match)
                      </span>
                    )}
                  </div>
                  <h3 className={`font-black ${getTextSizeClass('text-2xl')} text-emerald-950 mt-1`}>
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
                <AlertCircle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-md">
                    Unknown Person
                  </span>
                  <h3 className={`font-black ${getTextSizeClass('text-xl')} text-amber-950 mt-1`}>
                    Unknown Person Detected
                  </h3>
                  <p className="text-sm text-amber-900 font-medium mt-1">
                    Logged in "People Met Today" at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                  </p>
                  <p className="text-xs text-amber-800 font-bold mt-2 bg-white/60 p-2 rounded-lg border border-amber-300">
                    Caregiver can select this visitor in Caregiver Dashboard and click "Name This Person" to remember them in future sessions!
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
