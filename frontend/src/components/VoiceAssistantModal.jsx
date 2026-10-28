import React, { useState, useEffect } from 'react';
import { voiceEngine } from '../services/voiceService';
import { api } from '../services/api';
import { useAccessibility } from '../context/AccessibilityContext';
import { Mic, MicOff, Volume2, X, Send, AlertCircle, Play, Square, Sparkles, CheckCircle, Brain } from 'lucide-react';

export const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { speak, stopSpeaking, getTextSizeClass, highContrast } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(null);
  const [manualQuery, setManualQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Ready'); // 'Ready', 'Listening…', 'Thinking…', 'Speaking…', 'Voice unavailable — use text input'
  const [conversationHistory, setConversationHistory] = useState([]);

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

  // Unified Natural Language AI Assistant Processor
  const handleProcessQuery = async (queryText) => {
    if (!queryText || queryText.includes('Listening…')) return;
    
    setVoiceStatus('Thinking…');

    try {
      // 1. Call AI Assistant Endpoint (Backend AI model with ground-truth data tools)
      const res = await api.queryAIAssistant(queryText, conversationHistory);
      
      setResponse(res);

      // 2. Update conversation context history for multi-turn follow-up questions
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: queryText },
        { role: 'assistant', content: res.answer }
      ].slice(-6); // Keep last 3 turns
      setConversationHistory(updatedHistory);

      // 3. Read final answer aloud using browser SpeechSynthesis
      setVoiceStatus('Speaking…');
      speak(res.answer);

      // 4. Return to Listening or Ready state
      setTimeout(() => {
        if (isListening) {
          setVoiceStatus('Listening…');
        } else {
          setVoiceStatus('Ready');
        }
      }, 3000);
    } catch (err) {
      console.warn('Error querying AI Assistant, executing local intent fallback:', err);
      const localRes = voiceEngine.processQuery(queryText);
      setResponse(localRes);
      setVoiceStatus('Speaking…');
      speak(localRes.answer);
    }
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
      setConversationHistory([]);
      setResponse({
        answer: 'Hello Sanjay! I am your AI Memory Bridge companion. Ask me any question aloud or type below.',
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
      case 'Thinking…':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1.5 shadow-sm">
            <Brain className="w-3.5 h-3.5 text-purple-600 animate-spin" />
            <span>Thinking… (Querying AI & Patient Data)</span>
          </span>
        );
      case 'Speaking…':
        return (
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
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

  const sampleNaturalQuestions = [
    "What should I do now?",
    "I forgot my medicine. When do I take it?",
    "Who did I meet this morning?",
    "Tell me about Roohi.",
    "Who is my wife?",
    "Do I have an appointment today?",
    "What memories do I have about my family?",
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
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`font-bold ${getTextSizeClass('text-2xl')} text-emerald-900`}>
                  AI VOICE ASSISTANT
                </h2>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Natural Language AI Companion for Sanjay Singhania</p>
            </div>
          </div>
          <button
            onClick={() => { handleStopListening(); onClose(); }}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Network / Error Notice Banner */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm text-amber-900">{errorMessage}</p>
              <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                You can type any free-form question in the box below!
              </p>
            </div>
          </div>
        )}

        {/* Central Microphone Controls (Extra Large for Elderly Users) */}
        <div className="flex flex-col items-center justify-center my-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            {!isListening ? (
              <button
                onClick={handleStartListening}
                className="px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-emerald-400"
              >
                <Mic className="w-8 h-8" />
                <span>[ 🎤 START LISTENING ]</span>
              </button>
            ) : (
              <button
                onClick={handleStopListening}
                className="px-8 py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xl shadow-xl animate-pulse hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-rose-400"
              >
                <Square className="w-8 h-8" />
                <span>[ ⏹ STOP LISTENING ]</span>
              </button>
            )}
          </div>

          {transcript && (
            <p className="mt-2 text-center italic text-emerald-950 font-bold bg-emerald-50 px-5 py-3 rounded-2xl border-2 border-emerald-200 text-lg max-w-lg shadow-inner">
              "{transcript}"
            </p>
          )}
        </div>

        {/* Assistant Response Box (Large Readable Text) */}
        {response && (
          <div className="my-6 p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 flex items-start gap-4 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-2xl shadow">
              🧠
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  {response.fallbackUsed ? 'AI Companion Response (Offline Engine)' : 'AI Companion Response (Gemini 2.5 + Ground Truth)'}
                </span>
              </div>
              <p className={`font-black ${getTextSizeClass('text-xl')} leading-relaxed text-emerald-950`}>
                "{response.answer}"
              </p>
              <button
                onClick={() => {
                  setVoiceStatus('Speaking…');
                  speak(response.answer);
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow"
              >
                <Volume2 className="w-4 h-4" />
                <span>Read Aloud Again</span>
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
            placeholder="Type your question..."
            className="flex-1 px-4 py-3.5 rounded-xl border-2 border-slate-300 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-base hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Natural Language Sample Questions */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Ask natural questions like:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleNaturalQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetQuery(q)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100 transition-all hover:scale-105 text-left truncate shadow-sm"
                title={q}
              >
                💬 "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
