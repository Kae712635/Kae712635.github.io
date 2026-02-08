// src/pages/NavbarApp.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";

function NavbarApp() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 bg-dark/95 backdrop-blur-sm border-b border-rose/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/images/Logo_base.png"
            className="h-8"
            alt="Klervi Choblet Logo"
          />
          <span className="font-bold text-cream hidden sm:inline">Klervi Choblet</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-cream/90 hover:text-rose transition-colors font-medium ${
              location.pathname === "/" || location.pathname === "/projets" ? "text-cream font-bold" : ""
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/projets"
            className={`text-cream/90 hover:text-rose transition-colors font-medium ${
              location.pathname === "/" || location.pathname === "/projets" ? "text-cream font-bold" : ""
            }`}
          >
            Portfolio
          </Link>
          <Link
            to="/contact"
            className="px-4 py-2 rounded-xl bg-rose hover:bg-rose-dark text-cream transition-all duration-300 font-semibold"
          >
            Contact
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-cream hover:text-rose transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-rose/20 bg-dark/95">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className={`text-cream/90 hover:text-rose transition-colors font-medium ${
                location.pathname === "/" || location.pathname === "/projets" ? "text-cream font-bold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/projets"
              className={`text-cream/90 hover:text-rose transition-colors font-medium ${
                location.pathname === "/" || location.pathname === "/projets" ? "text-cream font-bold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-xl bg-rose hover:bg-rose-dark text-cream transition-all duration-300 font-semibold text-center"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarApp;