import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileCard from './ProfileCard';
import CVConfirmModal from './CVConfirmModal';

const HUD = () => {
    const { t, language, setLanguage } = useLanguage();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCvConfirmOpen, setIsCvConfirmOpen] = useState(false);
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
            <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-[#1E0A0E]/95 backdrop-blur-lg border-b border-[#D4A24E]/20 shadow-sm" style={{ pointerEvents: 'auto' }}>
                {/* Left: View toggle (Desktop / Tablet only — Inaccessible on mobile) */}
                <div className="hidden md:flex items-center gap-2 z-10">
                    <button
                        onClick={() => navigate(isProjetsPage ? '/' : '/projets')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border transition-all text-xs font-cinzel tracking-wider uppercase group cursor-pointer shadow-sm ${isProjetsPage
                                ? 'border-[#FFD700]/60 bg-[#D4A24E]/15 text-[#F5EBDD] hover:bg-[#D4A24E]/25 hover:border-[#FFD700]'
                                : 'border-[#D4A24E]/30 bg-[#1E0A0E]/80 text-[#D8C6B6] hover:text-[#F5EBDD] hover:border-[#D4A24E]/70 hover:bg-white/5'
                            }`}
                        title={isProjetsPage ? getTranslation('showLibraryTooltip', 'Explorer en bibliothèque 3D interactive') : getTranslation('hideLibraryTooltip', 'Basculer vers la version classique (Catalogue 2D)')}
                        aria-label={isProjetsPage ? getTranslation('libraryView', 'Explorer en 3D ✨') : getTranslation('catalogueView', 'Version Classique')}
                    >
                        <svg className={`w-4 h-4 transition-transform group-hover:scale-105 shrink-0 ${isProjetsPage ? 'text-[#FFD700]' : 'text-[#D4A24E]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isProjetsPage ? (
                                <>
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </>
                            ) : (
                                <>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="9" y1="21" x2="9" y2="9" />
                                </>
                            )}
                        </svg>
                        <span className="font-semibold">
                            {isProjetsPage
                                ? getTranslation('libraryView', 'Explorer en 3D ✨')
                                : getTranslation('catalogueView', 'Version Classique')}
                        </span>
                    </button>
                </div>

                {/* Left Brand on Mobile (When 3D button is hidden) */}
                <div className="md:hidden flex items-center z-10">
                    <span className="font-cinzel text-[#F5EBDD] text-xs font-bold tracking-[0.14em] uppercase">
                        Klervi Choblet
                    </span>
                </div>

                {/* Center: identity on Desktop */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center select-none">
                    <span className="font-cinzel text-[#F5EBDD] text-xs sm:text-sm md:text-base tracking-[0.18em] uppercase font-bold whitespace-nowrap">
                        Klervi Choblet
                    </span>
                </div>

                {/* Right: discrete actions & links */}
                <div className="flex items-center gap-1.5 sm:gap-3 z-10">
                    {/* Discrete Language Switcher */}
                    <button
                        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                        className="px-2 sm:px-2.5 py-1 text-xs font-cinzel text-[#D8C6B6] hover:text-[#F5EBDD] hover:border-[#D4A24E] border border-[#D4A24E]/30 rounded uppercase transition-colors cursor-pointer"
                        title={getTranslation('languageSwitchTitle', language === 'fr' ? 'Switch to English' : 'Passer en Français')}
                        aria-label="Changer de langue"
                    >
                        {language === 'fr' ? 'FR' : 'EN'}
                    </button>

                    <span className="text-[#D4A24E]/30 hidden sm:inline" aria-hidden>|</span>

                    <a
                        href="https://www.linkedin.com/in/klervi-choblet-361720244/"
                        target="_blank" rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-[#D8C6B6] hover:text-[#F5EBDD] transition-colors text-xs font-cinzel tracking-wider uppercase"
                        title="LinkedIn"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37z" />
                        </svg>
                        <span className="hidden md:inline">LinkedIn</span>
                    </a>

                    <span className="text-[#D4A24E]/30 hidden sm:inline" aria-hidden>|</span>

                    <button
                        onClick={() => setIsCvConfirmOpen(true)}
                        className="flex items-center gap-1 sm:gap-1.5 text-[#D8C6B6] hover:text-[#F5EBDD] transition-colors text-xs font-cinzel tracking-wider uppercase px-2 py-1 rounded border border-[#D4A24E]/20 sm:border-transparent hover:border-[#D4A24E]/50 cursor-pointer"
                        title={getTranslation('downloadPdf', language === 'en' ? 'Access CV (EN)' : 'Accéder au CV (FR)')}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <span>CV</span>
                    </button>

                    <span className="text-[#D4A24E]/30" aria-hidden>|</span>

                    <button
                        onClick={handleNavigateContact}
                        className="flex items-center gap-1 sm:gap-1.5 text-[#3C6E71] hover:text-[#F5EBDD] hover:bg-[#3C6E71]/25 px-2 sm:px-2.5 py-1 rounded border border-[#3C6E71]/50 transition-colors text-xs font-cinzel tracking-wider uppercase font-bold cursor-pointer"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span className="hidden sm:inline">Contact</span>
                    </button>
                </div>
            </header>

            <ProfileCard isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <CVConfirmModal isOpen={isCvConfirmOpen} onClose={() => setIsCvConfirmOpen(false)} />
        </>
    );
};

export default HUD;