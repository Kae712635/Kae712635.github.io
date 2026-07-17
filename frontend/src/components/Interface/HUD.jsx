import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileCard from './ProfileCard';

const HUD = ({ view, onBack }) => {
    const { t, language } = useLanguage();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isProjetsPage = location.pathname === '/projets';

    const getTranslation = (key, fallback) => {
        try {
            return typeof t === 'function' ? t(key) : (t[key] || fallback);
        } catch (e) {
            return fallback;
        }
    };

    return (
        <>
            {/* STICKY BAR (Same as Portfolio) */}
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1e1d1b]/95 backdrop-blur-lg border-b border-[#EEE2DF]/10 shadow-sm" style={{ pointerEvents: 'auto' }}>
                {/* Left: Navigation */}
                <button
                    onClick={() => navigate('/projets')}
                    className="hidden md:flex items-center gap-2 text-[#8A897C] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-widest uppercase"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    {getTranslation('catalogueView', language === 'fr' ? 'Catalogue 2D' : '2D Catalog')}
                </button>

                {/* Center: identity */}
                <span className="font-cinzel text-[#EEE2DF] text-xs md:text-sm tracking-widest uppercase font-bold">
                    Klervi Choblet
                </span>

                {/* Right: links */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/Kae712635/"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#8A897C] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-wider uppercase"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                        GitHub
                    </a>
                    <span className="text-[#D9CCC8] hidden md:inline" aria-hidden>|</span>
                    <a
                        href="/documents/CV_Klervi_Choblet.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#8A897C] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-wider uppercase"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        CV
                    </a>
                    <span className="text-[#D9CCC8] hidden md:inline" aria-hidden>|</span>
                    <button
                        onClick={() => navigate('/contact')}
                        className="flex items-center gap-1.5 text-[#B36A5E] hover:text-[#EEE2DF] transition-colors text-xs font-cinzel tracking-wider uppercase font-bold"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Contact
                    </button>
                </div>
            </div>

            {/* Back Button (Visible inside aisles) */}
            <div style={{
                position: 'absolute',
                top: '70px',
                left: '20px',
                zIndex: 100,
                color: 'white',
                fontFamily: 'Cinzel, serif',
                pointerEvents: 'none'
            }}>
                {view !== 'universe' && (
                    <button
                        onClick={onBack}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 'bold',
                            display: 'block',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'auto'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        ← {getTranslation('backToUniverse', 'Retour')}
                    </button>
                )}

                {view !== 'universe' && (
                    <h2 style={{
                        marginTop: '15px',
                        fontSize: '24px',
                        fontWeight: '300',
                        textShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
                        letterSpacing: '3px',
                        textTransform: 'uppercase'
                    }}>
                        {getTranslation(view + 'Section', language === 'fr' ? 'Rayon ' + view.charAt(0).toUpperCase() + view.slice(1) : view.charAt(0).toUpperCase() + view.slice(1) + ' Section')}
                    </h2>
                )}
            </div>

            <ProfileCard isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
};

export default HUD;