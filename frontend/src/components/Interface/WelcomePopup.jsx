import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const firstActionRef = useRef(null);
  const closeBtnRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    sessionStorage.setItem('portfolio_welcome_session', 'true');
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
        >
          {/* Backdrop with click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={closePopup}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: isReducedMotion ? 0 : 10, scale: isReducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isReducedMotion ? 0 : 8, scale: isReducedMotion ? 1 : 0.96 }}
            transition={{ duration: isReducedMotion ? 0 : 0.2 }}
            className="relative w-full max-w-[480px] bg-[#2B0F14] border border-[#D4A24E]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col text-[#F5EBDD] overflow-hidden my-auto"
          >
            {/* Centered Header */}
            <header className="relative px-5 py-3.5 sm:py-4 border-b border-[#D4A24E]/20 bg-[#1E0A0E] text-center shrink-0">
              <h2 
                id="welcome-modal-title"
                className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-[0.15em] text-[#D4A24E] leading-tight"
              >
                Portfolio · Klervi Choblet
              </h2>

              {/* Close button */}
              <button
                ref={closeBtnRef}
                onClick={closePopup}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 rounded-lg text-[#D8C6B6] hover:text-[#F5EBDD] hover:bg-white/10 transition-colors border border-transparent hover:border-[#D4A24E]/40 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                aria-label={getTranslation('a11yClose', 'Fermer la fenêtre')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>

            {/* Interactive Cards */}
            <div className="p-3.5 sm:p-4 space-y-2.5 flex-1">
              
              {/* Option 1: Bibliothèque 3D (Primary Highlight - Or) */}
              <button
                ref={firstActionRef}
                type="button"
                onClick={handleEnter3D}
                className="w-full p-3 sm:p-3.5 rounded-xl bg-[#D4A24E]/20 hover:bg-[#D4A24E]/30 border border-[#D4A24E] transition-all group flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#D4A24E] cursor-pointer shadow-[0_0_15px_rgba(212,162,78,0.15)]"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4A24E] text-[#1E0A0E] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-center text-center min-w-0">
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] group-hover:text-white transition-colors truncate">
                    {getTranslation('popupCard3DTitle', 'Bibliothèque 3D')}
                  </span>
                </div>
                <div className="w-8 flex justify-end text-[#D4A24E] group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

              {/* Option 2: Site Web Classique 2D */}
              <button
                type="button"
                onClick={handleExplore2D}
                className="w-full p-3 sm:p-3.5 rounded-xl bg-[#1E0A0E] hover:bg-[#A6303B]/20 border border-[#A6303B]/40 hover:border-[#A6303B] transition-all group flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#D4A24E] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#A6303B]/20 text-[#E07A84] border border-[#A6303B]/40 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-center text-center min-w-0">
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#F5EBDD] group-hover:text-white transition-colors truncate">
                    {getTranslation('popupCard2DTitle', 'Site Web Classique')}
                  </span>
                </div>
                <div className="w-8 flex justify-end text-[#A6303B] group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

              {/* Option 3: Me Contacter */}
              <button
                type="button"
                onClick={handleContact}
                className="w-full p-3 sm:p-3.5 rounded-xl bg-[#1E0A0E] hover:bg-[#3C6E71]/15 border border-[#3C6E71]/40 hover:border-[#3C6E71] transition-all group flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#D4A24E] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3C6E71]/20 text-[#3C6E71] border border-[#3C6E71]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-center text-center min-w-0">
                  <span className="font-cinzel font-bold text-xs sm:text-sm text-[#3C6E71] group-hover:text-[#5E9FA2] transition-colors truncate">
                    {getTranslation('popupCardContactTitle', 'Contact Direct')}
                  </span>
                </div>
                <div className="w-8 flex justify-end text-[#3C6E71] group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
