import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

const ACCESSIBILITY_STORAGE_KEY = 'mb_accessibility_settings';

export const AccessibilityProvider = ({ children }) => {
  // Load initial settings from localStorage or defaults
  const getInitialSettings = () => {
    try {
      const saved = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse accessibility settings from storage');
    }
    return {
      textSize: 'normal', // 'normal', 'large', 'xlarge'
      highContrast: false,
      readAloudEnabled: true,
      soundEnabled: true,
      language: 'en' // 'en' or 'hi'
    };
  };

  const initial = getInitialSettings();

  const [textSize, setTextSize] = useState(initial.textSize);
  const [highContrast, setHighContrast] = useState(initial.highContrast);
  const [readAloudEnabled, setReadAloudEnabled] = useState(initial.readAloudEnabled);
  const [soundEnabled, setSoundEnabled] = useState(initial.soundEnabled);
  const [language, setLanguage] = useState(initial.language);

  // Save to localStorage on change
  useEffect(() => {
    try {
      const settings = {
        textSize,
        highContrast,
        readAloudEnabled,
        soundEnabled,
        language
      };
      localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save accessibility settings:', e);
    }
  }, [textSize, highContrast, readAloudEnabled, soundEnabled, language]);

  // Text-To-Speech function using browser Web Speech API
  const speak = (text) => {
    if (!readAloudEnabled || typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel(); // stop previous speaking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Calmer speed for elderly users like Sanjay
      utterance.pitch = 1.0;
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-US';
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis playback suppressed:', err);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {}
    }
  };

  // Font size multiplier class helper
  const getTextSizeClass = (baseClass = 'text-base') => {
    if (textSize === 'large') {
      if (baseClass.includes('text-sm')) return 'text-base';
      if (baseClass.includes('text-base')) return 'text-lg';
      if (baseClass.includes('text-lg')) return 'text-xl';
      if (baseClass.includes('text-xl')) return 'text-2xl';
      if (baseClass.includes('text-2xl')) return 'text-3xl';
      if (baseClass.includes('text-3xl')) return 'text-4xl';
      return 'text-xl';
    }
    if (textSize === 'xlarge') {
      if (baseClass.includes('text-sm')) return 'text-lg';
      if (baseClass.includes('text-base')) return 'text-xl';
      if (baseClass.includes('text-lg')) return 'text-2xl';
      if (baseClass.includes('text-xl')) return 'text-3xl';
      if (baseClass.includes('text-2xl')) return 'text-4xl';
      if (baseClass.includes('text-3xl')) return 'text-5xl';
      return 'text-2xl';
    }
    return baseClass;
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        readAloudEnabled,
        setReadAloudEnabled,
        soundEnabled,
        setSoundEnabled,
        language,
        setLanguage,
        speak,
        stopSpeaking,
        getTextSizeClass
      }}
    >
      <div className={`${highContrast ? 'bg-black text-yellow-300 high-contrast-mode' : ''} transition-colors duration-200 min-h-screen`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
