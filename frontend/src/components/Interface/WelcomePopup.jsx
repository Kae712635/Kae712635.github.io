import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const modalRef = useRef(null);
  const firstActionRef = useRef(null);
  const closeBtnRef = useRef(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isReducedMotion } = useAccessibility();

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const isClosedLocal = localStorage.getItem('portfolio_welcome_closed');
    const isClosedSession = sessionStorage.getItem('portfolio_welcome_session');
    
    if (!isClosedLocal && !isClosedSession) {
      const timer = setTimeout(() => setIsOpen(true), 350);
      return () => clearTimeout(timer);
    }
  }, []);

  // Focus trap, Escape key, and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prevActiveElement = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus the first action button
    const timer = setTimeout(() => {
      if (firstActionRef.current) {
        firstActionRef.current.focus();
      }
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePopup();
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
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (prevActiveElement && typeof prevActiveElement.focus === 'function') {
        prevActiveElement.focus();
      }
    };
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    if (dontShowAgain) {
      localStorage.setItem('portfolio_welcome_closed', 'true');
    } else {
      sessionStorage.setItem('portfolio_welcome_session', 'true');
    }
  };

  const handleExplore2D = () => {
    closePopup();
    navigate('/projets');
  };

  const handleEnter3D = () => {
    closePopup();
  };

  const handleContact = () => {
    closePopup();
    navigate('/projets?tab=contact');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
          aria-describedby="welcome-modal-desc"
        >
          {/* Backdrop with click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closePopup}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: isReducedMotion ? 0 : 12, scale: isReducedMotion ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isReducedMotion ? 0 : 8, scale: isReducedMotion ? 1 : 0.97 }}
            transition={{ duration: isReducedMotion ? 0 : 0.22 }}
            className="relative w-full max-w-[680px] max-h-[90vh] bg-[#1c1a17] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col text-[#EEE2DF] overflow-hidden my-auto"
          >
            {/* Header compact */}
            <header className="relative px-5 pt-5 pb-3 sm:px-6 sm:pt-6 border-b border-[#8A897C]/20 bg-[#14110f]">
              <div className="pr-10">
                <span className="text-[11px] font-cinzel font-bold uppercase tracking-[0.18em] text-[#D4AF37] block mb-1">
                  Portfolio · Klervi Choblet
                </span>
                <h2 
                  id="welcome-modal-title"
                  className="font-cinzel text-lg sm:text-xl font-bold text-[#EEE2DF] leading-tight"
                >
                  {getTranslation('popupWelcomeTitle', 'Bienvenue sur mon Portfolio')}
                </h2>
                <p 
                  id="welcome-modal-desc"
                  className="text-xs sm:text-sm text-[#D0C7C4] mt-1.5 leading-relaxed font-sans"
                >
                  {getTranslation('popupWelcomeSub', 'Choisissez votre mode d’exploration pour découvrir mes projets et mon parcours.')}
                </p>
              </div>

              {/* Close button */}
              <button
                ref={closeBtnRef}
                onClick={closePopup}
                className="absolute top-4 right-4 p-2.5 rounded-lg text-[#D0C7C4] hover:text-[#EEE2DF] hover:bg-white/10 transition-colors border border-transparent hover:border-[#8A897C]/40 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label={getTranslation('a11yClose', 'Fermer la fenêtre')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>

            {/* Interactive Cards - Direct Clicks (No duplicated bottom buttons) */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 custom-scrollbar flex-1">
              
              {/* Option 1: Site Web Classique 2D (Primary / Action principale) */}
              <button
                ref={firstActionRef}
                type="button"
                onClick={handleExplore2D}
                className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-[#415D43]/20 hover:bg-[#415D43]/30 border-2 border-[#415D43] transition-all group flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#415D43] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="font-cinzel font-bold text-sm sm:text-base text-[#EEE2DF] group-hover:text-white transition-colors">
                      {getTranslation('popupCard2DTitle', 'Site Web Classique')}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#415D43] text-white rounded font-cinzel">
                      {getTranslation('a11yRecommendedBadge', 'Accès direct')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D0C7C4] leading-relaxed font-sans">
                    {getTranslation('popupCard2DDesc', 'Catalogue web 2D rapide. Consultation instantanée des 5 projets phares, compétences et CV.')}
                  </p>
                </div>
                <div className="text-[#415D43] group-hover:translate-x-1 transition-transform self-center shrink-0 hidden sm:block" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

              {/* Option 2: Bibliothèque 3D (Immersive Secondary) */}
              <button
                type="button"
                onClick={handleEnter3D}
                className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-[#14110f] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all group flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cinzel font-bold text-sm sm:text-base text-[#D4AF37] group-hover:text-[#F3E5AB] transition-colors">
                      {getTranslation('popupCard3DTitle', 'Bibliothèque 3D')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D0C7C4] leading-relaxed font-sans">
                    {getTranslation('popupCard3DDesc', 'Navigation spatiale immersive. Rayons navigables, livres 3D cliquables et fiches interactives.')}
                  </p>
                </div>
                <div className="text-[#D4AF37] group-hover:translate-x-1 transition-transform self-center shrink-0 hidden sm:block" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

              {/* Option 3: Me Contacter (Tertiary) */}
              <button
                type="button"
                onClick={handleContact}
                className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-[#14110f] hover:bg-[#B36A5E]/10 border border-[#B36A5E]/40 hover:border-[#B36A5E] transition-all group flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-[#D4AF37] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#B36A5E]/15 text-[#B36A5E] border border-[#B36A5E]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-cinzel font-bold text-sm sm:text-base text-[#B36A5E] group-hover:text-[#D98E82] transition-colors">
                      {getTranslation('popupCardContactTitle', 'Me Contacter')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D0C7C4] leading-relaxed font-sans">
                    {getTranslation('popupCardContactDesc', 'Échanger sur vos opportunités, projets logiciels ou collaborations techniques.')}
                  </p>
                </div>
                <div className="text-[#B36A5E] group-hover:translate-x-1 transition-transform self-center shrink-0 hidden sm:block" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

            </div>

            {/* Footer with "Don't show again" */}
            <footer className="px-5 py-3.5 sm:px-6 border-t border-[#8A897C]/20 bg-[#14110f] flex items-center justify-between flex-wrap gap-3">
              <label 
                htmlFor="dont-show-welcome"
                className="flex items-center gap-2.5 cursor-pointer text-xs text-[#D0C7C4] hover:text-[#EEE2DF] transition-colors select-none"
              >
                <input
                  id="dont-show-welcome"
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-[#8A897C] text-[#D4AF37] accent-[#D4AF37] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                />
                <span>{getTranslation('dontShowAgain', 'Ne plus afficher au démarrage')}</span>
              </label>

              <button
                type="button"
                onClick={closePopup}
                className="text-xs font-cinzel text-[#D0C7C4] hover:text-[#EEE2DF] underline underline-offset-4 cursor-pointer py-1 px-2 focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                {getTranslation('a11yClose', 'Passer')}
              </button>
            </footer>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
