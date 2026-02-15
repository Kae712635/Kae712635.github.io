import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import ProfileCard from './ProfileCard';

const HUD = ({ view, onBack, is3D, onToggleMode }) => {
    const { t, language } = useLanguage(); // Récupération de language pour le fallback
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Fonction de secours pour les traductions si t('key') échoue
    const getTranslation = (key, fallback) => {
        try {
            return typeof t === 'function' ? t(key) : (t[key] || fallback);
        } catch (e) {
            return fallback;
        }
    };

    return (
        <>
            {/* Conteneur HUD GAUCHE */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 100,
                color: 'white',
                fontFamily: 'Outfit, sans-serif',
                pointerEvents: 'none' // Empêche de bloquer la rotation 3D sur le vide
            }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Évite de déclencher des événements sur le canvas
                        onToggleMode();
                    }}
                    style={{
                        background: is3D
                            ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(139, 90, 43, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(181, 126, 220, 0.2) 0%, rgba(100, 50, 150, 0.2) 100%)',
                        backdropFilter: 'blur(15px)',
                        border: is3D ? '1px solid #d4af37' : '1px solid #b57edc',
                        boxShadow: is3D
                            ? '0 0 20px rgba(212, 175, 55, 0.3)'
                            : '0 0 20px rgba(181, 126, 220, 0.3)',
                        color: is3D ? '#d4af37' : '#b57edc',
                        padding: '12px 24px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        pointerEvents: 'auto', // CRUCIAL : Réactive le clic sur le bouton
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.background = is3D ? 'rgba(212, 175, 55, 0.3)' : 'rgba(181, 126, 220, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.background = is3D ? 'rgba(212, 175, 55, 0.2)' : 'rgba(181, 126, 220, 0.2)';
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>{is3D ? '📖' : '🌌'}</span>
                    {is3D
                        ? getTranslation('catalogueView', language === 'fr' ? 'Le Grand Catalogue' : 'The Grand Catalog')
                        : getTranslation('libraryView', language === 'fr' ? 'Vue Univers' : 'Universe View')
                    }
                </button>

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
                            marginTop: '10px',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'auto' // CRUCIAL
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
                        textShadow: '0 0 10px rgba(181, 126, 220, 0.8)',
                        letterSpacing: '3px',
                        textTransform: 'uppercase'
                    }}>
                        {getTranslation(view + 'Galaxy', view.charAt(0).toUpperCase() + view.slice(1) + ' Galaxy')}
                    </h2>
                )}
            </div>

            {/* BOUTON INFOS DROITE */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 100
            }}>
                <button
                    onClick={() => setIsProfileOpen(true)}
                    style={{
                        background: 'rgba(181, 126, 220, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(181, 126, 220, 0.4)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(181, 126, 220, 0.3)',
                        pointerEvents: 'auto' // CRUCIAL
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(181, 126, 220, 0.4)';
                        e.target.style.boxShadow = '0 0 25px rgba(181, 126, 220, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(181, 126, 220, 0.2)';
                        e.target.style.boxShadow = '0 0 15px rgba(181, 126, 220, 0.3)';
                    }}
                >
                    ℹ️ {getTranslation('infos', 'Infos')}
                </button>
            </div>

            <ProfileCard isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
};

export default HUD;