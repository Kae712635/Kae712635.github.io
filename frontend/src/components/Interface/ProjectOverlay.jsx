import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpring, animated } from '@react-spring/web';

const ProjectOverlay = ({ project, onClose }) => {
    const { t, language } = useLanguage();
    // 0 = Closed (Cover), 1 = Spread 1 (Title/Desc), 2 = Spread 2 (Details/Tech)
    const [pageState, setPageState] = useState(0);

    // Auto-open book on mount
    useEffect(() => {
        const timer = setTimeout(() => setPageState(1), 400);
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

    const bookStyle = {
        perspective: '1500px',
        width: '900px',
        height: '600px',
        position: 'relative',
        transformStyle: 'preserve-3d',
    };

    // Cover Animation
    const { coverRotation } = useSpring({
        coverRotation: pageState > 0 ? -180 : 0,
        config: { mass: 5, tension: 400, friction: 80 }
    });

    // Leaf 1 Animation
    const [leaf1Rotation, setLeaf1Rotation] = useSpring(() => ({ rotateY: 0 }));

    useEffect(() => {
        setLeaf1Rotation({ rotateY: pageState > 1 ? -180 : 0, config: { mass: 2, tension: 300, friction: 60 } });
    }, [pageState, setLeaf1Rotation]);

    const handleNext = (e) => {
        e.stopPropagation();
        setPageState(prev => prev + 1);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (pageState > 1) setPageState(prev => prev - 1);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setPageState(0);
        setTimeout(onClose, 600);
    };

    return (
        <div 
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(10, 8, 6, 0.85)', backdropFilter: 'blur(10px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }} 
            onClick={handleClose}
        >
            {/* The Book Container */}
            <div style={bookStyle} onClick={(e) => e.stopPropagation()}>

                {/* LAYER 0: STATIC BACKING COVERS */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #1e1d1b 0%, #15100c 100%)',
                    borderRadius: '0 12px 12px 0',
                    boxShadow: '20px 20px 50px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #1e1d1b 0%, #15100c 100%)',
                    borderRadius: '12px 0 0 12px',
                    boxShadow: '-20px 20px 50px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    zIndex: 0
                }}></div>

                {/* LAYER 1: STATIC PAGES (BASE) */}
                {/* LEFT BASE PAGE (Visual / Media) */}
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: '#F5EFED',
                    borderRadius: '6px 0 0 6px',
                    zIndex: 1, padding: '36px', boxSizing: 'border-box',
                    borderRight: '1px solid #D9CCC8',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D9CCC8', paddingBottom: '10px' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#415D43', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>
                            {category || (language === 'fr' ? 'Ouvrage' : 'Book')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#8A897C', fontFamily: 'Cinzel, serif' }}>
                            {date}
                        </span>
                    </div>

                    {/* Media Block */}
                    <div style={{ width: '100%', flex: 1, margin: '20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        {video ? (
                            <div style={{ width: '100%', maxHeight: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #8A897C', background: '#15100c', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                                <video src={video} controls autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        ) : image ? (
                            <div style={{
                                width: '100%', height: '280px',
                                background: `url(${image.startsWith('/') ? image : '/img/' + image}) center/cover no-repeat`,
                                border: '1px solid #8A897C',
                                boxShadow: '0 4px 20px rgba(53, 53, 53, 0.12)',
                                borderRadius: '8px'
                            }}></div>
                        ) : (
                            <div style={{
                                width: '90%', height: '220px',
                                border: '2px dashed #8A897C',
                                borderRadius: '8px',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                color: '#8A897C', padding: '20px', textAlign: 'center'
                            }}>
                                <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📜</span>
                                <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {language === 'fr' ? 'Archive Numérique' : 'Digital Archive'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', color: '#8A897C', fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '1px' }}>
                        Ex Libris • Klervi Choblet
                    </div>
                </div>

                {/* RIGHT BASE PAGE - SPREAD 2 (Technical Details & Links) */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: '#F5EFED',
                    borderRadius: '0 6px 6px 0',
                    zIndex: 1, padding: '40px', boxSizing: 'border-box',
                    borderLeft: '1px solid #D9CCC8',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{
                            fontFamily: 'Cinzel, serif',
                            color: '#353535',
                            margin: '0 0 16px 0',
                            borderBottom: '2px solid #415D43',
                            paddingBottom: '8px',
                            fontSize: '1.6rem',
                            fontWeight: 'bold'
                        }}>
                            {language === 'fr' ? 'Détails & Références' : 'Details & References'}
                        </h2>

                        {affiliation && (
                            <div style={{ fontSize: '0.85rem', color: '#8A897C', fontStyle: 'italic', marginBottom: '16px' }}>
                                {affiliation} {date ? `• ${date}` : ''}
                            </div>
                        )}

                        {detailedDesc && (
                            <p style={{
                                lineHeight: '1.65',
                                fontSize: '0.9rem',
                                color: '#353535',
                                textAlign: 'justify',
                                marginBottom: '20px',
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {detailedDesc}
                            </p>
                        )}

                        {/* Tech stack / highlights tags */}
                        {techStack && techStack.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#415D43', marginBottom: '8px', letterSpacing: '1.5px', fontWeight: 'bold' }}>
                                    {language === 'fr' ? 'Compétences & Outils' : 'Skills & Tools'}
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {techStack.map((item, idx) => (
                                        <span key={idx} style={{
                                            background: '#EEE2DF',
                                            border: '1px solid rgba(138, 137, 124, 0.4)',
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: '#353535',
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
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                            {projectUrl && (
                                <a 
                                    href={projectUrl} target="_blank" rel="noopener noreferrer" 
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: '#415D43', color: '#ffffff',
                                        padding: '8px 16px', borderRadius: '6px',
                                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                        textDecoration: 'none', letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(65, 93, 67, 0.3)'
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
                                        background: 'transparent', color: '#353535',
                                        border: '1px solid #8A897C',
                                        padding: '8px 16px', borderRadius: '6px',
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
                                        background: '#B36A5E', color: '#ffffff',
                                        padding: '8px 16px', borderRadius: '6px',
                                        fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                        textDecoration: 'none', letterSpacing: '0.05em'
                                    }}
                                >
                                    📄 {language === 'fr' ? 'Consulter Document' : 'View Document'}
                                </a>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #D9CCC8' }}>
                            <button 
                                onClick={handlePrev} 
                                style={{
                                    background: 'none', border: '1px solid #8A897C', borderRadius: '4px',
                                    color: '#415D43', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', fontWeight: 'bold',
                                    padding: '6px 12px', cursor: 'pointer'
                                }}
                            >
                                {language === 'fr' ? '☜ Retour' : '☜ Back'}
                            </button>
                            <span style={{ fontSize: '0.75rem', color: '#8A897C' }}>2</span>
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
                        background: '#F5EFED',
                        borderRadius: '0 6px 6px 0',
                        backfaceVisibility: 'hidden',
                        padding: '40px', boxSizing: 'border-box',
                        borderLeft: '1px solid #D9CCC8',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.03)'
                    }}>
                        <div>
                            {/* Category Badge */}
                            <div style={{ marginBottom: '12px' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    color: '#415D43',
                                    letterSpacing: '2.5px',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #415D43',
                                    paddingBottom: '3px',
                                    display: 'inline-block'
                                }}>
                                    {category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 style={{
                                margin: '0 0 12px',
                                fontSize: '2.2rem',
                                fontFamily: 'Cinzel, serif',
                                color: '#353535',
                                lineHeight: 1.2,
                                fontWeight: '700'
                            }}>
                                {title}
                            </h1>

                            {/* Subtitle / School / Company */}
                            <div style={{
                                fontStyle: 'italic',
                                marginBottom: '20px',
                                color: '#8A897C',
                                fontSize: '0.9rem',
                                borderBottom: '1px solid #D9CCC8',
                                paddingBottom: '12px'
                            }}>
                                {affiliation ? `${affiliation} • ` : ''}{date}
                            </div>

                            {/* Description */}
                            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
                                <p style={{
                                    lineHeight: '1.75',
                                    fontSize: '0.95rem',
                                    color: '#353535',
                                    textAlign: 'justify',
                                    margin: 0
                                }}>
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Bottom navigation */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #D9CCC8' }}>
                            <span style={{ fontSize: '0.75rem', color: '#8A897C' }}>1</span>
                            {pageState === 1 && (
                                <button 
                                    onClick={handleNext} 
                                    style={{
                                        background: '#415D43',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        color: '#ffffff',
                                        fontFamily: 'Cinzel, serif',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.05em',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 12px rgba(65, 93, 67, 0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {language === 'fr' ? 'Détails ☞' : 'Details ☞'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* PAGE 2 (Back - Flipped Left) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#F5EFED',
                        borderRadius: '6px 0 0 6px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        padding: '40px', boxSizing: 'border-box',
                        borderRight: '1px solid #D9CCC8',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.03)'
                    }}>
                        <div>
                            <h2 style={{
                                fontFamily: 'Cinzel, serif',
                                color: '#353535',
                                marginBottom: '16px',
                                borderBottom: '2px solid #415D43',
                                paddingBottom: '8px',
                                fontSize: '1.6rem',
                                fontWeight: 'bold'
                            }}>
                                {language === 'fr' ? 'Technologies & Méthodes' : 'Technologies & Methods'}
                            </h2>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                {techStack && techStack.map((t, idx) => (
                                    <span key={idx} style={{
                                        background: '#EEE2DF',
                                        border: '1px solid rgba(138, 137, 124, 0.5)',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        color: '#353535',
                                        fontWeight: '600'
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', borderTop: '1px solid #D9CCC8' }}>
                            <span style={{ fontSize: '0.75rem', color: '#8A897C' }}>2</span>
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
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #1e1d1b 0%, #15100c 100%)',
                        borderRadius: '0 12px 12px 0',
                        backfaceVisibility: 'hidden',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.5), -5px 0 20px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        padding: '36px', boxSizing: 'border-box'
                    }}>
                        <div style={{
                            border: '1px solid rgba(212, 175, 55, 0.5)',
                            padding: '24px',
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            background: 'rgba(65, 93, 67, 0.08)',
                            borderRadius: '6px'
                        }}>
                            {/* Gold Corners */}
                            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderTop: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }}></div>
                            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderTop: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }}></div>
                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderBottom: '2px solid #D4AF37', borderLeft: '2px solid #D4AF37' }}></div>
                            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderBottom: '2px solid #D4AF37', borderRight: '2px solid #D4AF37' }}></div>

                            <span style={{
                                color: '#D4AF37',
                                textTransform: 'uppercase',
                                letterSpacing: '3px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                fontFamily: 'Cinzel, serif',
                                marginBottom: '16px'
                            }}>
                                {category || 'Portfolio'}
                            </span>

                            <h1 style={{
                                color: '#EEE2DF',
                                textAlign: 'center',
                                fontFamily: '"Cinzel", serif',
                                fontSize: '2.4rem',
                                margin: '0',
                                lineHeight: 1.25,
                                fontWeight: 'bold'
                            }}>
                                {title}
                            </h1>

                            <div style={{ width: '60px', height: '2px', background: '#D4AF37', margin: '24px 0' }}></div>

                            <span style={{
                                color: '#8A897C',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontSize: '0.75rem',
                                fontFamily: 'Cinzel, serif'
                            }}>
                                Klervi Choblet
                            </span>
                        </div>
                    </div>

                    {/* INSIDE COVER */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#F5EFED',
                        borderRadius: '12px 0 0 12px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.05)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div style={{
                            width: '85%', height: '85%',
                            border: '1px solid #D9CCC8',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            borderRadius: '4px'
                        }}>
                            <div style={{ color: '#8A897C', fontFamily: 'Cinzel, serif', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                Ex Libris • Klervi Choblet
                            </div>
                        </div>
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
                    background: 'rgba(30, 29, 27, 0.8)',
                    border: '1px solid rgba(238, 226, 223, 0.3)',
                    color: '#EEE2DF',
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
                    e.currentTarget.style.background = 'rgba(65, 93, 67, 0.9)';
                    e.currentTarget.style.borderColor = '#415D43';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(30, 29, 27, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(238, 226, 223, 0.3)';
                }}
                aria-label="Fermer"
            >
                ✕
            </button>
        </div>
    );
};

export default ProjectOverlay;
