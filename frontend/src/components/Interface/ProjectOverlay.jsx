import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpring, animated } from '@react-spring/web';

/* 
  Advanced CSS 3D Flipbook - Revised for proper visibility
*/

const ProjectOverlay = ({ project, onClose }) => {
    const { t, language } = useLanguage();
    // 0 = Closed (Cover), 1 = Spread 1, 2 = Spread 2
    const [pageState, setPageState] = useState(0);

    // Auto-open on mount
    useEffect(() => {
        const timer = setTimeout(() => setPageState(1), 500);
        return () => clearTimeout(timer);
    }, []);

    const description = project.description && project.description[language]
        ? project.description[language]
        : project.description?.en || project.description || "No description available.";

    const details = project.details && project.details[language]
        ? project.details[language]
        : (project.details?.en || null);

    // Dynamic styles for the book
    const bookStyle = {
        perspective: '1500px',
        width: '900px', // Total open width
        height: '600px',
        position: 'relative',
        transformStyle: 'preserve-3d',
    };

    // Cover Animation
    const { coverRotation } = useSpring({
        coverRotation: pageState > 0 ? -180 : 0,
        config: { mass: 5, tension: 400, friction: 80 }
    });

    // Leaf 1 Animation (Page 1 -> Page 2)
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
        setPageState(0); // Close book
        setTimeout(onClose, 800); // Wait for animation
    };

    if (!project) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }} onClick={handleClose}>

            {/* The Book Container */}
            <div style={bookStyle} onClick={(e) => e.stopPropagation()}>

                {/* 
                   LAYER 0: STATIC BACKING - LIGHT ELEGANT COVERS
                   Left Back & Right Back covers.
                */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: '0 10px 10px 0',
                    boxShadow: '20px 20px 50px rgba(0,0,0,0.15)',
                    border: '1px solid #dee2e6',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: '10px 0 0 10px',
                    border: '1px solid #dee2e6',
                    zIndex: 0
                }}></div>

                {/* 
                   LAYER 1: STATIC PAGES (BASE)
                   Left Base: Page with Image (Beige) - Visible when book opens
                   Right Base: Page 3 (Tech Details) - Visible when Leaf 1 flips away.
                */}

                {/* LEFT PAGE - IMAGE (LAVENDER STYLE) */}
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: '#f8f4ff',
                    borderRadius: '5px 0 0 5px',
                    zIndex: 1, padding: '40px', boxSizing: 'border-box',
                    borderRight: '1px solid #e0d4f7',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    {/* IMAGE CONTENT */}
                    {project.image ? (
                        <div style={{
                            width: '100%', height: '70%',
                            background: `url(${project.image.startsWith('/') ? project.image : '/img/' + project.image}) center/contain no-repeat`,
                            border: '1px solid #e0d4f7',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            marginBottom: '20px',
                            borderRadius: '4px',
                            backgroundColor: '#fff'
                        }}></div>
                    ) : (
                        <div style={{
                            width: '80%', height: '60%',
                            border: '2px dashed #d4c5f9',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#8b7ab8', fontStyle: 'italic',
                            borderRadius: '4px'
                        }}>
                            No Visual Available
                        </div>
                    )}

                    <div style={{ textAlign: 'center', color: '#8b7ab8', fontStyle: 'italic', fontSize: '0.85rem', letterSpacing: '1px', marginTop: '10px' }}>
                        Ex Libris • Klervi Choblet
                    </div>
                </div>

                {/* RIGHT BASE - PAGE 3 (TECH DETAILS) - Visible after page turn */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: '#f8f4ff',
                    borderRadius: '0 5px 5px 0',
                    zIndex: 1, padding: '40px', boxSizing: 'border-box',
                    borderLeft: '1px solid #e0d4f7',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    <h2 style={{
                        fontFamily: 'serif',
                        color: '#4a3b5c',
                        marginBottom: '25px',
                        borderBottom: '2px solid #7c5cdb',
                        paddingBottom: '10px',
                        fontSize: '2rem',
                        width: '100%'
                    }}>
                        Visual Reference
                    </h2>

                    {/* Duplicate image for page 3 */}
                    {project.image ? (
                        <div style={{
                            width: '100%', height: '60%',
                            background: `url(${project.image.startsWith('/') ? project.image : '/img/' + project.image}) center/cover no-repeat`,
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            marginBottom: '20px',
                            borderRadius: '4px'
                        }}></div>
                    ) : (
                        <div style={{
                            width: '80%', height: '60%',
                            border: '2px dashed #d4c5f9',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#8b7ab8', fontStyle: 'italic',
                            borderRadius: '4px'
                        }}>
                            No Visual Available
                        </div>
                    )}

                    <div style={{ textAlign: 'center', color: '#6c5b7b', fontStyle: 'italic', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        {t('visualReference') || "Project Screenshot"}
                    </div>

                    <button onClick={handlePrev} style={{
                        position: 'absolute', bottom: '30px', left: '40px',
                        background: '#fff',
                        border: '2px solid #7c5cdb',
                        cursor: 'pointer',
                        fontSize: '1rem', color: '#7c5cdb', fontWeight: '600',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 10px rgba(124, 92, 219, 0.2)',
                        transition: 'all 0.2s'
                    }}>
                        ☜ Back
                    </button>
                </div>


                {/* 
                   LAYER 2: LEAF 1 (FLIPPER)
                   Front: Page 1 (Title/Desc)
                   Back: Page 2 (Tech/Links) - Visible when flipped to left.
                */}
                <animated.div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    zIndex: leaf1Rotation.rotateY.to(y => (y < -90 ? 20 : 5)),
                    rotateY: leaf1Rotation.rotateY
                }}>
                    {/* PAGE 1 (Front) - LIGHT ELEGANT STYLE */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#f8f4ff',
                        borderRadius: '0 5px 5px 0',
                        backfaceVisibility: 'hidden',
                        padding: '50px 40px', boxSizing: 'border-box',
                        borderLeft: '1px solid #e0d4f7',
                        boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.02)'
                    }}>
                        {/* Category Label */}
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                color: '#7c5cdb',
                                letterSpacing: '3px',
                                fontWeight: '700',
                                borderBottom: '2px solid #7c5cdb',
                                paddingBottom: '5px',
                                display: 'inline-block'
                            }}>
                                {Array.isArray(project.category) ? project.category.join(' & ') : project.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            margin: '0 0 15px',
                            fontSize: '2.8rem',
                            fontFamily: 'serif',
                            color: '#4a3b5c',
                            lineHeight: 1.2
                        }}>
                            {project.title}
                        </h1>

                        {/* Subtitle */}
                        <div style={{
                            fontStyle: 'italic',
                            marginBottom: '30px',
                            color: '#8b7ab8',
                            fontSize: '0.95rem',
                            borderBottom: '1px solid #e0d4f7',
                            paddingBottom: '20px'
                        }}>
                            {project.school || project.course || project.personal_project || 'Project'} • {project.date ? project.date.split('-')[0] : ''}
                        </div>

                        {/* Description */}
                        <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '10px' }}>
                            <p style={{
                                lineHeight: '1.9',
                                fontSize: '1.05rem',
                                color: '#4a3b5c',
                                textAlign: 'justify',
                                marginBottom: '20px'
                            }}>
                                {description}
                            </p>
                            {details && (
                                <p style={{
                                    lineHeight: '1.8',
                                    fontSize: '0.95rem',
                                    color: '#6c5b7b',
                                    marginTop: '20px',
                                    textAlign: 'justify',
                                    fontStyle: 'italic'
                                }}>
                                    {details}
                                </p>
                            )}
                        </div>

                        {/* Tech Stack Preview at bottom */}
                        {project.tech && project.tech.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '80px',
                                left: '40px',
                                right: '40px'
                            }}>
                                <h3 style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    color: '#8b7ab8',
                                    marginBottom: '12px',
                                    letterSpacing: '2px',
                                    fontWeight: '600'
                                }}>
                                    Technical Stack
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {project.tech.slice(0, 6).map((t, i) => (
                                        <span key={i} style={{
                                            background: '#fff',
                                            border: '1px solid #d4c5f9',
                                            padding: '6px 12px',
                                            borderRadius: '15px',
                                            fontSize: '0.8rem',
                                            color: '#6c5b7b',
                                            fontWeight: '500'
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                    {project.tech.length > 6 && (
                                        <span style={{
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                            color: '#a89bb9',
                                            fontStyle: 'italic'
                                        }}>
                                            +{project.tech.length - 6} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Pagination / Next Hint */}
                        <div style={{ position: 'absolute', bottom: '30px', right: '40px' }}>
                            {pageState === 1 && (
                                <button onClick={handleNext} style={{
                                    background: '#7c5cdb',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    color: '#fff',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 15px rgba(124, 92, 219, 0.3)',
                                    transition: 'all 0.2s'
                                }}>
                                    View Details ☞
                                </button>
                            )}
                        </div>
                        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: '#a89bb9' }}>1</div>
                    </div>

                    {/* PAGE 2 (Back - Tech Stack & Links) - LIGHT ELEGANT STYLE */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#f8f4ff',
                        borderRadius: '5px 0 0 5px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        padding: '50px 40px', boxSizing: 'border-box',
                        borderRight: '1px solid #e0d4f7',
                        display: 'flex', flexDirection: 'column',
                        boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.02)'
                    }}>
                        <h2 style={{
                            fontFamily: 'serif',
                            color: '#4a3b5c',
                            marginBottom: '25px',
                            borderBottom: '2px solid #7c5cdb',
                            paddingBottom: '10px',
                            fontSize: '2rem'
                        }}>
                            Technical Details
                        </h2>

                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                color: '#8b7ab8',
                                marginBottom: '15px',
                                letterSpacing: '2px',
                                fontWeight: '600'
                            }}>Technologies</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {project.tech && project.tech.map((t, i) => (
                                    <span key={i} style={{
                                        background: '#fff',
                                        border: '1px solid #d4c5f9',
                                        padding: '10px 16px',
                                        borderRadius: '15px',
                                        fontSize: '0.9rem',
                                        color: '#6c5b7b',
                                        fontWeight: '500',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                color: '#8b7ab8',
                                marginBottom: '15px',
                                letterSpacing: '2px',
                                fontWeight: '600'
                            }}>Access</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {(project.project_url || project.link) && (
                                    <a href={project.project_url || project.link} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        color: '#fff', fontWeight: '600', fontSize: '1.1rem', textDecoration: 'none',
                                        padding: '12px 20px',
                                        background: '#7c5cdb',
                                        borderRadius: '20px',
                                        width: 'fit-content',
                                        boxShadow: '0 4px 15px rgba(124, 92, 219, 0.3)',
                                        transition: 'all 0.2s'
                                    }}>
                                        <span>🚀</span> Visit Live Project
                                    </a>
                                )}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        color: '#7c5cdb', fontSize: '1.1rem', textDecoration: 'none',
                                        padding: '12px 20px',
                                        border: '2px solid #7c5cdb',
                                        borderRadius: '20px',
                                        width: 'fit-content',
                                        background: '#fff',
                                        boxShadow: '0 4px 15px rgba(124, 92, 219, 0.2)',
                                        transition: 'all 0.2s',
                                        fontWeight: '600'
                                    }}>
                                        <span>🐙</span> View Source Code
                                    </a>
                                )}
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: '#a89bb9' }}>2</div>
                    </div>
                </animated.div>


                {/* 
                   LAYER 3: COVER (LEAF 0)
                   Front: Cover Design
                   Back: Inside Cover (Ex Libris)
                */}
                <animated.div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    zIndex: 10,
                    rotateY: coverRotation
                }}>
                    {/* FRONT COVER - LIGHT ELEGANT STYLE */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f4ff 100%)',
                        borderRadius: '0 10px 10px 0',
                        backfaceVisibility: 'hidden',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        boxShadow: 'inset 5px 0 15px rgba(0,0,0,0.05), -5px 0 20px rgba(0,0,0,0.1)',
                        border: '2px solid #e0d4f7',
                        padding: '40px'
                    }}>
                        <div style={{
                            border: '3px solid #7c5cdb',
                            padding: '30px',
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            boxShadow: 'inset 0 0 30px rgba(124, 92, 219, 0.05)'
                        }}>
                            {/* Decorative Corners - Purple */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', borderTop: '4px solid #7c5cdb', borderLeft: '4px solid #7c5cdb' }}></div>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderTop: '4px solid #7c5cdb', borderRight: '4px solid #7c5cdb' }}></div>
                            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', borderBottom: '4px solid #7c5cdb', borderLeft: '4px solid #7c5cdb' }}></div>
                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderBottom: '4px solid #7c5cdb', borderRight: '4px solid #7c5cdb' }}></div>

                            <h1 style={{
                                color: '#4a3b5c',
                                textAlign: 'center',
                                fontFamily: '"Cinzel", serif',
                                fontSize: '3.5rem',
                                margin: '0',
                                lineHeight: 1.2
                            }}>
                                {project.title}
                            </h1>
                            <div style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, #7c5cdb, transparent)', margin: '30px 0' }}></div>
                            <span style={{
                                color: '#8b7ab8',
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                fontSize: '1.2rem',
                                fontWeight: '600'
                            }}>
                                {Array.isArray(project.category) ? project.category[0] : project.category}
                            </span>
                        </div>
                    </div>

                    {/* INSIDE COVER (Left visible when open) - LAVENDER STYLE */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#f8f4ff',
                        borderRadius: '10px 0 0 10px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.05)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {/* Ex Libris Pattern */}
                        <div style={{
                            width: '80%', height: '80%',
                            border: '1px solid #e0d4f7',
                            backgroundImage: 'radial-gradient(#d4c5f9 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            opacity: 0.3
                        }}></div>
                        <div style={{ position: 'absolute', bottom: '30px', color: '#8b7ab8', fontFamily: 'serif', fontStyle: 'italic' }}>
                            Ex Libris • Klervi Choblet
                        </div>
                    </div>
                </animated.div>

            </div>

            {/* Close Button X outside */}
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    background: 'none',
                    border: '2px solid rgba(255,255,255,0.5)',
                    color: 'white',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    transition: 'all 0.3s',
                    zIndex: 2000
                }}
                onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.borderColor = 'white';
                }}
                onMouseLeave={e => {
                    e.target.style.background = 'none';
                    e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
            >
                ✕
            </button>
        </div>
    );
};

export default ProjectOverlay;
