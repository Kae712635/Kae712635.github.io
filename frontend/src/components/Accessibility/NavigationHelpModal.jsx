import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import TextAlternative3D from './TextAlternative3D';

export default function NavigationHelpModal({ isOpen, onClose, triggerRef }) {
  const { t, language } = useLanguage();
  const { preferences, updatePreference, isReducedMotion } = useAccessibility();
  const [showTextVersion, setShowTextVersion] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null); // 'mouse' | 'keyboard' | 'touch' | null
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSection(prev => prev === sectionKey ? null : sectionKey);
  };

  // Focus trap, Escape key handling, and background scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const focusTimer = setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
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
      // Restore focus to trigger
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
        aria-labelledby="nav-help-title"
        aria-describedby="nav-help-subtitle"
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
          className="relative w-full max-w-[720px] max-h-[88vh] bg-[#1c1a17] border border-[#D4AF37]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#EEE2DF] overflow-hidden my-auto"
        >
          {/* Header */}
          <header className="relative px-5 pt-5 pb-3 sm:px-6 sm:pt-6 border-b border-[#8A897C]/20 bg-[#14110f] flex justify-between items-start">
            <div className="pr-10">
              <span className="text-[11px] font-cinzel tracking-[0.18em] text-[#D4AF37] uppercase font-bold block mb-1">
                {language === 'fr' ? 'Accessibilité & Pédagogie' : 'Accessibility & Guide'}
              </span>
              <h2 id="nav-help-title" className="text-lg sm:text-xl font-cinzel font-bold text-[#EEE2DF] leading-tight">
                {getTranslation('a11yNavHelpTitle', 'Aide à la Navigation 3D')}
              </h2>
              <p id="nav-help-subtitle" className="text-xs sm:text-sm text-[#D0C7C4] mt-1 font-sans">
                {getTranslation('a11yNavHelpSubtitle', 'Guide des contrôles de la bibliothèque et raccourcis clavier.')}
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

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar text-sm font-sans">
            
            {/* Quick Motion Toggle Banner */}
            <div className="flex items-center justify-between p-3.5 bg-[#14110f] border border-[#8A897C]/30 rounded-xl flex-wrap gap-3">
              <div className="flex-1 min-w-[220px]">
                <strong className="block text-xs font-cinzel text-[#D4AF37] uppercase">
                  {language === 'fr' ? 'Sensibilité au mouvement ?' : 'Motion Sensitivity?'}
                </strong>
                <span className="text-xs text-[#D0C7C4]">
                  {language === 'fr' ? 'Désactivez les transitions de caméra et rotations.' : 'Disable camera transitions and continuous animations.'}
                </span>
              </div>
              <button
                onClick={() => updatePreference('reducedMotion', !preferences.reducedMotion)}
                role="switch"
                aria-checked={preferences.reducedMotion}
                className={`px-3.5 py-2 rounded-lg font-cinzel text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer min-h-[40px] ${
                  preferences.reducedMotion 
                    ? 'bg-[#415D43] text-white border border-[#415D43] shadow' 
                    : 'bg-[#2c2b28] text-[#D0C7C4] border border-[#8A897C]/40 hover:text-[#EEE2DF] hover:border-[#D4AF37]'
                }`}
              >
                <span>{preferences.reducedMotion ? `✓ ${getTranslation('a11yActive', 'Activé')}` : `○ ${getTranslation('a11yInactive', 'Désactivé')}`}</span>
                <span className="text-[11px] font-normal normal-case opacity-90 hidden sm:inline">
                  ({language === 'fr' ? 'Mouvements réduits' : 'Reduced motion'})
                </span>
              </button>
            </div>

            {/* 3 Interaction Sections with Progressive Disclosure Accordions */}
            <div className="space-y-2.5">
              
              {/* 1. Souris & Trackpad */}
              <div className="bg-[#14110f] border border-[#8A897C]/30 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('mouse')}
                  aria-expanded={expandedSection === 'mouse'}
                  aria-controls="section-help-mouse"
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0" aria-hidden="true">🖱️</span>
                    <div>
                      <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#EEE2DF]">
                        {getTranslation('a11yHelpMouseTitle', 'Souris & Trackpad')}
                      </h3>
                      <p className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11yMouseSummary', 'Déplacer, pivoter et zoomer à la molette')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-cinzel text-[#D4AF37] shrink-0 font-bold">
                    {expandedSection === 'mouse' ? '▲ ' + getTranslation('a11yHideDetails', 'Masquer') : '▼ ' + getTranslation('a11yShowDetails', 'Détails')}
                  </span>
                </button>

                {expandedSection === 'mouse' && (
                  <div id="section-help-mouse" className="px-4 pb-3.5 pt-1 border-t border-[#8A897C]/20 bg-[#1c1a17]/50">
                    <ul className="space-y-2 text-xs text-[#D0C7C4]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span><strong className="text-[#EEE2DF]">{language === 'fr' ? 'Pivoter :' : 'Rotate:'}</strong> {getTranslation('a11yHelpMouseRotate', 'Déplacez le curseur pour observer les rayons de la bibliothèque.')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span><strong className="text-[#EEE2DF]">{language === 'fr' ? 'Zoomer :' : 'Zoom:'}</strong> {getTranslation('a11yHelpMouseZoom', 'Utilisez la molette pour vous approcher des ouvrages.')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span><strong className="text-[#EEE2DF]">{language === 'fr' ? 'Sélectionner :' : 'Select:'}</strong> {getTranslation('a11yHelpMouseSelect', 'Cliquez sur un livre ou une travée pour ouvrir les détails.')}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Raccourcis Clavier */}
              <div className="bg-[#14110f] border border-[#8A897C]/30 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('keyboard')}
                  aria-expanded={expandedSection === 'keyboard'}
                  aria-controls="section-help-keyboard"
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0" aria-hidden="true">⌨️</span>
                    <div>
                      <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#EEE2DF]">
                        {getTranslation('a11yHelpKeyboardTitle', 'Raccourcis Clavier')}
                      </h3>
                      <p className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11yKeyboardSummary', 'Touches 0 à 4 pour naviguer entre les travées')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-cinzel text-[#D4AF37] shrink-0 font-bold">
                    {expandedSection === 'keyboard' ? '▲ ' + getTranslation('a11yHideDetails', 'Masquer') : '▼ ' + getTranslation('a11yShowDetails', 'Détails')}
                  </span>
                </button>

                {expandedSection === 'keyboard' && (
                  <div id="section-help-keyboard" className="px-4 pb-3.5 pt-1 border-t border-[#8A897C]/20 bg-[#1c1a17]/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#D0C7C4]">
                      <div className="flex items-center gap-2 p-2 bg-[#14110f] rounded-lg border border-[#8A897C]/20">
                        <kbd className="px-2 py-0.5 bg-[#2c2b28] border border-[#8A897C]/50 rounded font-mono text-[11px] text-[#D4AF37] font-bold">1</kbd>
                        <span>{language === 'fr' ? 'Travée 1 : Expériences Pro' : 'Bay 1: Work Experiences'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#14110f] rounded-lg border border-[#8A897C]/20">
                        <kbd className="px-2 py-0.5 bg-[#2c2b28] border border-[#8A897C]/50 rounded font-mono text-[11px] text-[#D4AF37] font-bold">2</kbd>
                        <span>{language === 'fr' ? 'Travée 2 : Projets Phares' : 'Bay 2: Featured Projects'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#14110f] rounded-lg border border-[#8A897C]/20">
                        <kbd className="px-2 py-0.5 bg-[#2c2b28] border border-[#8A897C]/50 rounded font-mono text-[11px] text-[#D4AF37] font-bold">3</kbd>
                        <span>{language === 'fr' ? 'Travée 3 : Compétences Tech' : 'Bay 3: Tech Skills'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#14110f] rounded-lg border border-[#8A897C]/20">
                        <kbd className="px-2 py-0.5 bg-[#2c2b28] border border-[#8A897C]/50 rounded font-mono text-[11px] text-[#D4AF37] font-bold">4</kbd>
                        <span>{language === 'fr' ? 'Travée 4 : Formations & Diplômes' : 'Bay 4: Education'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#14110f] rounded-lg border border-[#8A897C]/20">
                        <kbd className="px-2 py-0.5 bg-[#2c2b28] border border-[#8A897C]/50 rounded font-mono text-[11px] text-[#D4AF37] font-bold">0 / Échap</kbd>
                        <span>{language === 'fr' ? 'Retour vue globale' : 'Return to entrance view'}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#14110f] rounded-lg border border-[#8A897C]/20">
                        <kbd className="px-2 py-0.5 bg-[#2c2b28] border border-[#8A897C]/50 rounded font-mono text-[11px] text-[#D4AF37] font-bold">Tab / Entrée</kbd>
                        <span>{language === 'fr' ? 'Sélectionner & Ouvrir' : 'Focus & Open'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Écran Tactile */}
              <div className="bg-[#14110f] border border-[#8A897C]/30 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('touch')}
                  aria-expanded={expandedSection === 'touch'}
                  aria-controls="section-help-touch"
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0" aria-hidden="true">📱</span>
                    <div>
                      <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#EEE2DF]">
                        {getTranslation('a11yHelpTouchTitle', 'Écran Tactile')}
                      </h3>
                      <p className="text-[11px] text-[#D0C7C4]">
                        {getTranslation('a11yTouchSummary', 'Glisser et pincer pour explorer')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-cinzel text-[#D4AF37] shrink-0 font-bold">
                    {expandedSection === 'touch' ? '▲ ' + getTranslation('a11yHideDetails', 'Masquer') : '▼ ' + getTranslation('a11yShowDetails', 'Détails')}
                  </span>
                </button>

                {expandedSection === 'touch' && (
                  <div id="section-help-touch" className="px-4 pb-3.5 pt-1 border-t border-[#8A897C]/20 bg-[#1c1a17]/50">
                    <ul className="space-y-2 text-xs text-[#D0C7C4]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span><strong className="text-[#EEE2DF]">{language === 'fr' ? 'Glisser :' : 'Swipe:'}</strong> {getTranslation('a11yHelpTouchSwipe', 'Glissez un doigt pour orienter la vue dans la pièce.')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span><strong className="text-[#EEE2DF]">{language === 'fr' ? 'Pincer :' : 'Pinch:'}</strong> {getTranslation('a11yHelpTouchPinch', 'Pincez à deux doigts pour zoomer et dézoomer.')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span><strong className="text-[#EEE2DF]">{language === 'fr' ? 'Toucher :' : 'Tap:'}</strong> {getTranslation('a11yHelpTouchTap', 'Touchez un livre pour ouvrir sa fiche détaillée.')}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

            </div>

            {/* Toggle Text Alternative View */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTextVersion(prev => !prev)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#415D43] bg-[#415D43]/20 hover:bg-[#415D43]/35 text-[#EEE2DF] font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                aria-expanded={showTextVersion}
              >
                <span>{showTextVersion ? '▲ ' + getTranslation('a11yTextVersionHide', 'Masquer la version texte') : '▼ ' + getTranslation('a11yTextVersionBtn', 'Consulter la version texte alternative (sans 3D)')}</span>
              </button>

              {showTextVersion && (
                <TextAlternative3D onSelectProject={onClose} />
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <footer className="px-5 py-3 sm:px-6 border-t border-[#8A897C]/20 bg-[#14110f] flex justify-end">
            <button
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

