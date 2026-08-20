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
const FirstPageLeft = ({ category, date, video, image, affiliation, language }) => (
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
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>I. {language === 'fr' ? 'Vue d\'Ensemble' : 'Overview'}</span>
                            <span style={{ color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>p. I</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>II. {language === 'fr' ? 'Technologies & Méthodes' : 'Technologies & Methods'}</span>
                            <span style={{ color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>p. II</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>III. {language === 'fr' ? 'Détails & Références' : 'Details & References'}</span>
                            <span style={{ color: '#6A564A', fontFamily: 'JetBrains Mono, monospace' }}>p. III</span>
                        </div>
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

const ProjectOverlay = ({ project, onClose }) => {
    const { language } = useLanguage();
    // 0 = Closed (Cover), 1 = Spread 1 (Title/Desc), 2 = Spread 2 (Details/Tech)
    const [pageState, setPageState] = useState(0);

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

    const title = project.title || "";
    const description = getLocalized(project.description) || (language === 'fr' ? "Aucune description disponible." : "No description available.");
    const detailedDesc = getLocalized(project.detailed_description) || getLocalized(project.details) || null;
    const category = Array.isArray(project.category) ? project.category.join(' & ') : (project.category || "");
    const date = project.date || project.period || "";
    const affiliation = project.company || project.school || project.course || project.personal_project || "";
    const techStack = project.tech || project.highlights || [];
    const image = project.image ? (typeof project.image === 'string' ? project.image : project.image[0]) : null;
    const video = project.video || null;
    const projectUrl = project.project_url || project.link || null;
    const githubUrl = project.github_url || project.github || null;
    const docUrl = project.document || project.doc || null;

    // Center the cover when closed (-225px), center the open spread when opened (0px)
    const bookStyle = {
        perspective: '1600px',
        width: '900px',
        height: '600px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: pageState === 0 ? 'translateX(-225px)' : 'translateX(0px)',
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

    return (
        <div 
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(26, 8, 12, 0.88)', backdropFilter: 'blur(10px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }} 
            onClick={handleClose}
        >
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
                {/* Left Backing Cover (Only visible when book is opened) */}
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #2B0F14 0%, #1E0A0E 100%)',
                    borderRadius: '12px 0 0 12px',
                    boxShadow: '-20px 20px 50px rgba(0,0,0,0.7)',
                    border: '1px solid rgba(212, 162, 78, 0.35)',
                    zIndex: 0,
                    opacity: pageState > 0 ? 1 : 0,
                    pointerEvents: pageState > 0 ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease-in-out'
                }}></div>

                {/* LAYER 1: STATIC PAGES (BASE) */}
                {/* LEFT BASE PAGE (Only visible when book is opened) */}
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    borderRadius: '6px 0 0 6px',
                    zIndex: 1,
                    opacity: pageState > 0 ? 1 : 0,
                    pointerEvents: pageState > 0 ? 'auto' : 'none',
                    transition: 'opacity 0.5s ease-in-out'
                }}>
                    <FirstPageLeft 
                        category={category}
                        date={date}
                        video={video}
                        image={image}
                        affiliation={affiliation}
                        language={language}
                    />
                </div>

                {/* RIGHT BASE PAGE - SPREAD 2 (Technical Details & Links) */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #FBF4E8 0%, #EFE4D2 60%, #E6D8C3 100%)',
                    borderRadius: '0 6px 6px 0',
                    zIndex: 1, padding: '40px', boxSizing: 'border-box',
                    borderLeft: '1px solid #D8C6B6',
                    boxShadow: 'inset 26px 0 35px rgba(0,0,0,0.12), inset 4px 0 10px rgba(43,15,20,0.08)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <CornerOrnament position="top-right" />
                    <CornerOrnament position="bottom-right" />

                    <div>
                        <h2 style={{
                            fontFamily: 'Cinzel, serif',
                            color: '#2B0F14',
                            margin: '0 0 16px 0',
                            borderBottom: '2px solid #D4A24E',
                            paddingBottom: '8px',
                            fontSize: '1.6rem',
                            fontWeight: 'bold'
                        }}>
                            {language === 'fr' ? 'Détails & Références' : 'Details & References'}
                        </h2>

                        {affiliation && (
                            <div style={{ fontSize: '0.85rem', color: '#6A564A', fontStyle: 'italic', marginBottom: '16px', fontFamily: "'Playfair Display', 'Lora', serif" }}>
                                {affiliation} {date ? `• ${date}` : ''}
                            </div>
                        )}

                        {detailedDesc && (
                            <p style={{
                                lineHeight: '1.75',
                                fontSize: '0.9rem',
                                color: '#2B0F14',
                                textAlign: 'justify',
                                marginBottom: '20px',
                                maxHeight: '190px',
                                overflowY: 'auto',
                                fontFamily: "'Playfair Display', 'Lora', serif"
                            }}>
                                {detailedDesc}
                            </p>
                        )}

                        {/* Tech stack / highlights tags */}
                        {techStack && techStack.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#3C6E71', marginBottom: '8px', letterSpacing: '1.5px', fontWeight: 'bold', fontFamily: 'Cinzel, serif' }}>
                                    {language === 'fr' ? 'Compétences & Outils' : 'Skills & Tools'}
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
                            {projectUrl && (
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
                            )}
                            {githubUrl && (
                                <a 
                                    href={githubUrl} target="_blank" rel="noopener noreferrer" 
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'transparent', color: '#2B0F14',
                                        border: '1.5px solid #D4A24E',
                                        padding: '8px 16px', borderRadius: '20px',
                                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                        textDecoration: 'none', letterSpacing: '0.05em'
                                    }}
                                >
                                    GitHub
                                </a>
                            )}
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
                                    📄 {language === 'fr' ? 'Document PDF' : 'PDF Document'}
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
                    {/* PAGE 1 (Front) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #FBF4E8 0%, #EFE4D2 60%, #E6D8C3 100%)',
                        borderRadius: '0 6px 6px 0',
                        backfaceVisibility: 'hidden',
                        padding: '40px', boxSizing: 'border-box',
                        borderLeft: '1px solid #D8C6B6',
                        boxShadow: 'inset 26px 0 35px rgba(0,0,0,0.12), inset 4px 0 10px rgba(43,15,20,0.08)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                        <CornerOrnament position="top-right" />
                        <CornerOrnament position="bottom-right" />

                        <div>
                            {/* Category Kicker with breathing room */}
                            <div style={{ marginBottom: '16px' }}>
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
                                    {category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 style={{
                                margin: '0 0 14px',
                                fontSize: '2.0rem',
                                fontFamily: 'Cinzel, serif',
                                color: '#2B0F14',
                                lineHeight: 1.25,
                                fontWeight: '700'
                            }}>
                                {title}
                            </h1>

                            {/* Subtitle / School / Company */}
                            <div style={{
                                fontStyle: 'italic',
                                marginBottom: '18px',
                                color: '#6A564A',
                                fontSize: '0.88rem',
                                borderBottom: '1px solid #D8C6B6',
                                paddingBottom: '10px',
                                fontFamily: "'Playfair Display', 'Lora', serif"
                            }}>
                                {affiliation ? `${affiliation} • ` : ''}{date}
                            </div>

                            {/* Description in Serif Classic Book Font */}
                            <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '6px' }}>
                                <p style={{
                                    lineHeight: '1.75',
                                    fontSize: '0.92rem',
                                    color: '#2B0F14',
                                    textAlign: 'justify',
                                    margin: 0,
                                    fontFamily: "'Playfair Display', 'Lora', serif"
                                }}>
                                    {description}
                                </p>
                            </div>

                            {/* Highlights / Points Clés Box (Combles the space harmoniously) */}
                            {techStack && techStack.length > 0 && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '10px 14px',
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
                                            border: '1px solid rgba(212,162,78,0.3)'
                                        }}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom navigation with Wax Seal Buttons for full bidirectional movement */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #D8C6B6' }}>
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
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        padding: '40px', boxSizing: 'border-box',
                        borderRight: '1px solid #D8C6B6',
                        boxShadow: 'inset -26px 0 35px rgba(0,0,0,0.12), inset -4px 0 10px rgba(43,15,20,0.08)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                        <CornerOrnament position="top-left" />
                        <CornerOrnament position="bottom-left" />

                        <div>
                            <h2 style={{
                                fontFamily: 'Cinzel, serif',
                                color: '#2B0F14',
                                marginBottom: '16px',
                                borderBottom: '2px solid #D4A24E',
                                paddingBottom: '8px',
                                fontSize: '1.6rem',
                                fontWeight: 'bold'
                            }}>
                                {language === 'fr' ? 'Technologies & Méthodes' : 'Technologies & Methods'}
                            </h2>

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

                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', borderTop: '1px solid #D8C6B6' }}>
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
                            padding: '24px',
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

                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <span style={{
                                    color: '#D4A24E',
                                    textTransform: 'uppercase',
                                    letterSpacing: '3px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    fontFamily: 'Cinzel, serif',
                                    display: 'block',
                                    marginBottom: '16px'
                                }}>
                                    {category || 'Portfolio'}
                                </span>

                                <h1 style={{
                                    color: '#F5EBDD',
                                    textAlign: 'center',
                                    fontFamily: '"Cinzel", serif',
                                    fontSize: '2.3rem',
                                    margin: '0',
                                    lineHeight: 1.25,
                                    fontWeight: 'bold'
                                }}>
                                    {title}
                                </h1>

                                <div style={{ width: '60px', height: '2px', background: '#D4A24E', margin: '20px auto 16px auto' }}></div>

                                <span style={{
                                    color: '#D8C6B6',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    fontSize: '0.75rem',
                                    fontFamily: 'Cinzel, serif'
                                }}>
                                    Klervi Choblet
                                </span>
                            </div>

                            {/* Open Action Callout on Cover */}
                            <div style={{ marginBottom: '10px' }}>
                                <WaxSealButton onClick={handleNext}>
                                    {language === 'fr' ? '📖 Ouvrir le Volume ☞' : '📖 Open Book ☞'}
                                </WaxSealButton>
                            </div>
                        </div>
                    </div>

                    {/* INSIDE COVER (Back of Cover LEAF 0) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        borderRadius: '6px 0 0 6px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        zIndex: 1
                    }}>
                        <FirstPageLeft 
                            category={category}
                            date={date}
                            video={video}
                            image={image}
                            affiliation={affiliation}
                            language={language}
                        />
                    </div>
                </animated.div>

            </div>

            {/* Close Button X */}
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '32px',
                    right: '32px',
                    background: 'rgba(30, 10, 14, 0.85)',
                    border: '1px solid rgba(212, 162, 78, 0.4)',
                    color: '#F5EBDD',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    transition: 'all 0.25s',
                    zIndex: 2000
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(166, 48, 59, 0.95)';
                    e.currentTarget.style.borderColor = '#A6303B';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(30, 10, 14, 0.85)';
                    e.currentTarget.style.borderColor = 'rgba(212, 162, 78, 0.4)';
                }}
                aria-label="Fermer"
            >
                ✕
            </button>
        </div>
    );
};

export default ProjectOverlay;
