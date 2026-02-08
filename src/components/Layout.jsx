import { Outlet, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import NavbarApp from "../pages/NavbarApp";

export default function Layout() {
  const { t } = useLanguage();

  return (
    <div className="portfolio-container">
      <NavbarApp />

      <main>
        <Outlet />
      </main>

      <footer className="section-dark border-t border-rose/20 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-cream/80 text-sm">
            © {new Date().getFullYear()} Klervi Choblet. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/klervi-choblet-361720244/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/80 hover:text-rose transition-colors"
              aria-label="LinkedIn"
            >
              <span className="font-medium">LinkedIn</span>
            </a>
            <a
              href="https://github.com/Kae712635"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/80 hover:text-rose transition-colors"
              aria-label="GitHub"
            >
              <span className="font-medium">GitHub</span>
            </a>
            <Link
              to="/privacy"
              className="text-cream/80 hover:text-rose transition-colors"
              aria-label="Privacy"
            >
              <span className="font-medium">{t.footer.privacy}</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
