import React, { createContext, useContext, useState, useEffect } from "react";
import {
  translations,
  categoryToTranslationKey,
  STORAGE_KEY,
  LANGUAGE_OPTIONS,
} from "../translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) return saved;
    } catch (_) {}
    return "fr";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      if (document.documentElement) document.documentElement.lang = lang;
    } catch (_) {}
  }, [lang]);

  const setLang = (code) => {
    if (translations[code]) setLangState(code);
  };

  const t = translations[lang] || translations.fr;

  const tCategory = (categoryKey) => {
    const key = categoryToTranslationKey[categoryKey];
    return (t.filters && key && t.filters[key]) || categoryKey;
  };

  const value = {
    lang,
    setLang,
    t,
    tCategory,
    languageOptions: LANGUAGE_OPTIONS,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
