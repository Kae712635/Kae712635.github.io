import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import NavigationHelpModal from './NavigationHelpModal';
import AccessibilityModal from './AccessibilityModal';

export default function FloatingAccessBar() {
  const { t, language } = useLanguage();
  const { preferences } = useAccessibility();

  const [isNavHelpOpen, setIsNavHelpOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);

  const navHelpBtnRef = useRef(null);
  const a11yBtnRef = useRef(null);

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  // Check if custom accessibility options are currently active
  const hasActiveA11ySettings = preferences.fontSize !== 'normal' ||
    preferences.lineSpacing !== 'normal' ||
    preferences.letterSpacing !== 'normal' ||
    preferences.highContrast ||
    preferences.grayscale ||
    preferences.readableFont ||
    preferences.reducedMotion ||
    preferences.largeCursor ||
    preferences.simplifiedReading;

  return (
    <>
      {/* Floating Action Buttons Container (Fixed bottom-right across all devices) */}
      <aside 
        aria-label={language === 'fr' ? "Outils d'accessibilité et d'aide" : "Accessibility and Help tools"} 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex items-center gap-2.5 sm:gap-3"
      >
        
        {/* 1. Bouton "Aide à la navigation 3D" */}
        <button
          ref={navHelpBtnRef}
          type="button"
          onClick={() => setIsNavHelpOpen(true)}
          aria-label={getTranslation('a11yNavHelpBtn', 'Ouvrir l’aide de navigation 3D')}
          aria-haspopup="dialog"
          aria-expanded={isNavHelpOpen}
          className="h-12 min-w-12 px-3 sm:px-4 rounded-full bg-[#1E0A0E]/95 border border-[#D4A24E]/40 hover:border-[#D4A24E] hover:bg-[#A6303B]/30 text-[#F5EBDD] shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all flex items-center justify-center gap-2 text-xs font-cinzel font-bold tracking-wider uppercase group focus-visible:outline-none cursor-pointer"
        >
          <svg className="w-5 h-5 text-[#D4A24E] group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span className="hidden md:inline whitespace-nowrap">
            {language === 'fr' ? 'Aide 3D' : '3D Help'}
          </span>
        </button>

        {/* 2. Bouton "Accessibilité" */}
        <button
          ref={a11yBtnRef}
          type="button"
          onClick={() => setIsA11yOpen(true)}
          aria-label={getTranslation('a11ySettingsBtn', 'Ouvrir les options d’accessibilité')}
          aria-haspopup="dialog"
          aria-expanded={isA11yOpen}
          className={`h-12 min-w-12 px-3 sm:px-4 rounded-full border shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all flex items-center justify-center gap-2 text-xs font-cinzel font-bold tracking-wider uppercase group focus-visible:outline-none relative cursor-pointer ${
            hasActiveA11ySettings 
              ? 'bg-[#A6303B] text-white border-[#A6303B]' 
              : 'bg-[#1E0A0E]/95 border-[#D4A24E]/40 hover:border-[#A6303B] hover:bg-[#A6303B]/30 text-[#F5EBDD]'
          }`}
        >
          {/* Universal Accessibility Icon */}
          <svg className="w-5 h-5 text-[#F5EBDD] group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M19 13v-2a7 7 0 0 0-14 0v2"/>
            <path d="M12 11v8"/>
            <path d="M8 21l4-4 4 4"/>
          </svg>

          <span className="hidden md:inline whitespace-nowrap">
            {language === 'fr' ? 'Accessibilité' : 'Accessibility'}
          </span>

          {/* Active Settings Badge Indicator */}
          {hasActiveA11ySettings && (
            <span 
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4A24E] rounded-full border-2 border-[#1E0A0E]" 
              title={language === 'fr' ? 'Options d’accessibilité actives' : 'Active accessibility options'}
              aria-hidden="true"
            />
          )}
        </button>

      </aside>

      {/* Navigation Help Modal */}
      <NavigationHelpModal
        isOpen={isNavHelpOpen}
        onClose={() => setIsNavHelpOpen(false)}
        triggerRef={navHelpBtnRef}
      />

      {/* Accessibility Options Panel Modal */}
      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
        triggerRef={a11yBtnRef}
      />
    </>
  );
}
