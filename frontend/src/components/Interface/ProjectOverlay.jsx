import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpring, animated } from '@react-spring/web';

// Vintage Ornamental Corner Filigrees
const CornerOrnament = ({ position }) => {
    const isTop = position.includes('top');
    const isLeft = position.includes('left');
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            style={{
                position: 'absolute',
                top: isTop ? '12px' : 'auto',
                bottom: !isTop ? '12px' : 'auto',
                left: isLeft ? '12px' : 'auto',
                right: !isLeft ? '12px' : 'auto',
                transform: `${!isTop ? 'scaleY(-1)' : ''} ${!isLeft ? 'scaleX(-1)' : ''}`,
                pointerEvents: 'none',
                opacity: 0.55
            }}
            aria-hidden="true"
        >
            <path d="M2 20 L2 2 L20 2 M6 6 L6 2 M2 6 L6 6 M9 2 L9 9 L2 9" fill="none" stroke="#D4A24E" strokeWidth="1.5" />
        </svg>
    );
};

// Illustrated Engineering Ex-Libris Seal
const ExLibrisSeal = ({ isCompact = false }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: isCompact ? '10px 14px' : '14px 18px',
        border: '1.5px solid rgba(212, 162, 78, 0.45)',
        borderRadius: '8px',
        background: 'rgba(212, 162, 78, 0.05)',
        width: '100%',
        boxSizing: 'border-box'
    }}>
        {/* Heraldic Shield / Engineering Crest Icon */}
        <svg width="40" height="40" viewBox="0 0 48 48" style={{ marginBottom: '4px' }} aria-hidden="true">
            <path d="M24 4 L38 10 L38 24 C38 34 24 44 24 44 C24 44 10 34 10 24 L10 10 Z" fill="rgba(166, 48, 59, 0.08)" stroke="#A6303B" strokeWidth="1.8" />
            <path d="M24 7 L35 12 L35 23 C35 31 24 39 24 39 C24 39 13 31 13 23 L13 12 Z" fill="none" stroke="#D4A24E" strokeWidth="1.0" />
            <circle cx="24" cy="22" r="5" fill="none" stroke="#D4A24E" strokeWidth="1.2" />
            <path d="M24 17 L24 27 M19 22 L29 22" stroke="#D4A24E" strokeWidth="1.2" />
            <path d="M16 28 L24 16 L32 28" fill="none" stroke="#3C6E71" strokeWidth="1.2" />
        </svg>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', fontWeight: 'bold', color: '#2B0F14', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            EX LIBRIS
        </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.82rem', fontWeight: 'bold', color: '#A6303B', letterSpacing: '1px' }}>
            KLERVI CHOBLET
        </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.62rem', color: '#6A564A', fontStyle: 'italic', marginTop: '2px', letterSpacing: '1px' }}>
            ARCHIVUM DIGITALE • INGENIUM
        </span>
    </div>
);

// Embossed Wax Seal Button
const WaxSealButton = ({ onClick, children, isBack = false }) => (
    <button
        onClick={onClick}
        style={{
            background: isBack
                ? 'radial-gradient(circle at 30% 30%, #3C6E71 0%, #244648 70%, #172F31 100%)'
                : 'radial-gradient(circle at 30% 30%, #A6303B 0%, #7A1F27 70%, #4D0E15 100%)',
            border: '1.5px solid #D4A24E',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: '#F5EBDD',
            fontFamily: 'Cinzel, serif',
            fontWeight: 'bold',
            letterSpacing: '0.08em',
            padding: '9px 18px',
            borderRadius: '24px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255, 235, 180, 0.3), inset 0 -2px 3px rgba(0,0,0,0.4)',
            transition: 'all 0.25s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(212, 162, 78, 0.4), inset 0 2px 4px rgba(255, 245, 200, 0.4)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255, 235, 180, 0.3), inset 0 -2px 3px rgba(0,0,0,0.4)';
        }}
    >
        {children}
    </button>
);

