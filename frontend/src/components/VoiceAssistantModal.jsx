import React, { useState, useEffect } from 'react';
import { voiceEngine } from '../services/voiceService';
import { useAccessibility } from '../context/AccessibilityContext';
import { Mic, MicOff, Volume2, X, Send, AlertCircle, Play, Square, Sparkles, CheckCircle } from 'lucide-react';

export const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { speak, stopSpeaking, getTextSizeClass, highContrast } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Ready'); // 'Ready', 'Listening…', 'Processing…', 'Speaking…', 'Voice unavailable — use text input'

  const handleStopListening = () => {
    voiceEngine.stopListening();
    setIsListening(false);
    setVoiceStatus('Ready');
  };

  const handleStartListening = () => {
    setErrorMessage('');
    setTranscript('Listening… Speak your question clearly.');
    setIsListening(true);
    setVoiceStatus('Listening…');

    voiceEngine.startListening({
      onStart: () => {
        setVoiceStatus('Listening…');
      },
      onTranscript: (interimText) => {
        setTranscript(interimText);
      },
      onFinalQuery: (finalText) => {
        setTranscript(finalText);
        handleProcessQuery(finalText);
      },
      onError: (errMessage) => {
        setIsListening(false);
        setErrorMessage(errMessage);
      },
      onStatusChange: (newStatus) => {
        setVoiceStatus(newStatus);
      }
    });
  };

  // Unified intent processor for Spoken input, Typed input, and Preset buttons
  const handleProcessQuery = (queryText) => {
    if (!queryText || queryText.includes('Listening…')) return;
    
    setVoiceStatus('Processing…');
    const res = voiceEngine.processQuery(queryText);
    setResponse(res);

    setVoiceStatus('Speaking…');
    speak(res.answer);

    // After speaking starts, transition back to listening or ready after delay
    setTimeout(() => {
      if (isListening) {
        setVoiceStatus('Listening…');
      } else {
        setVoiceStatus('Ready');
      }
    }, 2500);
  };

  const handlePresetQuery = (query) => {
    setTranscript(query);
    setErrorMessage('');
    handleProcessQuery(query);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualQuery.trim()) {
      const q = manualQuery.trim();
      setTranscript(q);
      setErrorMessage('');
      handleProcessQuery(q);
      setManualQuery('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setErrorMessage('');
      setVoiceStatus('Ready');
      setResponse({
        answer: 'Hello Sanjay! Click START LISTENING or type your question below to speak with Memory Bridge.',
        intent: 'greeting'
      });
      speak('Hello Sanjay! I am ready to help you. What would you like to know today?');
    } else {
      stopSpeaking();
      handleStopListening();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Status Badge Styling Helper
  const getStatusBadge = () => {
    switch (voiceStatus) {
      case 'Listening…':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>Listening…</span>
          </span>
        );
      case 'Processing…':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-spin" />
            <span>Processing…</span>
          </span>
        );
      case 'Speaking…':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
            <span>Speaking…</span>
          </span>
        );
      case 'Voice unavailable — use text input':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-950 border border-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Voice unavailable — use text input</span>
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready</span>
          </span>
        );
    }
  };

  const supportedQuestions = [
    "Who is Roohi?",
    "Who is Vansh?",
    "Who is Kalpana?",
    "When is my medicine?",
    "What do I have today?",
    "Who is my caregiver?",
    "Who did I meet today?",
    "What is my next task?"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border ${
        highContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-white border-emerald-100 text-slate-900'
      }`}>
        {/* Header with State Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎤
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`font-bold ${getTextSizeClass('text-2xl')} text-emerald-900`}>
                  TALK TO MEMORY BRIDGE
                </h2>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Voice Companion & Offline Speech Assistant for Sanjay</p>
            </div>
          </div>
          <button
            onClick={() => { handleStopListening(); onClose(); }}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Network Error / Permission Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm text-amber-900">
                {errorMessage === 'Voice recognition is temporarily unavailable.' 
                  ? 'Voice recognition is temporarily unavailable.' 
                  : errorMessage}
              </p>
              <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                You can type any question in the input box below or tap one of the preset questions!
              </p>
            </div>
          </div>
        )}

        {/* Central Microphone Controls */}
        <div className="flex flex-col items-center justify-center my-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            {!isListening ? (
              <button
                onClick={handleStartListening}
                className="px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-emerald-400"
              >
                <Mic className="w-8 h-8" />
                <span>[ 🎤 Start Listening ]</span>
              </button>
            ) : (
              <button
                onClick={handleStopListening}
                className="px-8 py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xl shadow-xl animate-pulse hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-rose-400"
              >
                <Square className="w-8 h-8" />
                <span>[ ⏹ Stop Listening ]</span>
              </button>
            )}
          </div>

          {transcript && (
            <p className="mt-2 text-center italic text-emerald-800 font-medium bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 text-base max-w-lg">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Assistant Response Box */}
        {response && (
          <div className="my-6 p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className={`font-bold ${getTextSizeClass('text-lg')} leading-relaxed`}>
                {response.answer}
              </p>
              <button
                onClick={() => {
                  setVoiceStatus('Speaking…');
                  speak(response.answer);
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
              >
                🔊 Read Aloud Again
              </button>
            </div>
          </div>
        )}

        {/* Fallback Text Input */}
        <form onSubmit={handleManualSubmit} className="mt-6 flex items-center gap-2">
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-3.5 rounded-xl border-2 border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* All 8 Supported Preset Questions */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            Or tap any supported question below:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {supportedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetQuery(q)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100 transition-all hover:scale-105 text-left truncate"
                title={q}
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
