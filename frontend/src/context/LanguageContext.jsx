import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../data/translations';

const LanguageContext = createContext();

export const languageOptions = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_lang');
      return saved === 'en' || saved === 'fr' ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });

  const setLanguage = (langCode) => {
    const valid = langCode === 'en' ? 'en' : 'fr';
    setLanguageState(valid);
    try {
      localStorage.setItem('portfolio_lang', valid);
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const t = (key, fallback) => {
    if (typeof key === 'object' && key !== null) {
      return key[language] || key.fr || key.en || fallback || '';
    }
    return (translations[language] && translations[language][key]) || fallback || key;
  };

  const lang = language;
  const setLang = setLanguage;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, lang, setLang, toggleLanguage, languageOptions, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
