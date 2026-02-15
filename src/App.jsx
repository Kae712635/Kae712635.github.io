import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import Layout from "./components/Layout"; // Removed for immersive view
import HomePage from "./pages/HomePage";
import ProjetsPage from "./pages/ProjetsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import Scene from "./components/Universe/Scene";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Scene />
        {/* 
          For the immersive 3D version, we might not need standard Routes immediately visible.
          Content will be superimposed or part of the 3D scene.
          We keep Routes for direct linking or overlays if needed, but remove the Layout (Navbar/Footer).
        */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="projets" element={<ProjetsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
