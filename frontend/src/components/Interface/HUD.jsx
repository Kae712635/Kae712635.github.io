import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileCard from './ProfileCard';

const HUD = () => {
    const { t, language, setLanguage } = useLanguage();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isProjetsPage = location.pathname === '/projets';

    const getTranslation = (key, fallback) => {
        try {
            return typeof t === 'function' ? t(key, fallback) : (t[key] || fallback);
        } catch (e) {
            return fallback;
        }
    };

    const handleNavigateContact = () => {
        if (isProjetsPage) {
            const contactSection = document.getElementById('contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/projets?tab=contact');
        }
    };

    return (
        <>
            {/* STICKY TOP BAR - ALWAYS MOUNTED & VISIBLE */}
            <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-6 py-3 bg-[#1E0A0E]/95 backdrop-blur-lg border-b border-[#D4A24E]/20 shadow-sm" style={{ pointerEvents: 'auto' }}>
                {/* Left: View toggle (Site Web / Bibliothèque) */}
                <div className="flex items-center gap-2 z-10">
                    <button
                        onClick={() => navigate(isProjetsPage ? '/' : '/projets')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4A24E]/30 text-[#D8C6B6] hover:text-[#F5EBDD] hover:border-[#A6303B] hover:bg-[#A6303B]/20 transition-all text-xs font-cinzel tracking-widest uppercase group cursor-pointer"
                        title={isProjetsPage ? getTranslation('showLibraryTooltip', 'Afficher la bibliothèque 3D interactive') : getTranslation('hideLibraryTooltip', 'Afficher uniquement le site web / Masquer la bibliothèque')}
                        aria-label={isProjetsPage ? getTranslation('libraryView', 'Bibliothèque 3D') : getTranslation('catalogueView', 'Site Web (2D)')}
                    >
                        <svg className="w-4 h-4 text-[#A6303B] group-hover:text-[#F5EBDD] transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isProjetsPage ? (
                                <polyline points="15 18 9 12 15 6"></polyline>
                            ) : (
                                <>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="3" y1="9" x2="21" y2="9"/>
                                    <line x1="9" y1="21" x2="9" y2="9"/>
                                </>
                            )}
                        </svg>
                        <span className="font-semibold">
                            {isProjetsPage 
                                ? (language === 'fr' ? 'Bibliothèque 3D' : '3D Library') 
                                : (language === 'fr' ? 'Site Web (2D)' : 'Website (2D)')}
                        </span>
                    </button>
                </div>

                {/* Center: identity - Mathematically centered in viewport with absolute position */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center select-none">
                    <span className="font-cinzel text-[#F5EBDD] text-xs sm:text-sm md:text-base tracking-[0.18em] uppercase font-bold whitespace-nowrap">
                        Klervi Choblet
                    </span>
                </div>

                {/* Right: discrete actions & links */}
                <div className="flex items-center gap-2 sm:gap-3 z-10">
                    {/* Discrete Language Switcher */}
                    <button
                        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                        className="px-2.5 py-1 text-xs font-cinzel text-[#D8C6B6] hover:text-[#F5EBDD] hover:border-[#D4A24E] border border-[#D4A24E]/30 rounded uppercase transition-colors cursor-pointer"
                        title={getTranslation('languageSwitchTitle', language === 'fr' ? 'Switch to English' : 'Passer en Français')}
                        aria-label="Changer de langue"
                    >
                        {language === 'fr' ? 'FR' : 'EN'}
                    </button>

                    <span className="text-[#D4A24E]/30 hidden sm:inline" aria-hidden>|</span>

                    <a
                        href="https://github.com/Kae712635/"
                        target="_blank" rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-[#D8C6B6] hover:text-[#F5EBDD] transition-colors text-xs font-cinzel tracking-wider uppercase"
                        title="GitHub"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        <span className="hidden md:inline">GitHub</span>
                    </a>

                    <span className="text-[#D4A24E]/30 hidden sm:inline" aria-hidden>|</span>

                    <a
                        href="/documents/CV_Klervi_Choblet.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#D8C6B6] hover:text-[#F5EBDD] transition-colors text-xs font-cinzel tracking-wider uppercase"
                        title={getTranslation('downloadPdf', 'Télécharger CV')}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span>CV</span>
                    </a>

                    <span className="text-[#D4A24E]/30" aria-hidden>|</span>

                    <button
                        onClick={handleNavigateContact}
                        className="flex items-center gap-1.5 text-[#3C6E71] hover:text-[#F5EBDD] hover:bg-[#3C6E71]/25 px-2.5 py-1 rounded border border-[#3C6E71]/50 transition-colors text-xs font-cinzel tracking-wider uppercase font-bold cursor-pointer"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>Contact</span>
                    </button>
                </div>
            </header>

            <ProfileCard isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
};

export default HUD;