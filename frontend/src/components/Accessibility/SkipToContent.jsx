import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SkipToContent() {
  const { t, language } = useLanguage();

  const getTranslation = (key, fallback) => {
    try {
      return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
    } catch {
      return fallback;
    }
  };

  const handleSkip = (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content') || document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only"
    >
      {getTranslation('skipToContent', language === 'fr' ? 'Aller au contenu principal' : 'Skip to main content')}
    </a>
  );
}
