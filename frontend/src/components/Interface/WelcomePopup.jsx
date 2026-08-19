import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key) : (t[key] || fallback);
    } catch (e) {
      return fallback;
    }
  };

  useEffect(() => {
    const isClosedLocal = localStorage.getItem('portfolio_welcome_closed');
    const isClosedSession = sessionStorage.getItem('portfolio_welcome_session');
    
    if (!isClosedLocal && !isClosedSession) {
      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closePopup();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    if (dontShowAgain) {
      localStorage.getItem('portfolio_welcome_closed') || localStorage.setItem('portfolio_welcome_closed', 'true');
    } else {
      sessionStorage.setItem('portfolio_welcome_session', 'true');
    }
  };

  const handleEnter3D = () => {
    closePopup();
  };

  const handleExplore2D = () => {
    closePopup();
    navigate('/projets');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          {/* Overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 8, 6, 0.75)', backdropFilter: 'blur(12px)' }}
            onClick={closePopup}
          />

          {/* Card */}
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: '38rem',
              background: '#15100c',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 20px rgba(212, 175, 55, 0.1)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              color: '#EEE2DF'
            }}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none',
                color: '#8A897C', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex'
              }}
              aria-label="Fermer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{ padding: '2rem 2.25rem' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#D4AF37', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>
                  Portfolio Klervi Choblet
                </span>
                <h2 
                  id="welcome-title"
                  style={{ fontFamily: 'Cinzel, serif', color: '#EEE2DF', fontSize: '1.65rem', margin: '0.35rem 0 0.5rem 0', fontWeight: '700' }}
                >
                  {getTranslation('popupWelcomeTitle', language === 'fr' ? 'Bienvenue sur mon Portfolio' : 'Welcome to my Portfolio')}
                </h2>
                <div style={{ width: '4rem', height: '1px', backgroundColor: 'rgba(212, 175, 55, 0.4)', margin: '0.5rem auto' }}></div>
                <p style={{ fontSize: '0.925rem', color: '#8A897C', lineHeight: 1.5, margin: 0, maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
                  {getTranslation('popupWelcomeSub', language === 'fr' 
                    ? 'Choisissez le mode de visite qui vous convient le mieux.' 
                    : 'Choose your preferred viewing experience.')}
                </p>
              </div>

              {/* 2 Choice Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                
                {/* Mode 3D */}
                <div 
                  onClick={handleEnter3D}
                  style={{
                    background: 'rgba(65, 93, 67, 0.12)',
                    border: '1px solid rgba(65, 93, 67, 0.5)',
                    borderRadius: '0.85rem',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(65, 93, 67, 0.22)';
                    e.currentTarget.style.borderColor = '#415D43';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(65, 93, 67, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(65, 93, 67, 0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#415D43', marginBottom: '8px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                      <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>
                        {getTranslation('popupCard3DTitle', language === 'fr' ? 'Bibliothèque 3D' : '3D Library')}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#EEE2DF', lineHeight: '1.45', margin: 0, opacity: 0.9 }}>
                      {getTranslation('popupCard3DDesc', language === 'fr' 
                        ? 'Navigation immersive dans une grande bibliothèque interactive. Déplacement ZQSD/flèches, livres et rayons cliquables.'
                        : 'Immersive exploration of an interactive 3D hall with navigable aisles, clickable books & plaques.')}
                    </p>
                  </div>
                  <button 
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      padding: '0.65rem',
                      background: '#415D43',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(65, 93, 67, 0.4)'
                    }}
                  >
                    {getTranslation('popupEnter3D', language === 'fr' ? 'Entrer en 3D' : 'Enter 3D')}
                  </button>
                </div>

                {/* Mode 2D */}
                <div 
                  onClick={handleExplore2D}
                  style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '0.85rem',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.16)';
                    e.currentTarget.style.borderColor = '#D4AF37';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', marginBottom: '8px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                      </svg>
                      <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', fontSize: '1rem', margin: 0, fontWeight: 'bold' }}>
                        {getTranslation('popupCard2DTitle', language === 'fr' ? 'Catalogue 2D' : '2D Catalog')}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#EEE2DF', lineHeight: '1.45', margin: 0, opacity: 0.9 }}>
                      {getTranslation('popupCard2DDesc', language === 'fr' 
                        ? 'Accès direct et rapide sous forme de catalogue web. Filtrage fluide par catégories, CV téléchargeable et contact.'
                        : 'Fast 2D catalog with category filters, instant resume access, and clean direct contact form.')}
                    </p>
                  </div>
                  <button 
                    style={{
                      marginTop: '1.25rem',
                      width: '100%',
                      padding: '0.65rem',
                      background: 'transparent',
                      border: '1px solid #D4AF37',
                      borderRadius: '0.5rem',
                      color: '#D4AF37',
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      cursor: 'pointer'
                    }}
                  >
                    {getTranslation('popupEnter2D', language === 'fr' ? 'Consulter le Catalogue' : 'View Catalog')}
                  </button>
                </div>

              </div>

              {/* Checkbox Don't show again */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#8A897C' }}>
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    style={{ accentColor: '#D4AF37', cursor: 'pointer' }}
                  />
                  <span>{getTranslation('dontShowAgain', language === 'fr' ? 'Ne plus afficher au démarrage' : 'Do not show again')}</span>
                </label>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
