// src/pages/FooterApp.jsx
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

const FooterApp = () => {
  return (
    <Footer className="rounded-none bg-dark-secondary text-text-light border-t border-gray-800">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
        <section className="text-center py-6">
          <h2 className="mb-2 text-3xl font-semibold tracking-tight md:text-5xl lg:text-6xl text-primary-accent">
            Klervi Choblet
          </h2>
          <p className="text-lg leading-relaxed text-gray-400 md:text-xl">
            Développeuse Full-stack et Ingénieure Systèmes
          </p>
        </section>

        <div className="w-full text-center">
          <div className="flex justify-center space-x-6 my-4 text-2xl">
            <a 
              href="https://www.linkedin.com/in/klervi-choblet-361720244/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-accent hover:text-secondary-accent transition-colors"
              aria-label="LinkedIn Profile"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a 
              href="https://github.com/Kae712635" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-accent hover:text-secondary-accent transition-colors"
              aria-label="GitHub Profile"
            >
              <i className="fab fa-github-square"></i>
            </a>
          </div>
          
          <Footer.LinkGroup className="flex justify-center w-full mt-4 space-x-4">
            <Link to="/" className="text-gray-400 hover:text-primary-accent transition-colors">Accueil</Link>
            <Link to="/portfolio" className="text-gray-400 hover:text-primary-accent transition-colors">Portfolio</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-primary-accent transition-colors">Mentions Légales</Link>
            <Link to="/contact" className="text-gray-400 hover:text-primary-accent transition-colors">Contact</Link>
          </Footer.LinkGroup>

          <Footer.Divider className="my-6 border-gray-700" />
          <p className="text-sm text-gray-500">© 2024 Klervi Choblet. Tous droits réservés.</p>
        </div>
      </div>
    </Footer>
  );
};

export default FooterApp;