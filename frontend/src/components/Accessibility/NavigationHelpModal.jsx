import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import TextAlternative3D from './TextAlternative3D';

export default function NavigationHelpModal({ isOpen, onClose, triggerRef }) {
  const { t, language } = useLanguage();
  const { preferences, updatePreference, isReducedMotion } = useAccessibility();
  const [showTextVersion, setShowTextVersion] = useState(false);
  const [activeTab, setActiveTab] = useState('mouse'); // 'mouse' | 'keyboard' | 'touch'
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
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
          className="relative w-full max-w-[580px] max-h-[82vh] bg-[#2B0F14] border border-[#D4A24E]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col text-[#F5EBDD] overflow-hidden my-auto"
        >
          {/* Header Compact */}
          <header className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-[#D4A24E]/20 bg-[#1E0A0E] flex justify-between items-center shrink-0">
            <h2 id="nav-help-title" className="text-base sm:text-lg font-cinzel font-bold text-[#F5EBDD] flex items-center gap-2">
              <span className="text-base sm:text-lg" aria-hidden="true">🧭</span>
              <span>{getTranslation('a11yNavHelpTitle', 'Aide à la Navigation 3D')}</span>
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

          {/* Body Content */}
          <div className="p-3.5 sm:p-4 overflow-y-auto space-y-2.5 flex-1 custom-scrollbar text-sm font-sans">
            
            {/* Quick Motion Toggle - Compact 1-line */}
            <div className="flex items-center justify-between p-2.5 px-3 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm" aria-hidden="true">⚡</span>
                <div>
                  <span className="text-xs font-cinzel font-bold text-[#F5EBDD] block leading-tight">
                    {language === 'fr' ? 'Mouvements réduits' : 'Reduced Motion'}
                  </span>
                  <span className="text-[11px] text-[#D8C6B6] block leading-tight">
                    {language === 'fr' ? 'Désactive les rotations et transitions 3D' : 'Disables 3D rotations & transitions'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.reducedMotion}
                aria-label={language === 'fr' ? 'Mouvements réduits' : 'Reduced Motion'}
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

            {/* Horizontal Tabs [ Souris | Clavier | Tactile ] */}
            <div className="flex p-1 bg-[#1E0A0E] rounded-xl border border-[#D4A24E]/25 gap-1" role="tablist" aria-label="Mode de contrôle">
              {[
                { id: 'mouse', label: language === 'fr' ? 'Souris' : 'Mouse', icon: '🖱️' },
                { id: 'keyboard', label: language === 'fr' ? 'Clavier' : 'Keyboard', icon: '⌨️' },
                { id: 'touch', label: language === 'fr' ? 'Tactile' : 'Touch', icon: '📱' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[34px] ${
                    activeTab === tab.id
                      ? 'bg-[#A6303B] text-white shadow'
                      : 'text-[#D8C6B6] hover:text-[#F5EBDD] hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs" aria-hidden="true">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Active Tab Panel */}
            <div className="p-3 bg-[#1E0A0E] border border-[#D4A24E]/20 rounded-xl">
              {activeTab === 'mouse' && (
                <div id="tabpanel-mouse" role="tabpanel" aria-labelledby="tab-mouse" className="space-y-2 text-xs text-[#D8C6B6]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4A24E] font-bold shrink-0">•</span>
                    <span><strong className="text-[#F5EBDD]">{language === 'fr' ? 'Pivoter :' : 'Rotate:'}</strong> {getTranslation('a11yHelpMouseRotate', 'Déplacez le curseur pour observer les rayons.')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4A24E] font-bold shrink-0">•</span>
                    <span><strong className="text-[#F5EBDD]">{language === 'fr' ? 'Zoomer :' : 'Zoom:'}</strong> {getTranslation('a11yHelpMouseZoom', 'Molette de la souris pour approcher les ouvrages.')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4A24E] font-bold shrink-0">•</span>
                    <span><strong className="text-[#F5EBDD]">{language === 'fr' ? 'Sélectionner :' : 'Select:'}</strong> {getTranslation('a11yHelpMouseSelect', 'Clic sur un livre ou panneau pour ouvrir la fiche.')}</span>
                  </div>
                </div>
              )}

              {activeTab === 'keyboard' && (
                <div id="tabpanel-keyboard" role="tabpanel" aria-labelledby="tab-keyboard" className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#D8C6B6]">
                  <div className="flex items-center gap-2 p-1.5 px-2 bg-[#36141B]/40 rounded-lg border border-[#D4A24E]/15">
                    <kbd className="px-1.5 py-0.5 bg-[#1E0A0E] border border-[#D4A24E]/40 rounded font-mono text-[11px] text-[#D4A24E] font-bold shrink-0">1</kbd>
                    <span className="truncate">{language === 'fr' ? 'Travée 1 : Expériences' : 'Bay 1: Experiences'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 px-2 bg-[#36141B]/40 rounded-lg border border-[#D4A24E]/15">
                    <kbd className="px-1.5 py-0.5 bg-[#1E0A0E] border border-[#D4A24E]/40 rounded font-mono text-[11px] text-[#D4A24E] font-bold shrink-0">2</kbd>
                    <span className="truncate">{language === 'fr' ? 'Travée 2 : Projets' : 'Bay 2: Projects'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 px-2 bg-[#36141B]/40 rounded-lg border border-[#D4A24E]/15">
                    <kbd className="px-1.5 py-0.5 bg-[#1E0A0E] border border-[#D4A24E]/40 rounded font-mono text-[11px] text-[#D4A24E] font-bold shrink-0">3</kbd>
                    <span className="truncate">{language === 'fr' ? 'Travée 3 : Compétences' : 'Bay 3: Skills'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 px-2 bg-[#36141B]/40 rounded-lg border border-[#D4A24E]/15">
                    <kbd className="px-1.5 py-0.5 bg-[#1E0A0E] border border-[#D4A24E]/40 rounded font-mono text-[11px] text-[#D4A24E] font-bold shrink-0">4</kbd>
                    <span className="truncate">{language === 'fr' ? 'Travée 4 : Formations' : 'Bay 4: Education'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 px-2 bg-[#36141B]/40 rounded-lg border border-[#D4A24E]/15">
                    <kbd className="px-1.5 py-0.5 bg-[#1E0A0E] border border-[#D4A24E]/40 rounded font-mono text-[11px] text-[#D4A24E] font-bold shrink-0">0 / Échap</kbd>
                    <span className="truncate">{language === 'fr' ? 'Vue globale entrée' : 'Entrance view'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 px-2 bg-[#36141B]/40 rounded-lg border border-[#D4A24E]/15">
                    <kbd className="px-1.5 py-0.5 bg-[#1E0A0E] border border-[#D4A24E]/40 rounded font-mono text-[11px] text-[#D4A24E] font-bold shrink-0">Tab / Entrée</kbd>
                    <span className="truncate">{language === 'fr' ? 'Sélection & Ouverture' : 'Focus & Open'}</span>
                  </div>
                </div>
              )}

              {activeTab === 'touch' && (
                <div id="tabpanel-touch" role="tabpanel" aria-labelledby="tab-touch" className="space-y-2 text-xs text-[#D8C6B6]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4A24E] font-bold shrink-0">•</span>
                    <span><strong className="text-[#F5EBDD]">{language === 'fr' ? 'Glisser :' : 'Swipe:'}</strong> {getTranslation('a11yHelpTouchSwipe', 'Glissez un doigt pour orienter la vue.')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4A24E] font-bold shrink-0">•</span>
                    <span><strong className="text-[#F5EBDD]">{language === 'fr' ? 'Pincer :' : 'Pinch:'}</strong> {getTranslation('a11yHelpTouchPinch', 'Pincez à 2 doigts pour zoomer et dézoomer.')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4A24E] font-bold shrink-0">•</span>
                    <span><strong className="text-[#F5EBDD]">{language === 'fr' ? 'Toucher :' : 'Tap:'}</strong> {getTranslation('a11yHelpTouchTap', 'Touchez un livre pour ouvrir sa fiche complète.')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Text Alternative View (Teal Contrast Accent) */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowTextVersion(prev => !prev)}
                className="w-full py-2 px-3 rounded-xl border border-[#3C6E71]/50 bg-[#3C6E71]/15 hover:bg-[#3C6E71]/25 text-[#F5EBDD] font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4A24E]"
                aria-expanded={showTextVersion}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden="true">📄</span>
                  <span>{getTranslation('a11yTextVersionBtn', 'Version texte alternative (sans 3D)')}</span>
                </span>
                <span className="text-xs text-[#5E9FA2]">{showTextVersion ? '▲' : '▼'}</span>
              </button>

              {showTextVersion && (
                <div className="mt-2.5">
                  <TextAlternative3D onSelectProject={onClose} />
                </div>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <footer className="px-4 py-2.5 sm:px-5 border-t border-[#D4A24E]/20 bg-[#1E0A0E] flex justify-end shrink-0">
            <button
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
