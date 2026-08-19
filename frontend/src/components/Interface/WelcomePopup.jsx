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
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
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
      localStorage.setItem('portfolio_welcome_closed', 'true');
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

  const handleContact = () => {
    closePopup();
    navigate('/projets?tab=contact');
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
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 8, 6, 0.85)', backdropFilter: 'blur(12px)' }}
            onClick={closePopup}
          />

          {/* Card Modal */}
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: '48rem',
              background: '#1e1d1b',
              border: '1px solid rgba(238, 226, 223, 0.18)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 25px rgba(65, 93, 67, 0.15)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              color: '#EEE2DF'
            }}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none',
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
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#D4AF37', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>
                  Portfolio · Klervi Choblet
                </span>
                <h2 
                  id="welcome-title"
                  style={{ fontFamily: 'Cinzel, serif', color: '#EEE2DF', fontSize: '1.65rem', margin: '0.35rem 0 0.5rem 0', fontWeight: '700' }}
                >
                  {getTranslation('popupWelcomeTitle', language === 'fr' ? 'Bienvenue sur mon Portfolio' : 'Welcome to my Portfolio')}
                </h2>
                <div style={{ width: '4rem', height: '1px', backgroundColor: 'rgba(212, 175, 55, 0.5)', margin: '0.5rem auto' }}></div>
                <p style={{ fontSize: '0.9rem', color: '#8A897C', lineHeight: 1.5, margin: 0, maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto' }}>
                  {getTranslation('popupWelcomeSub', language === 'fr' 
                    ? "Découvrez mes réalisations d'ingénierie logicielle, mon parcours et mes compétences techniques." 
                    : 'Discover my software engineering projects, background, and technical capabilities.')}
                </p>
              </div>

              {/* 3 Purely Descriptive Encadrés / Cards (No redundant individual action buttons) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                
                {/* 1. Site Web 2D */}
                <div 
                  style={{
                    background: 'rgba(65, 93, 67, 0.1)',
                    border: '1px solid rgba(65, 93, 67, 0.4)',
                    borderRadius: '0.75rem',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#415D43" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                    <h3 style={{ fontFamily: 'Cinzel, serif', color: '#EEE2DF', fontSize: '0.95rem', margin: 0, fontWeight: 'bold' }}>
                      {getTranslation('popupCard2DTitle', language === 'fr' ? 'Site Web (2D)' : 'Website (2D)')}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#8A897C', lineHeight: '1.45', margin: 0 }}>
                    {getTranslation('popupCard2DDesc', language === 'fr' 
                      ? 'Catalogue direct et fluide. Consultation instantanée des 5 projets phares, compétences et CV synthétique.'
                      : 'Direct and fast 2D view. Quick access to the 5 core projects, skills breakdown, and downloadable resume.')}
                  </p>
                </div>

                {/* 2. Bibliothèque 3D */}
                <div 
                  style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '0.75rem',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                      <line x1="12" y1="22.08" x2="12" y2="12"/>
                    </svg>
                    <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', fontSize: '0.95rem', margin: 0, fontWeight: 'bold' }}>
                      {getTranslation('popupCard3DTitle', language === 'fr' ? 'Bibliothèque 3D' : '3D Library')}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#8A897C', lineHeight: '1.45', margin: 0 }}>
                    {getTranslation('popupCard3DDesc', language === 'fr' 
                      ? 'Visite spatiale immersive. Rayons navigables, livres 3D cliquables et fiches projets interactives.'
                      : 'Immersive spatial exploration. Interactive shelves, clickable 3D books, and animated project flipbooks.')}
                  </p>
                </div>

                {/* 3. Contact Direct */}
                <div 
                  style={{
                    background: 'rgba(179, 106, 94, 0.1)',
                    border: '1px solid rgba(179, 106, 94, 0.4)',
                    borderRadius: '0.75rem',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B36A5E" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <h3 style={{ fontFamily: 'Cinzel, serif', color: '#B36A5E', fontSize: '0.95rem', margin: 0, fontWeight: 'bold' }}>
                      {getTranslation('popupCardContactTitle', language === 'fr' ? 'Contact Direct' : 'Direct Contact')}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#8A897C', lineHeight: '1.45', margin: 0 }}>
                    {getTranslation('popupCardContactDesc', language === 'fr' 
                      ? 'Formulaire direct pour échanger sur vos opportunités, projets logiciels ou questions techniques.'
                      : 'Direct form to discuss software opportunities, projects, or technical collaborations.')}
                  </p>
                </div>

              </div>

              {/* Unique Recap Action Box with the 3 Distinct Actions */}
              <div 
                style={{
                  background: 'rgba(21, 16, 12, 0.9)',
                  border: '1px solid rgba(138, 137, 124, 0.3)',
                  borderRadius: '0.85rem',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
              >
                {/* Action 1: Site Web */}
                <button
                  onClick={handleExplore2D}
                  style={{
                    flex: '1 1 180px',
                    padding: '0.75rem 1rem',
                    background: '#415D43',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(65, 93, 67, 0.35)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2E4330'}
                  onMouseLeave={e => e.currentTarget.style.background = '#415D43'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                  </svg>
                  {getTranslation('popupEnter2D', language === 'fr' ? 'Accéder au Site Web' : 'Enter Website')}
                </button>

                {/* Action 2: Bibliothèque 3D */}
                <button
                  onClick={handleEnter3D}
                  style={{
                    flex: '1 1 180px',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: '1px solid #D4AF37',
                    borderRadius: '0.5rem',
                    color: '#D4AF37',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  {getTranslation('popupEnter3D', language === 'fr' ? 'Explorer la Bibliothèque 3D' : 'Explore 3D Library')}
                </button>

                {/* Action 3: Contact */}
                <button
                  onClick={handleContact}
                  style={{
                    flex: '1 1 160px',
                    padding: '0.75rem 1rem',
                    background: '#B36A5E',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(179, 106, 94, 0.35)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#8A4C43'}
                  onMouseLeave={e => e.currentTarget.style.background = '#B36A5E'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {getTranslation('popupEnterContact', language === 'fr' ? 'Me Contacter' : 'Contact Me')}
                </button>
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
                  <span>{getTranslation('dontShowAgain', language === 'fr' ? 'Ne plus afficher au démarrage' : 'Do not show again on startup')}</span>
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
