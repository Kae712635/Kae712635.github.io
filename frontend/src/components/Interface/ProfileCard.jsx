import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const ProfileCard = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 200, // Above HUD
                    backdropFilter: 'blur(5px)',
                    background: 'rgba(0,0,0,0.5)'
                }} onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        style={{
                            background: 'rgba(43, 15, 20, 0.96)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(212, 162, 78, 0.35)',
                            borderRadius: '20px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '90%',
                            color: '#F5EBDD',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'transparent',
                                border: 'none',
                                color: '#D8C6B6',
                                fontSize: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'rgba(212, 162, 78, 0.15)',
                            border: '1px solid #D4A24E',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px auto',
                            fontSize: '30px',
                            boxShadow: '0 0 20px rgba(212, 162, 78, 0.3)'
                        }}>
                            🧭
                        </div>

                        <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontFamily: 'Cinzel, serif', color: '#F5EBDD' }}>
                            {language === 'fr' ? 'Guide des Archives' : 'Archive Guide'}
                        </h2>
                        <h3 style={{ fontSize: '14px', color: '#D4A24E', margin: '0 0 25px 0', fontWeight: 'normal', fontFamily: 'Cinzel, serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
                            {language === 'fr' ? 'Navigation 3D Interactive' : 'Interactive 3D Navigation'}
                        </h3>

                        <div style={{ lineHeight: '1.8', color: '#D8C6B6', fontSize: '15px', fontFamily: 'sans-serif', textAlign: 'justify' }}>
                            {language === 'fr' ? (
                                <>
                                    <p style={{ marginBottom: '15px' }}>
                                        Bienvenue dans ma bibliothèque virtuelle. Ce portfolio explore une nouvelle manière de présenter l'information via la 3D.
                                    </p>
                                    <ul style={{ paddingLeft: '20px', textAlign: 'left', color: '#F5EBDD' }}>
                                        <li style={{ marginBottom: '8px' }}><strong>Rotation :</strong> Cliquez et glissez (ou utilisez le tactile) pour tourner la caméra.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Exploration :</strong> Cliquez sur les rayons dorés pour vous approcher.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Lecture :</strong> Cliquez sur un livre brillant pour découvrir un projet.</li>
                                    </ul>
                                    <p style={{ marginTop: '15px', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', color: '#3C6E71' }}>
                                        Vous pouvez basculer vers le Catalogue 2D classique à l'aide du bouton en haut à gauche.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p style={{ marginBottom: '15px' }}>
                                        Welcome to my virtual library. This portfolio explores a new way to present information through 3D.
                                    </p>
                                    <ul style={{ paddingLeft: '20px', textAlign: 'left', color: '#F5EBDD' }}>
                                        <li style={{ marginBottom: '8px' }}><strong>Rotation:</strong> Click and drag (or touch) to rotate the camera.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Exploration:</strong> Click on the golden sections to move closer.</li>
                                        <li style={{ marginBottom: '8px' }}><strong>Reading:</strong> Click on a glowing book to discover a project.</li>
                                    </ul>
                                    <p style={{ marginTop: '15px', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', color: '#3C6E71' }}>
                                        You can switch to the classic 2D Catalog using the button on the top left.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Social Links (Mockup for now) */}
                        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            {/* Add actual links if needed */}
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileCard;
