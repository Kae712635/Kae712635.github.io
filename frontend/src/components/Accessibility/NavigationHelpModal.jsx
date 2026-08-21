import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function NavigationHelpModal({ isOpen, onClose, triggerRef }) {
  const { t, language } = useLanguage();
  const { isReducedMotion } = useAccessibility();
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
          className="relative w-full max-w-[540px] bg-[#2B0F14] border border-[#D4A24E]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col text-[#F5EBDD] overflow-hidden my-auto"
        >
          {/* Centered Header */}
          <header className="relative px-5 py-4 border-b border-[#D4A24E]/20 bg-[#1E0A0E] text-center shrink-0">
            <h2 id="nav-help-title" className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-[0.15em] text-[#D4A24E] leading-tight">
              {getTranslation('a11yNavHelpTitle', 'Aide à la Navigation 3D')}
            </h2>

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

          {/* Body Content: 3 Real Active Controls */}
          <div className="p-4 sm:p-5 space-y-3 flex-1 text-sm font-sans">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* 1. Se déplacer (Touches ZQSD / Flèches) */}
              <div className="p-3.5 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-lg bg-[#D4A24E]/15 text-[#D4A24E] border border-[#D4A24E]/30 flex items-center justify-center mb-2 shadow-sm">
                  {/* Directional keys icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 3 15 7 9 7 12 3"/>
                    <polygon points="12 21 9 17 15 17 12 21"/>
                    <polygon points="3 12 7 9 7 15 3 12"/>
                    <polygon points="21 12 17 15 17 9 21 12"/>
                  </svg>
                </div>
                <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] mb-1 block leading-tight">
                  {language === 'fr' ? 'Se déplacer' : 'Move'}
                </span>
                <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-[#2B0F14] text-[#D4A24E] border border-[#D4A24E]/30 rounded mb-1">
                  ZQSD / Flèches
                </span>
                <span className="text-[11px] text-[#D8C6B6] leading-tight">
                  {language === 'fr' ? 'Marcher dans l’allée' : 'Walk in the hall'}
                </span>
              </div>

              {/* 2. Accès rapide aux travées (Touches 1 à 5) */}
              <div className="p-3.5 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-lg bg-[#D4A24E]/15 text-[#D4A24E] border border-[#D4A24E]/30 flex items-center justify-center mb-2 shadow-sm">
                  {/* Quick jump icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </div>
                <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] mb-1 block leading-tight">
                  {language === 'fr' ? 'Aller aux travées' : 'Jump to bays'}
                </span>
                <span className="inline-block font-mono text-[11px] font-bold px-2 py-0.5 bg-[#2B0F14] text-[#D4A24E] border border-[#D4A24E]/30 rounded mb-1">
                  Touches 1 à 5
                </span>
                <span className="text-[11px] text-[#D8C6B6] leading-tight">
                  {language === 'fr' ? '1: Entrée · 2-5: Travées' : '1: Entry · 2-5: Bays'}
                </span>
              </div>

              {/* 3. Ouvrir un livre (Clic direct souris) */}
              <div className="p-3.5 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-lg bg-[#D4A24E]/15 text-[#D4A24E] border border-[#D4A24E]/30 flex items-center justify-center mb-2 shadow-sm">
                  {/* Open book icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] mb-1 block leading-tight">
                  {language === 'fr' ? 'Ouvrir un projet' : 'Open project'}
                </span>
                <span className="inline-block font-cinzel text-[11px] font-bold px-2 py-0.5 bg-[#2B0F14] text-[#D4A24E] border border-[#D4A24E]/30 rounded mb-1">
                  {language === 'fr' ? 'Clic gauche' : 'Left click'}
                </span>
                <span className="text-[11px] text-[#D8C6B6] leading-tight">
                  {language === 'fr' ? 'Directement sur un livre' : 'Directly on a 3D book'}
                </span>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
