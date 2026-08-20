import React, { useEffect, useRef, useState } from 'react';
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

  const handleReset = () => {
    resetAll();
    announce(getTranslation('a11yResetSuccess', 'Toutes les préférences ont été réinitialisées.'));
  };

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
          className="relative w-full max-w-[580px] max-h-[82vh] bg-[#2B0F14] border border-[#D4A24E]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col text-[#F5EBDD] overflow-hidden my-auto font-sans"
        >
          {/* Header Compact */}
          <header className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#D4A24E]/20 bg-[#1E0A0E] flex justify-between items-center shrink-0">
            <h2 id="a11y-panel-title" className="text-base sm:text-lg font-cinzel font-bold text-[#F5EBDD] flex items-center gap-2">
              <span className="text-base sm:text-lg" aria-hidden="true">♿</span>
              <span>{getTranslation('a11ySettingsTitle', 'Options d’Accessibilité')}</span>
            </h2>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#D8C6B6] hover:text-[#F5EBDD] hover:bg-white/10 transition-colors border border-transparent hover:border-[#D4A24E]/40 flex items-center justify-center cursor-pointer min-w-[36px] min-h-[36px]"
              aria-label={getTranslation('a11yClose', 'Fermer la fenêtre')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>

          {/* Options Container */}
          <div className="p-3.5 sm:p-4 overflow-y-auto space-y-2.5 flex-1 custom-scrollbar">
            
            {/* ── SECTION 1 : RÉGLAGES PRINCIPAUX ── */}
            <div className="space-y-2">
              
              {/* 1.1 Taille du texte */}
              <section aria-labelledby="opt-text-size" className="p-2.5 sm:p-3 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 id="opt-text-size" className="font-cinzel text-xs font-bold text-[#D4A24E] uppercase tracking-wider">
                    {getTranslation('a11yTextSizeTitle', 'Taille du texte')}
                  </h3>
                  <span className="text-[11px] font-mono text-[#D8C6B6]">
                    {preferences.fontSize === 'normal' && '100%'}
                    {preferences.fontSize === 'md' && '115%'}
                    {preferences.fontSize === 'lg' && '130%'}
                    {preferences.fontSize === 'xl' && '150%'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-labelledby="opt-text-size">
                  {[
                    { id: 'normal', label: '100%', title: getTranslation('a11yTextSizeDefault', 'Normale') },
                    { id: 'md', label: '115%', title: getTranslation('a11yTextSizeMedium', 'Grande') },
                    { id: 'lg', label: '130%', title: getTranslation('a11yTextSizeLarge', 'Très Gr.') },
                    { id: 'xl', label: '150%', title: getTranslation('a11yTextSizeMax', 'Max') },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={preferences.fontSize === opt.id}
                      onClick={() => updatePreference('fontSize', opt.id)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-cinzel font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer min-h-[36px] ${
                        preferences.fontSize === opt.id
                          ? 'bg-[#A6303B] text-white border border-[#A6303B] shadow'
                          : 'bg-[#36141B] text-[#D8C6B6] border border-[#D4A24E]/30 hover:text-[#F5EBDD] hover:border-[#D4A24E]/60'
                      }`}
                    >
                      <span className="text-xs">{opt.label}</span>
                      <span className="text-[9px] font-sans font-normal opacity-90 leading-none">{opt.title}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* 1.2 Contraste Renforcé */}
              <div className="flex items-center justify-between p-2.5 px-3 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl gap-3">
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-cinzel text-[#F5EBDD] uppercase">
                      {getTranslation('a11yContrastTitle', 'Contraste Renforcé')}
                    </strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${preferences.highContrast ? 'bg-[#A6303B] text-white' : 'bg-[#36141B] text-[#D8C6B6]'}`}>
                      {preferences.highContrast ? getTranslation('a11yActive', 'Activé') : getTranslation('a11yInactive', 'Désactivé')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D8C6B6] leading-tight mt-0.5">
                    {getTranslation('a11yContrastDesc', 'Augmente les contrastes (> 7:1).')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.highContrast}
                  aria-label={getTranslation('a11yContrastTitle', 'Contraste Renforcé')}
                  onClick={() => updatePreference('highContrast', !preferences.highContrast)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[32px] ${
                    preferences.highContrast ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    preferences.highContrast ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* 1.3 Police Haute Lisibilité */}
              <div className="flex items-center justify-between p-2.5 px-3 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl gap-3">
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-cinzel text-[#F5EBDD] uppercase">
                      {getTranslation('a11yReadableFontTitle', 'Police Haute Lisibilité')}
                    </strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${preferences.readableFont ? 'bg-[#A6303B] text-white' : 'bg-[#36141B] text-[#D8C6B6]'}`}>
                      {preferences.readableFont ? getTranslation('a11yActive', 'Activé') : getTranslation('a11yInactive', 'Désactivé')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D8C6B6] leading-tight mt-0.5">
                    {getTranslation('a11yReadableFontDesc', 'Typographie sans-serif claire.')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.readableFont}
                  aria-label={getTranslation('a11yReadableFontTitle', 'Police Haute Lisibilité')}
                  onClick={() => updatePreference('readableFont', !preferences.readableFont)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[32px] ${
                    preferences.readableFont ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    preferences.readableFont ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* 1.4 Réduire les Mouvements */}
              <div className="flex items-center justify-between p-2.5 px-3 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl gap-3">
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-cinzel text-[#F5EBDD] uppercase">
                      {getTranslation('a11yReduceMotionTitle', 'Réduire les Mouvements')}
                    </strong>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${preferences.reducedMotion ? 'bg-[#A6303B] text-white' : 'bg-[#36141B] text-[#D8C6B6]'}`}>
                      {preferences.reducedMotion ? getTranslation('a11yActive', 'Activé') : getTranslation('a11yInactive', 'Désactivé')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D8C6B6] leading-tight mt-0.5">
                    {getTranslation('a11yReduceMotionDesc', 'Désactive les transitions et rotations 3D.')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.reducedMotion}
                  aria-label={getTranslation('a11yReduceMotionTitle', 'Réduire les Mouvements')}
                  onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[32px] ${
                    preferences.reducedMotion ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    preferences.reducedMotion ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

            </div>

            {/* ── SECTION 2 : ACCORDÉON RÉGLAGES AVANCÉS ── */}
            <div className="border border-[#D4A24E]/25 bg-[#1E0A0E] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                aria-expanded={showAdvanced}
                aria-controls="advanced-a11y-settings"
                className="w-full p-2.5 px-3 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden="true">⚙️</span>
                  <div>
                    <h3 className="font-cinzel text-xs font-bold text-[#F5EBDD]">
                      {getTranslation('a11yAdvancedSettings', 'Réglages avancés')}
                    </h3>
                    <p className="text-[10px] text-[#D8C6B6]">
                      {getTranslation('a11yAdvancedSettingsDesc', 'Espacements, monochrome, grand curseur.')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-cinzel text-[#D4A24E] font-bold shrink-0">
                  {showAdvanced ? '▲' : '▼'}
                </span>
              </button>

              {showAdvanced && (
                <div id="advanced-a11y-settings" className="p-2.5 sm:p-3 border-t border-[#D4A24E]/15 bg-[#36141B]/40 space-y-2.5">
                  
                  {/* Espacements Lignes & Lettres */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    
                    {/* Espacement des lignes */}
                    <div className="p-2 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-lg">
                      <strong className="block font-cinzel text-[10px] font-bold text-[#D4A24E] mb-1.5 uppercase">
                        {getTranslation('a11yLineSpacingTitle', 'Espacement lignes')}
                      </strong>
                      <div className="flex gap-1">
                        {[
                          { id: 'normal', label: getTranslation('a11yLineSpacingNormal', 'Normal') },
                          { id: 'relaxed', label: getTranslation('a11yLineSpacingRelaxed', 'Aéré') },
                          { id: 'loose', label: getTranslation('a11yLineSpacingLoose', 'Très') },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updatePreference('lineSpacing', opt.id)}
                            aria-pressed={preferences.lineSpacing === opt.id}
                            className={`flex-1 py-1 px-1 rounded text-[11px] font-cinzel font-bold transition-all cursor-pointer min-h-[30px] ${
                              preferences.lineSpacing === opt.id
                                ? 'bg-[#A6303B] text-white border border-[#A6303B]'
                                : 'bg-[#36141B] text-[#D8C6B6] border border-[#D4A24E]/30 hover:text-[#F5EBDD]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Espacement des lettres */}
                    <div className="p-2 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-lg">
                      <strong className="block font-cinzel text-[10px] font-bold text-[#D4A24E] mb-1.5 uppercase">
                        {getTranslation('a11yLetterSpacingTitle', 'Espacement lettres')}
                      </strong>
                      <div className="flex gap-1">
                        {[
                          { id: 'normal', label: getTranslation('a11yLetterSpacingNormal', 'Normal') },
                          { id: 'wide', label: getTranslation('a11yLetterSpacingWide', 'Large') },
                          { id: 'wider', label: getTranslation('a11yLetterSpacingWider', 'Très') },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updatePreference('letterSpacing', opt.id)}
                            aria-pressed={preferences.letterSpacing === opt.id}
                            className={`flex-1 py-1 px-1 rounded text-[11px] font-cinzel font-bold transition-all cursor-pointer min-h-[30px] ${
                              preferences.letterSpacing === opt.id
                                ? 'bg-[#A6303B] text-white border border-[#A6303B]'
                                : 'bg-[#36141B] text-[#D8C6B6] border border-[#D4A24E]/30 hover:text-[#F5EBDD]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Niveaux de gris */}
                  <div className="flex items-center justify-between p-2 px-2.5 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-lg gap-2">
                    <div className="flex-1 pr-1">
                      <strong className="text-xs font-cinzel text-[#F5EBDD] block uppercase">
                        {getTranslation('a11yGrayscaleTitle', 'Mode Niveaux de Gris')}
                      </strong>
                      <span className="text-[10px] text-[#D8C6B6]">
                        {getTranslation('a11yGrayscaleDesc', 'Désature l’ensemble du site.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.grayscale}
                      aria-label={getTranslation('a11yGrayscaleTitle', 'Mode Niveaux de Gris')}
                      onClick={() => updatePreference('grayscale', !preferences.grayscale)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[28px] ${
                        preferences.grayscale ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.grayscale ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Pause des animations continues */}
                  <div className="flex items-center justify-between p-2 px-2.5 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-lg gap-2">
                    <div className="flex-1 pr-1">
                      <strong className="text-xs font-cinzel text-[#F5EBDD] block uppercase">
                        {getTranslation('a11yPauseAnimationsTitle', 'Pause Animations Continues')}
                      </strong>
                      <span className="text-[10px] text-[#D8C6B6]">
                        {getTranslation('a11yPauseAnimationsDesc', 'Arrête les particules 3D et effets continus.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.pauseAnimations}
                      aria-label={getTranslation('a11yPauseAnimationsTitle', 'Pause Animations Continues')}
                      onClick={() => updatePreference('pauseAnimations', !preferences.pauseAnimations)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[28px] ${
                        preferences.pauseAnimations ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.pauseAnimations ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Grand Curseur */}
                  <div className="flex items-center justify-between p-2 px-2.5 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-lg gap-2">
                    <div className="flex-1 pr-1">
                      <strong className="text-xs font-cinzel text-[#F5EBDD] block uppercase">
                        {getTranslation('a11yLargeCursorTitle', 'Grand Curseur de Souris')}
                      </strong>
                      <span className="text-[10px] text-[#D8C6B6]">
                        {getTranslation('a11yLargeCursorDesc', 'Agrandit le pointeur visuel.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.largeCursor}
                      aria-label={getTranslation('a11yLargeCursorTitle', 'Grand Curseur de Souris')}
                      onClick={() => updatePreference('largeCursor', !preferences.largeCursor)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[28px] ${
                        preferences.largeCursor ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.largeCursor ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Mode Lecture Simplifié */}
                  <div className="flex items-center justify-between p-2 px-2.5 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-lg gap-2">
                    <div className="flex-1 pr-1">
                      <strong className="text-xs font-cinzel text-[#F5EBDD] block uppercase">
                        {getTranslation('a11ySimplifiedReadingTitle', 'Mode Lecture Simplifié')}
                      </strong>
                      <span className="text-[10px] text-[#D8C6B6]">
                        {getTranslation('a11ySimplifiedReadingDesc', 'Épure la mise en page pour focaliser sur le texte.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.simplifiedReading}
                      aria-label={getTranslation('a11ySimplifiedReadingTitle', 'Mode Lecture Simplifié')}
                      onClick={() => updatePreference('simplifiedReading', !preferences.simplifiedReading)}
                      className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer min-h-[28px] ${
                        preferences.simplifiedReading ? 'bg-[#A6303B]' : 'bg-[#36141B] border border-[#D4A24E]/40'
                      }`}
                    >
                      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                        preferences.simplifiedReading ? 'translate-x-4.5' : 'translate-x-0.5'
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
              onClick={handleReset}
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
