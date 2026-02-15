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
                   LAYER 0: STATIC BACKING
                   Left Back & Right Back covers.
                */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: '#2a1a10', borderRadius: '0 10px 10px 0',
                    boxShadow: '20px 20px 50px rgba(0,0,0,0.6)',
                    zIndex: 0
                }}></div>
                <div style={{
                    position: 'absolute', left: 0, width: '450px', height: '600px',
                    background: '#2a1a10', borderRadius: '10px 0 0 10px',
                    zIndex: 0
                }}></div>

                {/* 
                   LAYER 1: STATIC PAGES (BASE)
                   Right Base: Page 3 (Image) - Visible when Leaf 1 flips away.
                   Left Base: Hidden by Leaf 1 Back.
                */}
                <div style={{
                    position: 'absolute', right: 0, width: '450px', height: '600px',
                    background: '#fdf6e3', borderRadius: '0 5px 5px 0',
                    zIndex: 1, padding: '40px', boxSizing: 'border-box',
                    borderLeft: '1px solid #e0d0b0',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                }}>
                    {/* PAGE 3 CONTENT: Image */}
                    {project.image ? (
                        <div style={{
                            width: '100%', height: '70%',
                            background: `url(${project.image.startsWith('/') ? project.image : '/img/' + project.image}) center/cover no-repeat`,
                            border: '8px solid white',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            marginBottom: '20px'
                        }}></div>
                    ) : (
                        <div style={{
                            width: '80%', height: '60%',
                            border: '2px dashed #d0c0a0',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#8b5a2b', fontStyle: 'italic'
                        }}>
                            No Visual Available
                        </div>
                    )}

                    <div style={{ textAlign: 'center', color: '#8b5a2b', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        {t('visualReference') || "Visual Reference"}
                    </div>

                    <button onClick={handlePrev} style={{
                        position: 'absolute', bottom: '30px', left: '40px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1.2rem', color: '#8b5a2b', fontWeight: 'bold'
                    }}>
                        ☜ Back to Details
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
                    {/* PAGE 1 (Front) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#fdf6e3', borderRadius: '0 5px 5px 0',
                        backfaceVisibility: 'hidden',
                        padding: '50px 40px', boxSizing: 'border-box',
                        borderLeft: '2px solid #e0d0b0', // Gutter
                        boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ borderBottom: '2px solid #d4af37', paddingBottom: '15px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#8b5a2b', letterSpacing: '2px', fontWeight: 'bold' }}>
                                {Array.isArray(project.category) ? project.category.join(' & ') : project.category}
                            </span>
                            <h1 style={{ margin: '15px 0 5px', fontSize: '2.8rem', fontFamily: 'serif', color: '#2a1a10', lineHeight: 1 }}>
                                {project.title}
                            </h1>
                            <div style={{ fontStyle: 'italic', marginTop: '10px', color: '#666' }}>
                                {project.school || project.course || project.personal_project || 'Project'} • {project.date ? project.date.split('-')[0] : ''}
                            </div>
                        </div>

                        <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
                            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#2a1a10', textAlign: 'justify' }}>
                                {description}
                            </p>
                            {details && (
                                <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#4a3b30', marginTop: '20px', textAlign: 'justify' }}>
                                    {details}
                                </p>
                            )}
                        </div>

                        {/* Pagination / Next Hint */}
                        <div style={{ position: 'absolute', bottom: '30px', right: '40px' }}>
                            {pageState === 1 && (
                                <button onClick={handleNext} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: '1.2rem', color: '#d4af37', fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', gap: '5px'
                                }}>
                                    Technical Stack ☞
                                </button>
                            )}
                        </div>
                        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: '#ccc' }}>1</div>
                    </div>

                    {/* PAGE 2 (Back - Tech Stack & Links) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#fdf6e3', borderRadius: '5px 0 0 5px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        padding: '50px 40px', boxSizing: 'border-box',
                        borderRight: '2px solid #e0d0b0', // Gutter
                        display: 'flex', flexDirection: 'column',
                        boxShadow: 'inset -10px 0 20px rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{ fontFamily: 'serif', color: '#2a1a10', marginBottom: '25px', borderBottom: '1px solid #d4af37', paddingBottom: '10px' }}>
                            Technical Details
                        </h2>

                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#8b5a2b', marginBottom: '15px' }}>Technologies</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {project.tech && project.tech.map((t, i) => (
                                    <span key={i} style={{
                                        background: '#fff',
                                        border: '1px solid #d0c0a0',
                                        padding: '8px 14px',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        color: '#3e2723',
                                        fontWeight: '500',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#8b5a2b', marginBottom: '15px' }}>Access</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {(project.project_url || project.link) && (
                                    <a href={project.project_url || project.link} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        color: '#d4af37', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none',
                                        padding: '10px', background: '#2a1a10', borderRadius: '4px', width: 'fit-content'
                                    }}>
                                        <span>🚀</span> Visit Live Project
                                    </a>
                                )}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        color: '#3e2723', fontSize: '1.1rem', textDecoration: 'none',
                                        padding: '10px', border: '1px solid #3e2723', borderRadius: '4px', width: 'fit-content'
                                    }}>
                                        <span>🐙</span> View Source Code
                                    </a>
                                )}
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: '#ccc' }}>2</div>
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
                    {/* FRONT COVER */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #3e2723 0%, #2a1a10 100%)',
                        borderRadius: '0 10px 10px 0',
                        backfaceVisibility: 'hidden',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.5), -5px 0 15px rgba(0,0,0,0.3)',
                        border: '4px solid #5d4037',
                        padding: '40px'
                    }}>
                        <div style={{
                            border: '2px solid #d4af37', padding: '20px', width: '100%', height: '100%', boxSizing: 'border-box',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            position: 'relative'
                        }}>
                            {/* Decorative Corners */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', borderTop: '4px solid #d4af37', borderLeft: '4px solid #d4af37' }}></div>
                            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderTop: '4px solid #d4af37', borderRight: '4px solid #d4af37' }}></div>
                            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', borderBottom: '4px solid #d4af37', borderLeft: '4px solid #d4af37' }}></div>
                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderBottom: '4px solid #d4af37', borderRight: '4px solid #d4af37' }}></div>

                            <h1 style={{ color: '#d4af37', textAlign: 'center', fontFamily: '"Cinzel", serif', fontSize: '3.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)', margin: '0' }}>
                                {project.title}
                            </h1>
                            <div style={{ width: '80px', height: '3px', background: '#d4af37', margin: '30px 0' }}></div>
                            <span style={{ color: '#c4a484', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '1.2rem' }}>
                                {Array.isArray(project.category) ? project.category[0] : project.category}
                            </span>
                        </div>
                    </div>

                    {/* INSIDE COVER (Left visible when open) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: '#f5e6d3', // Slightly darker paper
                        borderRadius: '10px 0 0 10px',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.1)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {/* Ex Libris Pattern */}
                        <div style={{
                            width: '80%', height: '80%',
                            border: '1px solid #d0c0a0',
                            backgroundImage: 'radial-gradient(#d0c0a0 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                            opacity: 0.5
                        }}></div>
                        <div style={{ position: 'absolute', bottom: '30px', color: '#8b5a2b', fontFamily: 'serif', fontStyle: 'italic' }}>
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
