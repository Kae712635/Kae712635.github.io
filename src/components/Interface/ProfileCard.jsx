import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const ProfileCard = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

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
                            background: 'rgba(20, 20, 40, 0.85)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '20px',
                            padding: '40px',
                            maxWidth: '400px',
                            width: '90%',
                            color: 'white',
                            textAlign: 'center',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
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
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        {/* Profile Image */}
                        <img
                            src="/media/photo_identité.png"
                            alt="Klervi Choblet"
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                margin: '0 auto 20px auto',
                                boxShadow: '0 0 20px rgba(181, 126, 220, 0.3)',
                                border: '2px solid rgba(255, 255, 255, 0.1)'
                            }}
                        />

                        <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', fontFamily: 'Outfit, sans-serif' }}>
                            {t('profileName')}
                        </h2>
                        <h3 style={{ fontSize: '16px', color: '#b57edc', margin: '0 0 20px 0', fontWeight: 'normal' }}>
                            {t('profileRole')}
                        </h3>

                        <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                            {t('profileBio')}
                        </p>

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
