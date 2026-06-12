import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";

// Lazy loading des composants lourds
const Scene = lazy(() => import("./components/Universe/Scene"));
const ProjetsPage = lazy(() => import("./pages/ProjetsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

// Composant de chargement simple
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#0a0502',
    color: '#D4AF37',
    fontFamily: 'Cinzel, serif',
    fontSize: '1.5rem'
  }}>
    Chargement...
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
        {/* 
          For the immersive 3D version, we might not need standard Routes immediately visible.
          Content will be superimposed or part of the 3D scene.
          We keep Routes for direct linking or overlays if needed, but remove the Layout (Navbar/Footer).
        */}
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
