import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Volume2, VolumeX, Eye, Type, Globe, Sparkles } from 'lucide-react';

export const AccessibilityBar = () => {
  const {
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    readAloudEnabled,
    setReadAloudEnabled,
    language,
    setLanguage
  } = useAccessibility();

  return (
    <div className={`w-full py-2.5 px-4 sm:px-8 text-sm flex flex-wrap items-center justify-between border-b ${
      highContrast 
        ? 'bg-zinc-900 border-yellow-400 text-yellow-300' 
        : 'bg-emerald-900 text-emerald-50 border-emerald-800'
    }`}>
      {/* Prototype Indicator */}
      <div className="flex items-center gap-2 font-medium">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-700 text-white border border-emerald-500">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Prototype Demo
        </span>
        <span className="hidden md:inline opacity-90">Memory Bridge Assistance Platform</span>
      </div>

      {/* Accessibility Toolbar Controls */}
      <div className="flex items-center flex-wrap gap-4 mt-1 sm:mt-0">
        {/* Font Size Multiplier */}
        <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-lg border border-emerald-700/50">
          <Type className="w-4 h-4 ml-1 text-emerald-300" />
          <span className="text-xs font-semibold mr-1">Text:</span>
          <button
            onClick={() => setTextSize('normal')}
            className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
              textSize === 'normal' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:text-white'
            }`}
            title="Normal text size"
          >
            A
          </button>
          <button
            onClick={() => setTextSize('large')}
            className={`px-2 py-0.5 rounded text-sm font-bold transition-all ${
              textSize === 'large' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:text-white'
            }`}
            title="Larger text size"
          >
            A+
          </button>
          <button
            onClick={() => setTextSize('xlarge')}
            className={`px-2 py-0.5 rounded text-base font-bold transition-all ${
              textSize === 'xlarge' ? 'bg-emerald-500 text-white' : 'text-emerald-200 hover:text-white'
            }`}
            title="Extra Large text size"
          >
            A++
          </button>
        </div>

        {/* Read Aloud Toggle */}
        <button
          onClick={() => setReadAloudEnabled(!readAloudEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-xs border transition-all ${
            readAloudEnabled
              ? 'bg-emerald-600 border-emerald-400 text-white'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}
          title="Toggle Read Aloud Voice Output"
        >
          {readAloudEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>Read Aloud {readAloudEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-xs border transition-all ${
            highContrast
              ? 'bg-yellow-400 text-black border-yellow-200 font-bold'
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-4 h-4" />
          <span>High Contrast</span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-700/50">
          <Globe className="w-3.5 h-3.5 text-emerald-300" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-slate-900 text-white">English</option>
            <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
