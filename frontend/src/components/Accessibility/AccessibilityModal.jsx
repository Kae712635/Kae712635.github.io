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
        aria-describedby="a11y-panel-subtitle"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isReducedMotion ? 0 : 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: isReducedMotion ? 1 : 0.96, y: isReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: isReducedMotion ? 1 : 0.96, y: isReducedMotion ? 0 : 8 }}
          transition={{ duration: isReducedMotion ? 0 : 0.22 }}
          className="relative w-full max-w-[720px] max-h-[88vh] bg-[#1c1a17] border border-[#D4AF37]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#EEE2DF] overflow-hidden my-auto font-sans"
        >
          {/* Header */}
          <header className="relative px-5 pt-5 pb-3 sm:px-6 sm:pt-6 border-b border-[#8A897C]/20 bg-[#14110f] flex justify-between items-start">
            <div className="pr-10">
              <span className="text-[11px] font-cinzel tracking-[0.18em] text-[#D4AF37] uppercase font-bold block mb-1">
                {language === 'fr' ? 'Conformité WCAG 2.2 AA' : 'WCAG 2.2 AA Compliance'}
              </span>
              <h2 id="a11y-panel-title" className="text-lg sm:text-xl font-cinzel font-bold text-[#EEE2DF] leading-tight">
                {getTranslation('a11ySettingsTitle', 'Options d’Accessibilité')}
              </h2>
              <p id="a11y-panel-subtitle" className="text-xs sm:text-sm text-[#D0C7C4] mt-1">
                {getTranslation('a11ySettingsSubtitle', 'Personnalisez l’affichage, les contrastes, la typographie et les mouvements.')}
              </p>
            </div>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2.5 rounded-lg text-[#D0C7C4] hover:text-[#EEE2DF] hover:bg-white/10 transition-colors border border-transparent hover:border-[#8A897C]/40 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label={getTranslation('a11yClose', 'Fermer la fenêtre')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </header>

          {/* Options Container */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar">
            
            {/* ── SECTION 1 : RÉGLAGES PRINCIPAUX (IMMÉDIATEMENT VISIBLES) ── */}
            <div className="space-y-3">
              
              {/* 1.1 Taille du texte (Groupe Radio accessible) */}
              <section aria-labelledby="opt-text-size" className="p-3.5 bg-[#14110f] border border-[#8A897C]/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 id="opt-text-size" className="font-cinzel text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    {getTranslation('a11yTextSizeTitle', 'Taille du texte')}
                  </h3>
                  <span className="text-xs font-mono text-[#D0C7C4]">
                    {preferences.fontSize === 'normal' && '100%'}
                    {preferences.fontSize === 'md' && '115%'}
                    {preferences.fontSize === 'lg' && '130%'}
                    {preferences.fontSize === 'xl' && '150%'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-labelledby="opt-text-size">
                  {[
                    { id: 'normal', label: '100%', title: getTranslation('a11yTextSizeDefault', 'Normale') },
                    { id: 'md', label: '115%', title: getTranslation('a11yTextSizeMedium', 'Grande') },
                    { id: 'lg', label: '130%', title: getTranslation('a11yTextSizeLarge', 'Très Grande') },
                    { id: 'xl', label: '150%', title: getTranslation('a11yTextSizeMax', 'Maximale') },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={preferences.fontSize === opt.id}
                      onClick={() => updatePreference('fontSize', opt.id)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-cinzel font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer min-h-[44px] ${
                        preferences.fontSize === opt.id
                          ? 'bg-[#415D43] text-white border border-[#415D43] shadow'
                          : 'bg-[#2c2b28] text-[#D0C7C4] border border-[#8A897C]/30 hover:text-[#EEE2DF] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <span className="text-sm">{opt.label}</span>
                      <span className="text-[10px] font-sans font-normal opacity-90">{opt.title}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* 1.2 Contraste Renforcé */}
              <div className="flex items-center justify-between p-3.5 bg-[#14110f] border border-[#8A897C]/30 rounded-xl gap-3">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <strong className="text-xs font-cinzel text-[#EEE2DF] uppercase">
                      {getTranslation('a11yContrastTitle', 'Contraste Renforcé')}
                    </strong>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${preferences.highContrast ? 'bg-[#415D43] text-white' : 'bg-[#2c2b28] text-[#D0C7C4]'}`}>
                      {preferences.highContrast ? getTranslation('a11yActive', 'Activé') : getTranslation('a11yInactive', 'Désactivé')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D0C7C4] leading-relaxed">
                    {getTranslation('a11yContrastDesc', 'Augmente les contrastes à un ratio supérieur à 7:1.')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.highContrast}
                  aria-label={getTranslation('a11yContrastTitle', 'Contraste Renforcé')}
                  onClick={() => updatePreference('highContrast', !preferences.highContrast)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                    preferences.highContrast ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    preferences.highContrast ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* 1.3 Police Haute Lisibilité */}
              <div className="flex items-center justify-between p-3.5 bg-[#14110f] border border-[#8A897C]/30 rounded-xl gap-3">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <strong className="text-xs font-cinzel text-[#EEE2DF] uppercase">
                      {getTranslation('a11yReadableFontTitle', 'Police Haute Lisibilité')}
                    </strong>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${preferences.readableFont ? 'bg-[#415D43] text-white' : 'bg-[#2c2b28] text-[#D0C7C4]'}`}>
                      {preferences.readableFont ? getTranslation('a11yActive', 'Activé') : getTranslation('a11yInactive', 'Désactivé')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D0C7C4] leading-relaxed">
                    {getTranslation('a11yReadableFontDesc', 'Remplace les polices sérif par une typographie sans-serif claire.')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.readableFont}
                  aria-label={getTranslation('a11yReadableFontTitle', 'Police Haute Lisibilité')}
                  onClick={() => updatePreference('readableFont', !preferences.readableFont)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                    preferences.readableFont ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    preferences.readableFont ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* 1.4 Réduire les Mouvements */}
              <div className="flex items-center justify-between p-3.5 bg-[#14110f] border border-[#8A897C]/30 rounded-xl gap-3">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <strong className="text-xs font-cinzel text-[#EEE2DF] uppercase">
                      {getTranslation('a11yReduceMotionTitle', 'Réduire les Mouvements')}
                    </strong>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${preferences.reducedMotion ? 'bg-[#415D43] text-white' : 'bg-[#2c2b28] text-[#D0C7C4]'}`}>
                      {preferences.reducedMotion ? getTranslation('a11yActive', 'Activé') : getTranslation('a11yInactive', 'Désactivé')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D0C7C4] leading-relaxed">
                    {getTranslation('a11yReduceMotionDesc', 'Désactive les transitions, rotations de caméra et effets animés.')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={preferences.reducedMotion}
                  aria-label={getTranslation('a11yReduceMotionTitle', 'Réduire les Mouvements')}
                  onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                    preferences.reducedMotion ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    preferences.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>

            {/* ── SECTION 2 : ACCORDÉON RÉGLAGES AVANCÉS ── */}
            <div className="border border-[#8A897C]/30 bg-[#14110f] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                aria-expanded={showAdvanced}
                aria-controls="advanced-a11y-settings"
                className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">⚙️</span>
                  <div>
                    <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#EEE2DF]">
                      {getTranslation('a11yAdvancedSettings', 'Réglages avancés')}
                    </h3>
                    <p className="text-[11px] text-[#D0C7C4]">
                      {getTranslation('a11yAdvancedSettingsDesc', 'Espacements, monochrome, grand curseur et mode épuré.')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-cinzel text-[#D4AF37] font-bold shrink-0">
                  {showAdvanced ? '▲ ' + getTranslation('a11yHideDetails', 'Masquer') : '▼ ' + getTranslation('a11yShowDetails', 'Afficher')}
                </span>
              </button>

              {showAdvanced && (
                <div id="advanced-a11y-settings" className="p-3.5 border-t border-[#8A897C]/20 bg-[#1c1a17]/50 space-y-3.5">
                  
                  {/* Espacements Lignes & Lettres */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Espacement des lignes */}
                    <div className="p-3 bg-[#14110f] border border-[#8A897C]/20 rounded-lg">
                      <strong className="block font-cinzel text-[11px] font-bold text-[#D4AF37] mb-2 uppercase">
                        {getTranslation('a11yLineSpacingTitle', 'Espacement des lignes')}
                      </strong>
                      <div className="flex gap-1.5">
                        {[
                          { id: 'normal', label: getTranslation('a11yLineSpacingNormal', 'Normal') },
                          { id: 'relaxed', label: getTranslation('a11yLineSpacingRelaxed', 'Aéré') },
                          { id: 'loose', label: getTranslation('a11yLineSpacingLoose', 'Très Aéré') },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updatePreference('lineSpacing', opt.id)}
                            aria-pressed={preferences.lineSpacing === opt.id}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer min-h-[38px] ${
                              preferences.lineSpacing === opt.id
                                ? 'bg-[#415D43] text-white border border-[#415D43]'
                                : 'bg-[#2c2b28] text-[#D0C7C4] border border-[#8A897C]/30 hover:text-[#EEE2DF]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Espacement des lettres */}
                    <div className="p-3 bg-[#14110f] border border-[#8A897C]/20 rounded-lg">
                      <strong className="block font-cinzel text-[11px] font-bold text-[#D4AF37] mb-2 uppercase">
                        {getTranslation('a11yLetterSpacingTitle', 'Espacement des lettres')}
                      </strong>
                      <div className="flex gap-1.5">
                        {[
                          { id: 'normal', label: getTranslation('a11yLetterSpacingNormal', 'Normal') },
                          { id: 'wide', label: getTranslation('a11yLetterSpacingWide', 'Large') },
                          { id: 'wider', label: getTranslation('a11yLetterSpacingWider', 'Très Large') },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updatePreference('letterSpacing', opt.id)}
                            aria-pressed={preferences.letterSpacing === opt.id}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer min-h-[38px] ${
                              preferences.letterSpacing === opt.id
                                ? 'bg-[#415D43] text-white border border-[#415D43]'
                                : 'bg-[#2c2b28] text-[#D0C7C4] border border-[#8A897C]/30 hover:text-[#EEE2DF]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Niveaux de gris */}
                  <div className="flex items-center justify-between p-3 bg-[#14110f] border border-[#8A897C]/20 rounded-lg gap-3">
                    <div className="flex-1 pr-2">
                      <strong className="text-xs font-cinzel text-[#EEE2DF] block uppercase mb-0.5">
                        {getTranslation('a11yGrayscaleTitle', 'Mode Niveaux de Gris')}
                      </strong>
                      <span className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11yGrayscaleDesc', 'Désature l’ensemble des éléments visuels.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.grayscale}
                      aria-label={getTranslation('a11yGrayscaleTitle', 'Mode Niveaux de Gris')}
                      onClick={() => updatePreference('grayscale', !preferences.grayscale)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                        preferences.grayscale ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        preferences.grayscale ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Pause des animations continues */}
                  <div className="flex items-center justify-between p-3 bg-[#14110f] border border-[#8A897C]/20 rounded-lg gap-3">
                    <div className="flex-1 pr-2">
                      <strong className="text-xs font-cinzel text-[#EEE2DF] block uppercase mb-0.5">
                        {getTranslation('a11yPauseAnimationsTitle', 'Mettre en Pause les Animations')}
                      </strong>
                      <span className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11yPauseAnimationsDesc', 'Arrête les particules 3D et effets continus.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.pauseAnimations}
                      aria-label={getTranslation('a11yPauseAnimationsTitle', 'Mettre en Pause les Animations')}
                      onClick={() => updatePreference('pauseAnimations', !preferences.pauseAnimations)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                        preferences.pauseAnimations ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        preferences.pauseAnimations ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Grand Curseur */}
                  <div className="flex items-center justify-between p-3 bg-[#14110f] border border-[#8A897C]/20 rounded-lg gap-3">
                    <div className="flex-1 pr-2">
                      <strong className="text-xs font-cinzel text-[#EEE2DF] block uppercase mb-0.5">
                        {getTranslation('a11yLargeCursorTitle', 'Grand Curseur de Souris')}
                      </strong>
                      <span className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11yLargeCursorDesc', 'Agrandit le pointeur pour améliorer le repérage visuel.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.largeCursor}
                      aria-label={getTranslation('a11yLargeCursorTitle', 'Grand Curseur de Souris')}
                      onClick={() => updatePreference('largeCursor', !preferences.largeCursor)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                        preferences.largeCursor ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        preferences.largeCursor ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Mode Lecture Simplifié */}
                  <div className="flex items-center justify-between p-3 bg-[#14110f] border border-[#8A897C]/20 rounded-lg gap-3">
                    <div className="flex-1 pr-2">
                      <strong className="text-xs font-cinzel text-[#EEE2DF] block uppercase mb-0.5">
                        {getTranslation('a11ySimplifiedReadingTitle', 'Mode Lecture Simplifié')}
                      </strong>
                      <span className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11ySimplifiedReadingDesc', 'Épure la mise en page pour focaliser sur le texte.')}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences.simplifiedReading}
                      aria-label={getTranslation('a11ySimplifiedReadingTitle', 'Mode Lecture Simplifié')}
                      onClick={() => updatePreference('simplifiedReading', !preferences.simplifiedReading)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer min-h-[44px] ${
                        preferences.simplifiedReading ? 'bg-[#415D43]' : 'bg-[#2c2b28] border border-[#8A897C]/50'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        preferences.simplifiedReading ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Footer with Reset & Close buttons */}
          <footer className="px-5 py-3 sm:px-6 border-t border-[#8A897C]/20 bg-[#14110f] flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg border border-[#8A897C]/40 text-[#D0C7C4] hover:text-[#EEE2DF] hover:border-[#EEE2DF] text-xs font-cinzel font-bold uppercase transition-colors cursor-pointer min-h-[40px]"
            >
              ↺ {getTranslation('a11yResetAll', 'Réinitialiser')}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#415D43] hover:bg-[#2E4330] text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer min-h-[40px]"
            >
              {getTranslation('a11yClose', 'Fermer')}
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