// First Left Page (Illustrated Heraldic Archive / Table of Contents / Media)
const FirstPageLeft = ({ category, date, video, image, affiliation, language, isExperience, isSkill, isEducation }) => {
    // Generate adaptive table of contents
    const getTocItems = () => {
        if (isExperience) {
            return [
                { num: 'I', label: category || (language === 'fr' ? 'Expériences Pro' : 'Work Experience'), page: 'p. I' },
                { num: 'II', label: language === 'fr' ? 'Missions & Réalisations' : 'Missions & Achievements', page: 'p. II' },
                { num: 'III', label: language === 'fr' ? 'Compétences & Outils' : 'Skills & Tools', page: 'p. III' }
            ];
        }
        if (isEducation) {
            return [
                { num: 'I', label: category || (language === 'fr' ? 'Formations & Diplômes' : 'Education & Degrees'), page: 'p. I' },
                { num: 'II', label: language === 'fr' ? 'Programme & Savoirs' : 'Syllabus & Knowledge', page: 'p. II' },
                { num: 'III', label: language === 'fr' ? 'Établissement & Validation' : 'Institution & Validation', page: 'p. III' }
            ];
        }
        if (isSkill) {
            return [
                { num: 'I', label: category || (language === 'fr' ? 'Compétences & Langues' : 'Skills & Languages'), page: 'p. I' },
                { num: 'II', label: language === 'fr' ? 'Stack & Outils' : 'Stack & Tools', page: 'p. II' },
                { num: 'III', label: language === 'fr' ? 'Maîtrise & Contexte' : 'Proficiency & Context', page: 'p. III' }
            ];
        }
        return [
            { num: 'I', label: category || (language === 'fr' ? 'Projets Phares' : 'Featured Projects'), page: 'p. I' },
            { num: 'II', label: language === 'fr' ? 'Technologies & Méthodes' : 'Technologies & Methods', page: 'p. II' },
            { num: 'III', label: language === 'fr' ? 'Détails & Références' : 'Details & References', page: 'p. III' }
        ];
    };

    const tocItems = getTocItems();

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #FBF4E8 0%, #EFE4D2 60%, #E6D8C3 100%)',
            borderRadius: '6px 0 0 6px',
            padding: '36px', boxSizing: 'border-box',
            borderRight: '1px solid #D8C6B6',
            boxShadow: 'inset -26px 0 35px rgba(0,0,0,0.12), inset -4px 0 10px rgba(43,15,20,0.08)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'
        }}>
            <CornerOrnament position="top-left" />
            <CornerOrnament position="bottom-left" />

            {/* Top Archival Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D8C6B6', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#D4A24E', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>
                    {category || (language === 'fr' ? 'Archive Numérique' : 'Digital Archive')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>
                    {date}
                </span>
            </div>

            {/* Content Block: Either Media Display OR Illustrated Table of Contents & Seal */}
            {video || image ? (
                <div style={{ width: '100%', flex: 1, margin: '16px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {video ? (
                            <div style={{ width: '100%', maxHeight: '280px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid #D4A24E', background: '#1E0A0E', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
                                <video src={video} controls autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        ) : (
                            <div style={{
                                width: '100%', height: '240px',
                                background: `url(${image.startsWith('/') ? image : '/img/' + image}) center/cover no-repeat`,
                                border: '1.5px solid #D4A24E',
                                boxShadow: '0 6px 20px rgba(43, 15, 20, 0.2)',
                                borderRadius: '8px'
                            }}></div>
                        )}
                    </div>
                    <ExLibrisSeal isCompact={true} />
                </div>
            ) : (
                /* When no image/video: Rich Illustrated Table of Contents & Heraldic Archive */
                <div style={{ width: '100%', flex: 1, margin: '14px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <ExLibrisSeal isCompact={false} />

                    {/* Sommaire / Table of Contents */}
                    <div style={{
                        padding: '14px',
                        border: '1px dashed rgba(212, 162, 78, 0.5)',
                        borderRadius: '6px',
                        background: 'rgba(212, 162, 78, 0.03)',
                        margin: '10px 0'
                    }}>
                        <h3 style={{
                            fontFamily: 'Cinzel, serif',
                            fontSize: '0.75rem',
                            color: '#A6303B',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            margin: '0 0 10px 0',
                            textAlign: 'center',
                            borderBottom: '1px solid rgba(212, 162, 78, 0.3)',
                            paddingBottom: '4px'
                        }}>
                            {language === 'fr' ? 'Sommaire de l\'Ouvrage' : 'Table of Contents'}
                        </h3>

                        <div style={{ fontSize: '0.78rem', color: '#2B0F14', fontFamily: "'Playfair Display', 'Lora', serif", display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {tocItems.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{item.num}. {item.label}</span>
                                    <span style={{ color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>{item.page}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', color: '#6A564A', fontStyle: 'italic', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        {affiliation ? `${affiliation} • ` : ''}{date}
                    </div>
                </div>
            )}

            <div style={{ textAlign: 'center', color: '#6A564A', fontStyle: 'italic', fontSize: '0.75rem', letterSpacing: '1px', borderTop: '1px solid #D8C6B6', width: '100%', paddingTop: '8px' }}>
                Fascicule Technique • Klervi Choblet
            </div>
        </div>
    );
};

const ProjectOverlay = ({ project, onClose }) => {
    const { language } = useLanguage();
    // 0 = Closed (Cover), 1 = Spread 1 (Title/Desc), 2 = Spread 2 (Details/Tech)
    const [pageState, setPageState] = useState(0);
    const [showVideoModal, setShowVideoModal] = useState(false);

    // Optional gentle auto-open after 2.8s, or user can click immediately on the cover
    useEffect(() => {
        const timer = setTimeout(() => {
            setPageState(prev => (prev === 0 ? 1 : prev));
        }, 2800);
        return () => clearTimeout(timer);
    }, []);

    if (!project) return null;

    const getLocalized = (field) => {
        if (!field) return "";
        if (typeof field === "string") return field;
        return field[language] || field.fr || field.en || "";
    };

    const title = getLocalized(project.title) || "";
    const description = getLocalized(project.description) || (language === 'fr' ? "Aucune description disponible." : "No description available.");
    const detailedDesc = getLocalized(project.detailed_description) || getLocalized(project.details) || null;
    const category = Array.isArray(project.category) ? project.category.join(' & ') : (getLocalized(project.category) || "");
    const date = getLocalized(project.date || project.period) || "";
    const affiliation = getLocalized(project.company || project.school || project.course || project.personal_project) || "";
    const techStack = project.tech || project.highlights || [];
    const image = project.image ? (typeof project.image === 'string' ? project.image : project.image[0]) : null;
    const video = project.video || null;
    const projectUrl = project.project_url || project.link || null;
    const docUrl = project.document || project.doc || null;
    const isExperience = project.id?.startsWith('exp-') || (typeof category === 'string' ? category.toLowerCase().includes('expérience') : false);
    const isSkill = project.id?.startsWith('skill-') || (typeof category === 'string' ? (category.toLowerCase().includes('compétence') || category.toLowerCase().includes('langage') || category.toLowerCase().includes('langue') || category.toLowerCase().includes('soft skill')) : false);
    const isEducation = project.id?.startsWith('edu-') || (typeof category === 'string' ? (category.toLowerCase().includes('formation') || category.toLowerCase().includes('diplôme')) : false);
    // Responsive window sizing for seamless Mobile & Tablet support
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight : 800
    });

    useEffect(() => {
        const updateSize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const isMobile = windowSize.width < 768;

    // Dynamically scale the 900x600 book spread so it fits perfectly on all phones and tablets
    const maxBookW = 920;
    const maxBookH = 640;
    const scale = Math.min(
        1,
        (windowSize.width - (isMobile ? 24 : 48)) / maxBookW,
        (windowSize.height - (isMobile ? 80 : 100)) / maxBookH
    );

    // Center the cover when closed (-225px), center the open spread when opened (0px)
    const bookStyle = {
        perspective: '1600px',
        width: '900px',
        height: '600px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `scale(${scale}) ${pageState === 0 ? 'translateX(-225px)' : 'translateX(0px)'}`,
        transformOrigin: 'center center',
        transition: 'transform 1.4s cubic-bezier(0.25, 1, 0.45, 1)'
    };

    // Majestic slow cover animation (heavy antique leather)
    const { coverRotation } = useSpring({
        coverRotation: pageState > 0 ? -180 : 0,
        config: { mass: 5, tension: 100, friction: 36 }
    });

    // Leaf 1 Animation (smooth slow parchment turn)
    const [leaf1Rotation, setLeaf1Rotation] = useSpring(() => ({ rotateY: 0 }));

    useEffect(() => {
        setLeaf1Rotation({ rotateY: pageState > 1 ? -180 : 0, config: { mass: 3, tension: 120, friction: 32 } });
    }, [pageState, setLeaf1Rotation]);

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setPageState(prev => Math.min(prev + 1, 2));
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setPageState(prev => Math.max(prev - 1, 0));
    };

    const handleClose = (e) => {
        if (e) e.stopPropagation();
        setPageState(0);
        setTimeout(onClose, 800);
    };

    // Keyboard & Numpad navigation inside the book
    useEffect(() => {
        const handleKeyDown = (e) => {
            const code = e.code;
            const key = e.key;

            // Scroll active visible page content Down (Numpad 2 / Down Arrow / PageDown)
            if (code === 'Numpad2' || code === 'ArrowDown' || key === 'PageDown' || key === '2') {
                e.preventDefault();
                const scrollContainers = document.querySelectorAll('.book-scroll-container');
                scrollContainers.forEach((el) => {
                    if (el.offsetParent !== null) {
                        el.scrollBy({ top: 90, behavior: 'smooth' });
                    }
                });
            }
            // Scroll active visible page content Up (Numpad 8 / Up Arrow / PageUp)
            else if (code === 'Numpad8' || code === 'ArrowUp' || key === 'PageUp' || key === '8') {
                e.preventDefault();
                const scrollContainers = document.querySelectorAll('.book-scroll-container');
                scrollContainers.forEach((el) => {
                    if (el.offsetParent !== null) {
                        el.scrollBy({ top: -90, behavior: 'smooth' });
                    }
                });
            }
            // Next page (Numpad 6 / Right Arrow / Numpad 3 / Space)
            else if (code === 'Numpad6' || code === 'ArrowRight' || code === 'Numpad3' || key === '6' || key === '3' || key === ' ') {
                e.preventDefault();
                setPageState(prev => Math.min(prev + 1, 2));
            }
            // Previous page (Numpad 4 / Left Arrow / Numpad 1 / Backspace)
            else if (code === 'Numpad4' || code === 'ArrowLeft' || code === 'Numpad1' || key === '4' || key === '1' || key === 'Backspace') {
                e.preventDefault();
                setPageState(prev => Math.max(prev - 1, 0));
            }
            // Close book (Escape / Numpad 0 / Digit 0)
            else if (code === 'Escape' || code === 'Numpad0' || code === 'Digit0' || key === '0') {
                e.preventDefault();
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(26, 8, 12, 0.92)', backdropFilter: 'blur(12px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                overflow: 'hidden'
            }}
            onClick={handleClose}
        >
            {/* Prominent Floating Close Button (Mobile / Tablet / Touch friendly) */}
            <button
                onClick={handleClose}
                style={{
                    position: 'fixed',
                    top: '16px',
                    right: '16px',
                    zIndex: 1100,
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(30, 10, 14, 0.95)',
                    border: '1.5px solid #D4A24E',
                    color: '#F5EBDD',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.85), 0 0 12px rgba(212,162,78,0.35)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s'
                }}
                aria-label="Fermer le livre"
            >
                ✕
            </button>

            {/* Mobile & Tablet Page Navigation Floating Pill */}
            {isMobile && pageState > 0 && (
                <div 
                    style={{
                        position: 'fixed',
                        bottom: '16px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(30, 10, 14, 0.95)',
                        border: '1.5px solid rgba(212, 162, 78, 0.6)',
                        padding: '8px 18px',
                        borderRadius: '30px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.9)',
                        backdropFilter: 'blur(10px)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handlePrev}
                        disabled={pageState === 0}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: pageState === 0 ? 'rgba(216,198,182,0.4)' : '#F5EBDD',
                            fontFamily: 'Cinzel, serif',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: pageState === 0 ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        ← {language === 'fr' ? 'Page Préc.' : 'Prev'}
                    </button>
                    <span style={{ color: '#D4A24E', opacity: 0.5 }}>|</span>
                    <span style={{ color: '#D4A24E', fontFamily: 'Cinzel, serif', fontSize: '11px', fontWeight: 'bold' }}>
                        {pageState} / 2
                    </span>
                    <span style={{ color: '#D4A24E', opacity: 0.5 }}>|</span>
                    <button
                        onClick={handleNext}
                        disabled={pageState >= 2}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: pageState >= 2 ? 'rgba(216,198,182,0.4)' : '#FFD700',
                            fontFamily: 'Cinzel, serif',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: pageState >= 2 ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        {language === 'fr' ? 'Page Suiv.' : 'Next'} →
                    </button>
                </div>
            )}

            {/* The Book Container */}
            <div style={bookStyle} onClick={(e) => e.stopPropagation()}>

                {/* LAYER 0: STATIC BACKING COVERS */}
                {/* Right Backing Cover (Always under right pages) */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #2B0F14 0%, #1E0A0E 100%)',
                    borderRadius: '0 12px 12px 0',
                    boxShadow: '20px 20px 50px rgba(0,0,0,0.7)',
                    border: '1px solid rgba(212, 162, 78, 0.35)',
                    zIndex: 0
                }}></div>
                {/* Left Backing Cover */}
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #2B0F14 0%, #1E0A0E 100%)',
                    borderRadius: '12px 0 0 12px',
                    boxShadow: '-20px 20px 50px rgba(0,0,0,0.7)',
                    border: '1px solid rgba(212, 162, 78, 0.35)',
                    zIndex: 0
                }}></div>

                {/* LAYER 1: STATIC PAGES (BASE) */}
                {/* LEFT BASE PAGE (Illustrated Table of Contents / Media) */}
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    borderRadius: '6px 0 0 6px',
                    zIndex: 1
                }}>
                    <FirstPageLeft
                        category={category}
                        date={date}
                        video={video}
                        image={image}
                        affiliation={affiliation}
                        language={language}
                        isExperience={isExperience}
                        isSkill={isSkill}
                        isEducation={isEducation}
                    />
                </div>

                {/* RIGHT BASE PAGE - SPREAD 2 (Technical Details & Links) */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #FBF4E8 0%, #EFE4D2 60%, #E6D8C3 100%)',
                    borderRadius: '0 6px 6px 0',
                    zIndex: 1, padding: '34px 34px 20px 34px', boxSizing: 'border-box',
                    borderLeft: '1px solid #D8C6B6',
                    boxShadow: 'inset 26px 0 35px rgba(0,0,0,0.12), inset 4px 0 10px rgba(43,15,20,0.08)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    overflow: 'hidden'
                }}>
                    <CornerOrnament position="top-right" />
                    <CornerOrnament position="bottom-right" />

                    <div className="book-scroll-container" style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', minHeight: 0 }}>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                color: '#D4A24E',
                                letterSpacing: '2.5px',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #D4A24E',
                                paddingBottom: '3px',
                                display: 'inline-block',
                                fontFamily: 'Cinzel, serif'
                            }}>
                                {isExperience
                                    ? (language === 'fr' ? 'III. Compétences & Outils' : 'III. Skills & Tools')
                                    : isEducation
                                        ? (language === 'fr' ? 'III. Établissement & Validation' : 'III. Institution & Validation')
                                        : isSkill
                                            ? (language === 'fr' ? 'III. Maîtrise & Contexte' : 'III. Proficiency & Context')
                                            : (language === 'fr' ? 'III. Détails & Références' : 'III. Details & References')
                                }
                            </span>
                        </div>

                        {affiliation && (
                            <div style={{
                                fontSize: '0.88rem',
                                color: '#6A564A',
                                fontStyle: 'italic',
                                marginBottom: '14px',
                                borderBottom: '1px solid #D8C6B6',
                                paddingBottom: '8px',
                                fontFamily: "'Playfair Display', 'Lora', serif"
                            }}>
                                {affiliation} {date ? `• ${date}` : ''}
                            </div>
                        )}

                        {!isExperience && detailedDesc && (
                            <div style={{
                                marginBottom: '14px'
                            }}>
                                {detailedDesc.split('\n').filter(line => line.trim() !== '').map((paragraph, pIdx) => (
                                    <p key={pIdx} style={{
                                        lineHeight: '1.65',
                                        fontSize: '0.85rem',
                                        color: '#2B0F14',
                                        textAlign: 'justify',
                                        margin: '0 0 8px 0',
                                        fontFamily: "'Playfair Display', 'Lora', serif"
                                    }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Tech stack / highlights tags */}
                        {techStack && techStack.length > 0 && (
                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#3C6E71', marginBottom: '8px', letterSpacing: '1.5px', fontWeight: 'bold', fontFamily: 'Cinzel, serif' }}>
                                    {language === 'fr' ? 'Compétences & Outils Développés' : 'Skills & Tools Developed'}
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {techStack.map((item, idx) => (
                                        <span key={idx} style={{
                                            background: '#EAE0D2',
                                            border: '1px solid rgba(212, 162, 78, 0.45)',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontFamily: 'JetBrains Mono, monospace',
                                            fontSize: '0.75rem',
                                            color: '#2B0F14',
                                            fontWeight: '600'
                                        }}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Links */}
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                            {video ? (
                                <button
                                    onClick={() => setShowVideoModal(true)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'radial-gradient(circle at 30% 30%, #A6303B 0%, #7A1F27 70%, #4D0E15 100%)',
                                        color: '#ffffff',
                                        border: '1.5px solid #D4A24E',
                                        padding: '8px 16px', borderRadius: '20px',
                                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(166, 48, 59, 0.35)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🎬 {language === 'fr' ? 'Consulter le Projet (Vidéo)' : 'View Project (Video)'}
                                </button>
                            ) : projectUrl ? (
                                <a
                                    href={projectUrl} target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'radial-gradient(circle at 30% 30%, #A6303B 0%, #7A1F27 70%, #4D0E15 100%)',
                                        color: '#ffffff',
                                        border: '1.5px solid #D4A24E',
                                        padding: '8px 16px', borderRadius: '20px',
                                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                        textDecoration: 'none', letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(166, 48, 59, 0.35)'
                                    }}
                                >
                                    🚀 {language === 'fr' ? 'Consulter le Projet' : 'Visit Project'}
                                </a>
                            ) : null}
                            {docUrl && (
                                <a
                                    href={docUrl} target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'radial-gradient(circle at 30% 30%, #3C6E71 0%, #244648 70%, #172F31 100%)',
                                        color: '#ffffff',
                                        border: '1.5px solid #D4A24E',
                                        padding: '8px 16px', borderRadius: '20px',
                                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                        textDecoration: 'none', letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(60, 110, 113, 0.35)'
                                    }}
                                >
                                    {language === 'fr' ? 'Document PDF' : 'PDF Document'}
                                </a>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', marginTop: '16px', borderTop: '1px solid #D8C6B6' }}>
                            <WaxSealButton onClick={handlePrev} isBack={true}>
                                {language === 'fr' ? '☜ Retour' : '☜ Back'}
                            </WaxSealButton>
                            <span style={{ fontSize: '0.75rem', color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>3</span>
                        </div>
                    </div>
                </div>

                {/* LAYER 2: LEAF 1 (FLIPPER) */}
                <animated.div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    zIndex: leaf1Rotation.rotateY.to(y => (y < -90 ? 20 : 5)),
                    rotateY: leaf1Rotation.rotateY
                }}>
                    {/* PAGE 1 (Front - Right Side at Open) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #FBF4E8 0%, #EFE4D2 60%, #E6D8C3 100%)',
                        borderRadius: '0 6px 6px 0',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        padding: '34px 34px 20px 34px', boxSizing: 'border-box',
                        borderLeft: '1px solid #D8C6B6',
                        boxShadow: 'inset 26px 0 35px rgba(0,0,0,0.12), inset 4px 0 10px rgba(43,15,20,0.08)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        overflow: 'hidden'
                    }}>
                        <CornerOrnament position="top-right" />
                        <CornerOrnament position="bottom-right" />

                        <div className="book-scroll-container" style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', minHeight: 0 }}>
                            {/* Category Kicker with breathing room */}
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    color: '#D4A24E',
                                    letterSpacing: '2.5px',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #D4A24E',
                                    paddingBottom: '3px',
                                    display: 'inline-block',
                                    fontFamily: 'Cinzel, serif'
                                }}>
                                    {`I. ${category || (language === 'fr' ? 'Vue d\'Ensemble' : 'Overview')}`}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 style={{
                                margin: '0 0 10px',
                                fontSize: '1.85rem',
                                fontFamily: 'Cinzel, serif',
                                color: '#2B0F14',
                                lineHeight: 1.2,
                                fontWeight: '700'
                            }}>
                                {title}
                            </h1>

                            {/* Subtitle / School / Company */}
                            <div style={{
                                fontStyle: 'italic',
                                marginBottom: '14px',
                                color: '#6A564A',
                                fontSize: '0.85rem',
                                borderBottom: '1px solid #D8C6B6',
                                paddingBottom: '8px',
                                fontFamily: "'Playfair Display', 'Lora', serif"
                            }}>
                                {affiliation ? `${affiliation} • ` : ''}{date}
                            </div>

                            {/* Description in Serif Classic Book Font */}
                            <div style={{ marginBottom: '12px' }}>
                                {description.split('\n').filter(line => line.trim() !== '').map((para, idx) => (
                                    <p key={idx} style={{
                                        lineHeight: '1.6',
                                        fontSize: '0.86rem',
                                        color: '#2B0F14',
                                        textAlign: 'justify',
                                        margin: '0 0 6px 0',
                                        fontFamily: "'Playfair Display', 'Lora', serif"
                                    }}>
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Highlights / Points Clés Box (Combles the space harmoniously without overflowing) */}
                            {techStack && techStack.length > 0 && (
                                <div style={{
                                    marginTop: '8px',
                                    marginBottom: '8px',
                                    padding: '8px 12px',
                                    border: '1px solid rgba(212, 162, 78, 0.35)',
                                    borderRadius: '6px',
                                    background: 'rgba(212, 162, 78, 0.04)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '0.7rem', color: '#A6303B', fontFamily: 'Cinzel, serif', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        ◆ Repères :
                                    </span>
                                    {techStack.slice(0, 4).map((item, idx) => (
                                        <span key={idx} style={{
                                            fontSize: '0.72rem',
                                            fontFamily: 'JetBrains Mono, monospace',
                                            color: '#2B0F14',
                                            background: '#EAE0D2',
                                            padding: '2px 8px',
                                            borderRadius: '3px',
                                            border: '1px solid rgba(212,162,78,0.3)',
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom navigation with Wax Seal Buttons for full bidirectional movement */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #D8C6B6', marginTop: '6px' }}>
                            <WaxSealButton onClick={handlePrev} isBack={true}>
                                {language === 'fr' ? '☜ Couverture' : '☜ Cover'}
                            </WaxSealButton>
                            <span style={{ fontSize: '0.75rem', color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>1</span>
                            {pageState === 1 && (
                                <WaxSealButton onClick={handleNext}>
                                    {language === 'fr' ? 'Détails ☞' : 'Details ☞'}
                                </WaxSealButton>
                            )}
                        </div>
                    </div>

                    {/* PAGE 2 (Back - Flipped Left) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #FBF4E8 0%, #EFE4D2 60%, #E6D8C3 100%)',
                        borderRadius: '6px 0 0 6px',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(1px)',
                        padding: '34px 34px 20px 34px', boxSizing: 'border-box',
                        borderRight: '1px solid #D8C6B6',
                        boxShadow: 'inset -26px 0 35px rgba(0,0,0,0.12), inset -4px 0 10px rgba(43,15,20,0.08)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        overflow: 'hidden'
                    }}>
                        <CornerOrnament position="top-left" />
                        <CornerOrnament position="bottom-left" />

                        <div className="book-scroll-container" style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', minHeight: 0 }}>
                            <div style={{ marginBottom: '12px' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    color: '#D4A24E',
                                    letterSpacing: '2.5px',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #D4A24E',
                                    paddingBottom: '3px',
                                    display: 'inline-block',
                                    fontFamily: 'Cinzel, serif'
                                }}>
                                    {isExperience
                                        ? (language === 'fr' ? 'II. Missions & Réalisations' : 'II. Missions & Achievements')
                                        : isEducation
                                            ? (language === 'fr' ? 'II. Programme & Savoirs' : 'II. Syllabus & Knowledge')
                                            : isSkill
                                                ? (language === 'fr' ? 'II. Stack & Outils' : 'II. Stack & Tools')
                                                : (language === 'fr' ? 'II. Technologies & Méthodes' : 'II. Technologies & Methods')
                                    }
                                </span>
                            </div>

                            {isExperience ? (
                                <div>
                                    {detailedDesc && detailedDesc.split('\n').filter(line => line.trim() !== '').map((para, idx) => (
                                        <p key={idx} style={{
                                            lineHeight: '1.65',
                                            fontSize: '0.86rem',
                                            color: '#2B0F14',
                                            textAlign: 'justify',
                                            margin: '0 0 10px 0',
                                            fontFamily: "'Playfair Display', 'Lora', serif"
                                        }}>
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                        {techStack && techStack.map((t, idx) => (
                                            <span key={idx} style={{
                                                background: '#EAE0D2',
                                                border: '1px solid rgba(212, 162, 78, 0.45)',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontFamily: 'JetBrains Mono, monospace',
                                                fontSize: '0.8rem',
                                                color: '#2B0F14',
                                                fontWeight: '600'
                                            }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', borderTop: '1px solid #D8C6B6', marginTop: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>2</span>
                        </div>
                    </div>
                </animated.div>

                {/* LAYER 3: COVER (LEAF 0) */}
                <animated.div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    zIndex: 10,
                    rotateY: coverRotation
                }}>
                    {/* FRONT COVER */}
                    <div
                        onClick={pageState === 0 ? handleNext : undefined}
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(135deg, #2B0F14 0%, #1E0A0E 100%)',
                            borderRadius: '0 12px 12px 0',
                            backfaceVisibility: 'hidden',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.6), -5px 0 20px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(212, 162, 78, 0.45)',
                            padding: '36px', boxSizing: 'border-box',
                            cursor: pageState === 0 ? 'pointer' : 'default'
                        }}
                    >
                        <div style={{
                            border: '1px solid rgba(212, 162, 78, 0.5)',
                            padding: '20px 24px',
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            background: 'rgba(166, 48, 59, 0.12)',
                            borderRadius: '6px'
                        }}>
                            {/* Gold Corners */}
                            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderTop: '2px solid #D4A24E', borderLeft: '2px solid #D4A24E' }}></div>
                            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderTop: '2px solid #D4A24E', borderRight: '2px solid #D4A24E' }}></div>
                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderBottom: '2px solid #D4A24E', borderLeft: '2px solid #D4A24E' }}></div>
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderBottom: '2px solid #D4A24E', borderRight: '2px solid #D4A24E' }}></div>

                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <span style={{
                                    color: '#D4A24E',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2.5px',
                                    fontSize: '0.72rem',
                                    fontWeight: 'bold',
                                    fontFamily: 'Cinzel, serif',
                                    display: 'block',
                                    marginBottom: '6px'
                                }}>
                                    {category || 'Portfolio'}
                                </span>

                                <h1 style={{
                                    color: '#F5EBDD',
                                    textAlign: 'center',
                                    fontFamily: '"Cinzel", serif',
                                    fontSize: title.length > 25 ? '1.5rem' : '1.9rem',
                                    margin: '0 0 6px 0',
                                    lineHeight: 1.2,
                                    fontWeight: 'bold'
                                }}>
                                    {title}
                                </h1>
                            </div>

                            {/* Project Visual / Thumbnail on Cover */}
                            {image ? (
                                <div style={{
                                    width: '100%',
                                    maxWidth: '330px',
                                    height: '170px',
                                    borderRadius: '8px',
                                    border: '1.5px solid #D4A24E',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.7), 0 0 12px rgba(212,162,78,0.25)',
                                    position: 'relative',
                                    margin: '6px 0',
                                    background: '#1A080C'
                                }}>
                                    <img
                                        src={image.startsWith('/') ? image : '/img/' + image}
                                        alt={title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        boxShadow: 'inset 0 0 20px rgba(26, 8, 12, 0.65)',
                                        pointerEvents: 'none'
                                    }}></div>
                                </div>
                            ) : (
                                <div style={{ width: '100%', maxWidth: '280px', margin: '4px 0' }}>
                                    <ExLibrisSeal isCompact={true} />
                                </div>
                            )}

                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <span style={{
                                    color: '#D8C6B6',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontSize: '0.7rem',
                                    fontFamily: 'Cinzel, serif',
                                    display: 'block',
                                    marginBottom: '10px'
                                }}>
                                    Klervi Choblet
                                </span>

                                {/* Open Action Callout on Cover */}
                                <WaxSealButton onClick={handleNext}>
                                    {language === 'fr' ? 'Ouvrir le Volume ☞' : 'Open Book ☞'}
                                </WaxSealButton>
                            </div>
                        </div>
                    </div>

                    {/* INSIDE COVER (Back of Cover LEAF 0) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        borderRadius: '6px 0 0 6px',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(1px)',
                        zIndex: 1
                    }}>
                        <FirstPageLeft
                            category={category}
                            date={date}
                            video={video}
                            image={image}
                            affiliation={affiliation}
                            language={language}
                            isExperience={isExperience}
                            isSkill={isSkill}
                            isEducation={isEducation}
                        />
                    </div>
                </animated.div>

            </div>

            {/* Close Button X */}
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '84px',
                    right: '36px',
                    background: 'rgba(30, 10, 14, 0.9)',
                    border: '1.5px solid rgba(212, 162, 78, 0.5)',
                    color: '#F5EBDD',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    transition: 'all 0.25s',
                    zIndex: 2000
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(166, 48, 59, 0.95)';
                    e.currentTarget.style.borderColor = '#D4A24E';
                    e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(30, 10, 14, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(212, 162, 78, 0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Fermer"
            >
                ✕
            </button>

            {/* Video Player Modal Popup */}
            {showVideoModal && video && (
                <div
                    onClick={() => setShowVideoModal(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.88)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 3000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '900px',
                            background: '#180E11',
                            border: '2px solid #D4A24E',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,162,78,0.25)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 24px',
                            borderBottom: '1px solid rgba(212, 162, 78, 0.3)',
                            background: 'rgba(43, 15, 20, 0.6)'
                        }}>
                            <div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontFamily: 'Cinzel, serif',
                                    color: '#D4A24E',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontWeight: 'bold'
                                }}>
                                    {language === 'fr' ? 'Démonstration Vidéo' : 'Video Demonstration'}
                                </span>
                                <h3 style={{
                                    margin: '2px 0 0 0',
                                    fontSize: '1.4rem',
                                    fontFamily: 'Cinzel, serif',
                                    color: '#F5EBDD',
                                    fontWeight: 'bold'
                                }}>
                                    {title}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowVideoModal(false)}
                                style={{
                                    background: 'rgba(166, 48, 59, 0.8)',
                                    border: '1px solid #D4A24E',
                                    color: '#F5EBDD',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                aria-label="Fermer la vidéo"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Video Player */}
                        <div style={{ backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <video
                                src={video}
                                controls
                                autoPlay
                                playsInline
                                style={{
                                    width: '100%',
                                    maxHeight: '70vh',
                                    objectFit: 'contain',
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectOverlay;
