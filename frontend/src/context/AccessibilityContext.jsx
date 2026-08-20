import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AccessibilityContext = createContext(null);

const DEFAULT_PREFERENCES = {
  fontSize: 'normal', // 'normal' | 'md' | 'lg' | 'xl'
  lineSpacing: 'normal', // 'normal' | 'relaxed' | 'loose'
  letterSpacing: 'normal', // 'normal' | 'wide' | 'wider'
  highContrast: false,
  grayscale: false,
  readableFont: false,
  reducedMotion: false,
  pauseAnimations: false,
  largeCursor: false,
  simplifiedReading: false
};

const STORAGE_KEY = 'portfolio_a11y_prefs';

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not read a11y preferences from localStorage", e);
    }
    // Default respects prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return { ...DEFAULT_PREFERENCES, reducedMotion: prefersReducedMotion };
  });

  const [liveAnnouncement, setLiveAnnouncement] = useState("");

  const announce = useCallback((message) => {
    setLiveAnnouncement("");
    setTimeout(() => setLiveAnnouncement(message), 50);
  }, []);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn("Could not save a11y preferences to localStorage", e);
    }

    // Apply or remove classes on <html>
    const root = document.documentElement;

    // Font size
    root.classList.remove('a11y-font-md', 'a11y-font-lg', 'a11y-font-xl');
    if (preferences.fontSize === 'md') root.classList.add('a11y-font-md');
    if (preferences.fontSize === 'lg') root.classList.add('a11y-font-lg');
    if (preferences.fontSize === 'xl') root.classList.add('a11y-font-xl');

    // Line spacing
    root.classList.remove('a11y-line-relaxed', 'a11y-line-loose');
    if (preferences.lineSpacing === 'relaxed') root.classList.add('a11y-line-relaxed');
    if (preferences.lineSpacing === 'loose') root.classList.add('a11y-line-loose');

    // Letter spacing
    root.classList.remove('a11y-spacing-wide', 'a11y-spacing-wider');
    if (preferences.letterSpacing === 'wide') root.classList.add('a11y-spacing-wide');
    if (preferences.letterSpacing === 'wider') root.classList.add('a11y-spacing-wider');

    // Boolean toggles
    root.classList.toggle('a11y-high-contrast', !!preferences.highContrast);
    root.classList.toggle('a11y-grayscale', !!preferences.grayscale);
    root.classList.toggle('a11y-readable-font', !!preferences.readableFont);
    root.classList.toggle('a11y-reduced-motion', !!preferences.reducedMotion);
    root.classList.toggle('a11y-large-cursor', !!preferences.largeCursor);
    root.classList.toggle('a11y-simplified-reading', !!preferences.simplifiedReading);
  }, [preferences]);

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetAll = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear a11y preferences from localStorage", e);
    }
  }, []);

  const value = {
    preferences,
    updatePreference,
    resetAll,
    announce,
    isReducedMotion: preferences.reducedMotion,
    isAnimationsPaused: preferences.pauseAnimations || preferences.reducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Hidden Live Region for Screen Readers (WCAG 2.2 AA) */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="a11y-live-announcer"
      >
        {liveAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
