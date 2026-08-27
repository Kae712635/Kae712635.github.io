import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function LibraryHintLegend() {
  const location = useLocation();
  const { language } = useLanguage();
  const { isReducedMotion } = useAccessibility();

  // State: 'expanded' (first 14s) -> 'compact' (discreet corner badge) | 'hidden'
  const [mode, setMode] = useState('expanded');

  // Only show on 3D library page ('/')
  const is3DPage = location.pathname === '/';

  useEffect(() => {
    if (!is3DPage) return;

    // Transition from expanded to compact after 13 seconds
    const timer = setTimeout(() => {
      setMode((prev) => (prev === 'expanded' ? 'compact' : prev));
    }, 13000);

    return () => clearTimeout(timer);
  }, [is3DPage]);

  if (!is3DPage || mode === 'hidden') return null;

  return (
    <div
      className="fixed z-[85] pointer-events-auto select-none transition-all"
      style={{
        bottom: mode === 'expanded' ? '28px' : '20px',
        left: mode === 'expanded' ? '50%' : '20px',
        transform: mode === 'expanded' ? 'translateX(-50%)' : 'none',
      }}
      role="complementary"
      aria-label={language === 'fr' ? "Indicateur d'interactivité 3D" : "3D Interactivity Indicator"}
    >
      <AnimatePresence mode="wait">
        {mode === 'expanded' ? (
          <motion.div
            key="legend-expanded"
            initial={{ opacity: 0, y: isReducedMotion ? 0 : 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isReducedMotion ? 0 : 10, scale: 0.95 }}
            transition={{ duration: isReducedMotion ? 0 : 0.35, ease: 'easeOut' }}
            className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#1E0A0E]/95 border border-[#FFD700]/60 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(255,215,0,0.25)] backdrop-blur-md text-[#F5EBDD] max-w-[92vw]"
          >
            {/* Animated sparkle emblem */}
            <span
              className="text-sm sm:text-base animate-pulse shrink-0"
              role="img"
              aria-label="Sparkle"
            >
              ✨
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 text-[11px] sm:text-xs font-cinzel">
              <span className="font-bold text-[#FFD700] tracking-wide whitespace-nowrap">
                {language === 'fr'
                  ? 'Livres dorés'
                  : 'Golden books'}
              </span>
              <span className="text-[#D8C6B6] hidden sm:inline">•</span>
              <span className="text-[#F5EBDD] whitespace-nowrap">
                {language === 'fr'
                  ? 'Ouvrages interactifs'
                  : 'Interactive books'}
              </span>
              <span className="text-[#D4A24E]/70 text-[10px] hidden md:inline ml-1 tracking-wider">
                {language === 'fr' ? '(1-5 pour naviguer)' : '(Keys 1-5 to navigate)'}
              </span>
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setMode('compact')}
              className="ml-1 p-1 rounded-full text-[#D8C6B6] hover:text-[#FFD700] hover:bg-white/10 transition-colors text-xs flex items-center justify-center cursor-pointer"
              title={language === 'fr' ? 'Réduire la légende' : 'Minimize legend'}
              aria-label={language === 'fr' ? 'Réduire' : 'Minimize'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="4 14 12 6 20 14" />
              </svg>
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="legend-compact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: isReducedMotion ? 0 : 0.25 }}
            onClick={() => setMode('expanded')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E0A0E]/90 hover:bg-[#1E0A0E] border border-[#FFD700]/40 hover:border-[#FFD700] shadow-[0_6px_20px_rgba(0,0,0,0.7)] backdrop-blur-md text-[#F5EBDD] text-xs font-cinzel tracking-wider group cursor-pointer transition-all"
            title={language === 'fr' ? 'Afficher les indications 3D' : 'Show 3D hints'}
          >
            <span className="text-sm text-[#FFD700] group-hover:scale-110 transition-transform">
              ✨
            </span>
            <span className="font-medium text-[#D8C6B6] group-hover:text-[#FFD700] transition-colors">
              {language === 'fr' ? 'Livres cliquables' : 'Clickable books'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
