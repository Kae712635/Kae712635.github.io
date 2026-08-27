import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import WelcomePopup from "./components/Interface/WelcomePopup";
import HUD from "./components/Interface/HUD";
import LibraryHintLegend from "./components/Interface/LibraryHintLegend";
import SkipToContent from "./components/Accessibility/SkipToContent";
import FloatingAccessBar from "./components/Accessibility/FloatingAccessBar";

// Lazy loading des composants lourds
const Scene = lazy(() => import("./components/Universe/Scene"));
const ProjetsPage = lazy(() => import("./pages/ProjetsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

const LoadingFallback = () => (
  <div 
    role="status" 
    aria-live="polite"
    style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: '#2B0F14', color: '#F5EBDD',
      fontFamily: 'Cinzel, serif', fontSize: '1.25rem'
    }}
  >
    Chargement du portfolio...
  </div>
);

function MainContent() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && location.pathname === '/') {
        navigate('/projets', { replace: true });
      }
    };
    window.addEventListener('resize', handleResize);
    if (window.innerWidth < 768 && location.pathname === '/') {
      navigate('/projets', { replace: true });
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname, navigate]);

  return (
    <>
      {/* Skip link for keyboard and screen reader accessibility */}
      <SkipToContent />

      {/* Universal Sticky Top Bar across all views */}
      <HUD />
      
      <WelcomePopup />
      
      {/* 3D Scene rendered ONLY on Desktop / Laptop (Inaccessible & Unmounted on Mobile) */}
      {!isMobile && (
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      )}
      
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

      {/* Floating 3D Hints (Desktop only) */}
      {!isMobile && <LibraryHintLegend />}
      <FloatingAccessBar />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <MainContent />
        </BrowserRouter>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;
