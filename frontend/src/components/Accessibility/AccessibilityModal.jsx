import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function AccessibilityModal({ isOpen, onClose, triggerRef }) {
  const { t, language } = useLanguage();
  const { preferences, updatePreference, resetAll, announce, isReducedMotion } = useAccessibility();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  // Pre-configured Disability & Neurodiversity Profiles
  const profiles = useMemo(() => [
    {
      id: 'dyslexia',
      label: language === 'fr' ? 'Dyslexie' : 'Dyslexia',
      icon: '📖',
      desc: language === 'fr' 
        ? 'Police sans-serif, espacement aéré & texte agrandi' 
        : 'Clear sans-serif font, open spacing & larger text',
      settings: {
        readableFont: true,
        lineSpacing: 'relaxed',
        letterSpacing: 'wide',
        fontSize: 'md',
        simplifiedReading: true
      }
    },
    {
      id: 'adhd',
      label: language === 'fr' ? 'TDAH & Concentration' : 'ADHD & Focus',
      icon: '🧠',
      desc: language === 'fr' 
        ? 'Arrêt des distractions, animations 3D coupées & lecture épurée' 
        : 'Stops distractions, pauses 3D motion & simplified reading',
      settings: {
        reducedMotion: true,
        pauseAnimations: true,
        simplifiedReading: true
      }
    },
    {
      id: 'visual',
      label: language === 'fr' ? 'Malvoyance & Contraste' : 'Low Vision & Contrast',
      icon: '👁️',
      desc: language === 'fr' 
        ? 'Contraste renforcé (7:1), texte 130% & grand curseur' 
        : 'High contrast ratio (7:1), 130% text & large cursor',
      settings: {
        highContrast: true,
        fontSize: 'lg',
        largeCursor: true
      }
    },
    {
      id: 'motion',
      label: language === 'fr' ? 'Sensibilité Mouvements' : 'Motion Sensitivity',
      icon: '⚡',
      desc: language === 'fr' 
        ? 'Désactive les rotations 3D & effets de caméra' 
        : 'Disables 3D camera turns & rapid screen transitions',
      settings: {
        reducedMotion: true,
        pauseAnimations: true
      }
    },
    {
      id: 'daltonism',
      label: language === 'fr' ? 'Daltonisme / Repos' : 'Color Blindness / Rest',
      icon: '🌓',
      desc: language === 'fr' 
        ? 'Mode niveaux de gris & contrastes équilibrés' 
        : 'Monochrome grayscale & balanced contrast',
      settings: {
        grayscale: true,
        highContrast: true
      }
    }
  ], [language]);

  // Check if a profile is currently active
  const isProfileActive = (profile) => {
    return Object.entries(profile.settings).every(([key, val]) => preferences[key] === val);
  };

  const handleToggleProfile = (profile) => {
    const active = isProfileActive(profile);
    if (active) {
      resetAll();
      announce(language === 'fr' ? 'Profil désactivé. Préférences par défaut.' : 'Profile disabled. Default settings restored.');
    } else {
      // Apply profile settings
      Object.entries(profile.settings).forEach(([key, val]) => {
        updatePreference(key, val);
      });
      announce(language === 'fr' ? `Profil ${profile.label} activé.` : `Profile ${profile.label} enabled.`);
    }
  };

  // Focus trap, Escape key listener, and background scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      if (closeBtnRef.current) closeBtnRef.current.focus();
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (triggerRef && triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: isReducedMotion ? 1 : 0.96, y: isReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: isReducedMotion ? 1 : 0.96, y: isReducedMotion ? 0 : 8 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2 }}
          className="relative w-full max-w-[580px] max-h-[85vh] bg-[#2B0F14] border border-[#D4A24E]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col text-[#F5EBDD] overflow-hidden my-auto font-sans"
        >
          {/* Centered Header */}
          <header className="relative px-5 py-3.5 sm:py-4 border-b border-[#D4A24E]/20 bg-[#1E0A0E] text-center shrink-0">
            <h2 id="a11y-panel-title" className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-[0.15em] text-[#D4A24E] leading-tight">
              {getTranslation('a11ySettingsTitle', 'Profils d’Accessibilité')}
            </h2>
            <p className="text-[11px] text-[#D8C6B6] mt-0.5 font-sans">
              {language === 'fr' ? 'Activez un profil pour adapter l’affichage en 1 clic' : 'Select a profile to adapt the display in 1 click'}
            </p>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 p-1.5 rounded-lg text-[#D8C6B6] hover:text-[#F5EBDD] hover:bg-white/10 transition-colors border border-transparent hover:border-[#D4A24E]/40 flex items-center justify-center cursor-pointer min-w-[36px] min-h-[36px]"
              aria-label={getTranslation('a11yClose', 'Fermer la fenêtre')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>

          {/* Body Content */}
          <div className="p-3.5 sm:p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
            
            {/* 1-Click Disability Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {profiles.map((profile) => {
                const active = isProfileActive(profile);
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleToggleProfile(profile)}
                    className={`p-3 rounded-xl border transition-all text-left flex items-start gap-3 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#D4A24E] ${
                      active
                        ? 'bg-[#D4A24E]/15 border-[#D4A24E] shadow-[0_0_15px_rgba(212,162,78,0.2)] ring-1 ring-[#D4A24E]'
                        : 'bg-[#1E0A0E] border-[#D4A24E]/25 hover:border-[#D4A24E]/60 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base shadow-sm mt-0.5 ${
                      active ? 'bg-[#D4A24E] text-[#1E0A0E]' : 'bg-[#2B0F14] border border-[#D4A24E]/30 text-[#D4A24E]'
                    }`}>
                      {profile.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`font-cinzel font-bold text-xs sm:text-sm leading-tight truncate ${
                          active ? 'text-[#D4A24E]' : 'text-[#F5EBDD] group-hover:text-white'
                        }`}>
                          {profile.label}
                        </span>
                        {active && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#D4A24E] text-[#1E0A0E] rounded font-cinzel shrink-0">
                            {language === 'fr' ? 'Actif' : 'Active'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#D8C6B6] leading-relaxed line-clamp-2">
                        {profile.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Collapsed Custom Settings Accordion */}
            <div className="border border-[#D4A24E]/20 bg-[#1E0A0E] rounded-xl overflow-hidden mt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                aria-expanded={showAdvanced}
                className="w-full p-2.5 px-3 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden="true">⚙️</span>
                  <span className="font-cinzel text-xs font-bold text-[#D8C6B6] hover:text-[#F5EBDD]">
                    {language === 'fr' ? 'Personnaliser les réglages manuellement' : 'Customize individual settings'}
                  </span>
                </div>
                <span className="text-xs font-cinzel text-[#D4A24E] font-bold shrink-0">
                  {showAdvanced ? '▲' : '▼'}
                </span>
              </button>

              {showAdvanced && (
                <div className="p-3 border-t border-[#D4A24E]/15 bg-[#2B0F14]/40 space-y-2.5 text-xs">
                  
                  {/* Taille du texte */}
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-[#F5EBDD]">{language === 'fr' ? 'Taille du texte' : 'Text size'}</span>
                    <div className="flex gap-1">
                      {[
                        { id: 'normal', label: '100%' },
                        { id: 'md', label: '115%' },
                        { id: 'lg', label: '130%' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updatePreference('fontSize', opt.id)}
                          className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                            preferences.fontSize === opt.id ? 'bg-[#A6303B] text-white' : 'bg-[#1E0A0E] text-[#D8C6B6] border border-[#D4A24E]/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contraste */}
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-[#F5EBDD]">{language === 'fr' ? 'Contraste renforcé' : 'High contrast'}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.highContrast}
                      onClick={() => updatePreference('highContrast', !preferences.highContrast)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.highContrast ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.highContrast ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Police lisible */}
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-[#F5EBDD]">{language === 'fr' ? 'Police haute lisibilité' : 'Readable font'}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.readableFont}
                      onClick={() => updatePreference('readableFont', !preferences.readableFont)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.readableFont ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.readableFont ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Mouvements réduits */}
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-bold text-[#F5EBDD]">{language === 'fr' ? 'Mouvements réduits' : 'Reduced motion'}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.reducedMotion}
                      onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        preferences.reducedMotion ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.reducedMotion ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Footer with Reset & Close buttons */}
          <footer className="px-4 py-2.5 sm:px-5 border-t border-[#D4A24E]/20 bg-[#1E0A0E] flex items-center justify-between flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                resetAll();
                announce(language === 'fr' ? 'Toutes les préférences ont été réinitialisées.' : 'All preferences reset.');
              }}
              className="px-3 py-1.5 rounded-lg border border-[#D4A24E]/40 text-[#D8C6B6] hover:text-[#F5EBDD] hover:border-[#D4A24E] text-xs font-cinzel font-bold uppercase transition-colors cursor-pointer min-h-[36px]"
            >
              ↺ {getTranslation('a11yResetAll', 'Réinitialiser')}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#A6303B] hover:bg-[#801F29] text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer min-h-[36px]"
            >
              {getTranslation('a11yClose', 'Fermer')}
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
