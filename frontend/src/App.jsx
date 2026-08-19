import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import WelcomePopup from "./components/Interface/WelcomePopup";
import HUD from "./components/Interface/HUD";

// Lazy loading des composants lourds
const Scene = lazy(() => import("./components/Universe/Scene"));
const ProjetsPage = lazy(() => import("./pages/ProjetsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

const LoadingFallback = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', background: '#1e1d1b', color: '#EEE2DF',
    fontFamily: 'Cinzel, serif', fontSize: '1.25rem'
  }}>
    Chargement...
  </div>
);

// Détecte si WebGL est disponible
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

// Bannière mobile affichée sur /projets si redirigée depuis 3D
function MobileBanner({ onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: 'rgba(30, 29, 27, 0.95)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(238, 226, 223, 0.2)', borderRadius: '12px',
      padding: '14px 20px', maxWidth: '90vw', width: '380px',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#EEE2DF', fontFamily: 'Cinzel, serif', fontSize: '12px', fontWeight: 'bold', margin: 0, letterSpacing: '0.05em' }}>
          Mode interactif indisponible
        </p>
        <p style={{ color: '#8A897C', fontSize: '11px', margin: '4px 0 0 0', lineHeight: '1.4' }}>
          La bibliothèque 3D requiert un navigateur desktop. Voici le catalogue complet.
        </p>
      </div>
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', color: '#8A897C', cursor: 'pointer',
        fontSize: '18px', lineHeight: 1, padding: '4px', flexShrink: 0
      }} aria-label="Fermer">×</button>
    </div>
  );
}

// Gestion redirection mobile
function MobileRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const webgl = isWebGLAvailable();
    if ((isMobile || !webgl) && location.pathname === '/') {
      navigate('/projets', { replace: true });
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;
  return <MobileBanner onDismiss={() => setShowBanner(false)} />;
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        {/* Universal Sticky Top Bar across all views */}
        <HUD />
        
        <WelcomePopup />
        <MobileRedirect />
        
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
        
        <Routes>
          <Route path="/" element={null} />
          <Route path="projets" element={
            <Suspense fallback={<LoadingFallback />}>
              <ProjetsPage />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingFallback />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="privacy" element={
            <Suspense fallback={<LoadingFallback />}>
              <PrivacyPage />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
