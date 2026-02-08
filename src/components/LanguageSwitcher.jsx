import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
export default function LanguageSwitcher() {
  const { lang, setLang, t, languageOptions } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = languageOptions.find((o) => o.code === lang) || languageOptions[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-cream/90 hover:text-rose hover:bg-rose/10 transition-colors text-sm font-medium"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t.nav.language}
        title={t.nav.language}
      >
        <span className="w-5 h-5 flex items-center justify-center border border-current rounded text-xs uppercase">
          {lang}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute right-0 top-full mt-1 py-1 min-w-[10rem] rounded-xl bg-dark border border-rose/20 shadow-xl z-30"
          role="listbox"
        >
          {languageOptions.map((option) => (
            <li key={option.code} role="option" aria-selected={lang === option.code}>
              <button
                type="button"
                onClick={() => {
                  setLang(option.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  lang === option.code
                    ? "text-rose font-semibold bg-rose/10"
                    : "text-cream/90 hover:text-rose hover:bg-rose/5"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
