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
          className="relative w-full max-w-[560px] bg-[#2B0F14] border border-[#D4A24E]/35 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col text-[#F5EBDD] overflow-hidden my-auto"
        >
          {/* Centered Header */}
          <header className="relative px-5 py-3.5 sm:py-4 border-b border-[#D4A24E]/20 bg-[#1E0A0E] text-center shrink-0">
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

          {/* Body Content: 3 Realistic Visual Cards */}
          <div className="p-4 sm:p-5 flex-1 text-sm font-sans">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* 1. SE DÉPLACER (Visual ZQSD Keycaps) */}
              <div className="p-3.5 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl flex flex-col items-center justify-between text-center min-h-[170px]">
                {/* ZQSD Keycaps Layout */}
                <div className="h-16 flex flex-col items-center justify-center gap-1">
                  <div className="w-7 h-7 rounded-md bg-[#2B0F14] border border-[#D4A24E]/60 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-xs font-mono font-bold text-[#D4A24E]">
                    Z
                  </div>
                  <div className="flex gap-1">
                    <div className="w-7 h-7 rounded-md bg-[#2B0F14] border border-[#D4A24E]/60 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-xs font-mono font-bold text-[#D4A24E]">
                      Q
                    </div>
                    <div className="w-7 h-7 rounded-md bg-[#2B0F14] border border-[#D4A24E]/60 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-xs font-mono font-bold text-[#D4A24E]">
                      S
                    </div>
                    <div className="w-7 h-7 rounded-md bg-[#2B0F14] border border-[#D4A24E]/60 shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-xs font-mono font-bold text-[#D4A24E]">
                      D
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] block leading-tight mb-1">
                    {language === 'fr' ? 'Se déplacer' : 'Move'}
                  </span>
                  <span className="text-[11px] text-[#D8C6B6] leading-tight block">
                    {language === 'fr' ? 'Marcher dans l’allée' : 'Walk in the hall'}
                  </span>
                </div>
              </div>

              {/* 2. ALLER AUX Allées (Visual 1 to 5 Numbered Strip) */}
              <div className="p-3.5 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl flex flex-col items-center justify-between text-center min-h-[170px]">
                {/* 1-5 Number Keys Strip */}
                <div className="h-16 flex flex-col items-center justify-center gap-1.5">
                  <div className="flex items-center gap-1">
                    {['1', '2', '3', '4', '5'].map((num) => (
                      <div 
                        key={num} 
                        className={`w-6 h-7 sm:w-6.5 sm:h-7 rounded-md border shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center text-xs font-mono font-bold ${
                          num === '1' 
                            ? 'bg-[#A6303B]/30 border-[#A6303B] text-[#F5EBDD]' 
                            : 'bg-[#2B0F14] border-[#D4A24E]/60 text-[#D4A24E]'
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#D4A24E] font-cinzel font-bold tracking-wider">
                    {language === 'fr' ? '1-5 Allées' : '1-5 Aisles'}
                  </span>
                </div>

                <div>
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] block leading-tight mb-1">
                    {language === 'fr' ? 'Aller aux allées' : 'Jump to bays'}
                  </span>
                  <span className="text-[11px] text-[#D8C6B6] leading-tight block">
                    {language === 'fr' ? 'Téléportation directe' : 'Instant teleport'}
                  </span>
                </div>
              </div>

              {/* 3. OUVRIR UN LIVRE (Visual Mouse with highlighted Left-Click) */}
              <div className="p-3.5 bg-[#1E0A0E] border border-[#D4A24E]/25 rounded-xl flex flex-col items-center justify-between text-center min-h-[170px]">
                {/* Illustrated Mouse + Click Target */}
                <div className="h-16 flex items-center justify-center gap-2">
                  <svg width="26" height="38" viewBox="0 0 28 42" fill="none" className="shrink-0 drop-shadow">
                    <rect x="1" y="1" width="26" height="40" rx="13" stroke="#D4A24E" strokeWidth="1.5" fill="#1E0A0E" />
                    {/* Highlighted Left Click Button */}
                    <path d="M1 14C1 7.37258 6.37258 2 13 2V18H1V14Z" fill="#D4A24E" fillOpacity="0.9" stroke="#FFF1C2" strokeWidth="1" />
                    {/* Dimmed Right Click Button */}
                    <path d="M15 2C21.6274 2 27 7.37258 27 14V18H15V2Z" fill="#2B0F14" stroke="#D4A24E" strokeOpacity="0.3" strokeWidth="1" />
                    {/* Scroll Wheel */}
                    <rect x="12.5" y="8" width="3" height="7" rx="1.5" fill="#F5EBDD" />
                  </svg>
                  <div className="w-8 h-8 rounded-lg bg-[#D4A24E]/15 border border-[#D4A24E]/40 flex items-center justify-center text-[#D4A24E] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] block leading-tight mb-1">
                    {language === 'fr' ? 'Ouvrir un projet' : 'Open project'}
                  </span>
                  <span className="text-[11px] text-[#D8C6B6] leading-tight block">
                    {language === 'fr' ? 'Clic gauche sur un livre' : 'Left-click on a book'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
