import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import Library from '../Library/Library';
import ProjectOverlay from '../Interface/ProjectOverlay';
import KeyboardControls from './KeyboardControls';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';

const CameraController = ({ view, targetCategory, navTrigger }) => {
    const { camera, controls } = useThree();
    const [isAnimating, setIsAnimating] = useState(false);
    const transitionTimeout = useRef(null);
    const { isReducedMotion } = useAccessibility();

    useEffect(() => {
        setIsAnimating(true);
        if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
        transitionTimeout.current = setTimeout(() => {
            setIsAnimating(false);
        }, isReducedMotion ? 100 : 3000);

        return () => clearTimeout(transitionTimeout.current);
    }, [view, targetCategory, navTrigger, isReducedMotion]);

    useFrame((state, delta) => {
        if (!isAnimating) return;

        const isMobilePortrait = typeof window !== 'undefined' && window.innerWidth < 640 && window.innerHeight > window.innerWidth;
        const zOffset = isMobilePortrait ? 2.5 : 0;

        let targetPos = [0, 1.6, 9 + zOffset]; // Library Entrance
        let targetLookAt = [0, 1.6, -10];

        if (view === 'contact') {
            targetPos = [-2, 1.6, 7 + zOffset];
            targetLookAt = [-4, 1.4, 6];
        } else if (targetCategory) {
            const zMap = {
                'EXPÉRIENCES PROFESSIONNELLES': -5,
                'WORK EXPERIENCES': -5,
                'Expériences Pro': -5,
                'Work Experiences': -5,
                'PROJETS PHARES': -14,
                'FEATURED PROJECTS': -14,
                'Projets Web & 3D': -14,
                'Web & 3D Projects': -14,
                'COMPÉTENCES TECH & LANGUES': -23,
                'TECH SKILLS & LANGUAGES': -23,
                'Compétences Tech': -23,
                'Tech Skills': -23,
                'FORMATIONS & DIPLÔMES': -32,
                'EDUCATION & DEGREES': -32,
                'Formations & Diplômes': -32,
                'Education & Degrees': -32,
            };
            const z = zMap[targetCategory] || -14;
            targetPos = [0, 1.6, z + 5 + (isMobilePortrait ? 1.5 : 0)];
            targetLookAt = [0, 1.6, z - 4];
        }

        if (isReducedMotion) {
            state.camera.position.set(...targetPos);
            if (controls) controls.target.set(...targetLookAt);
            setIsAnimating(false);
        } else {
            damp3(state.camera.position, targetPos, 0.35, delta);
            if (controls) {
                damp3(controls.target, targetLookAt, 0.35, delta);
            }
        }
    });

    return null;
};

const Scene = ({ children }) => {
    const [view, setView] = useState('universe');
    const [targetCategory, setTargetCategory] = useState(null);
    const [navTrigger, setNavTrigger] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const location = useLocation();
    const { t, language } = useLanguage();
    const { announce, isReducedMotion } = useAccessibility();

    const handleProjectClick = useCallback((project) => {
        setSelectedProject(project);
        announce(language === 'fr' ? `Ouverture de l'ouvrage : ${project.title}` : `Opening book: ${project.title}`);
    }, [announce, language]);

    const handleCloseProject = useCallback(() => {
        setSelectedProject(null);
        announce(language === 'fr' ? "Fermeture de l'ouvrage." : "Closed book.");
    }, [announce, language]);

    const handleCategoryClick = useCallback((catName) => {
        setTargetCategory(catName);
        setView('section');
        setNavTrigger(prev => prev + 1);
        announce(language === 'fr' ? `Navigation vers la travée : ${catName}` : `Navigating to bay: ${catName}`);
    }, [announce, language]);

    const handleBackToEntrance = useCallback(() => {
        setView('universe');
        setTargetCategory(null);
        setNavTrigger(prev => prev + 1);
        announce(language === 'fr' ? "Retour à l'entrée de la bibliothèque." : "Returned to library entrance.");
    }, [announce, language]);

    const is2DPage = location.pathname !== '/';

    // Global keyboard shortcuts for 3D navigation (1: Entrance, 2-5: Bays)
    useEffect(() => {
        if (is2DPage) return;

        const handleKeyDown = (e) => {
            // Ignore if typing in an input or textarea
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
            if (selectedProject) return; // Project modal is open

            const code = e.code;
            const key = e.key;

            if (code === 'Digit1' || code === 'Numpad1' || key === '1' || key === '&' || key === 'Escape') {
                e.preventDefault();
                handleBackToEntrance();
            } else if (code === 'Digit2' || code === 'Numpad2' || key === '2' || key === 'é') {
                e.preventDefault();
                handleCategoryClick(language === 'fr' ? 'EXPÉRIENCES PROFESSIONNELLES' : 'WORK EXPERIENCES');
            } else if (code === 'Digit3' || code === 'Numpad3' || key === '3' || key === '"') {
                e.preventDefault();
                handleCategoryClick(language === 'fr' ? 'PROJETS PHARES' : 'FEATURED PROJECTS');
            } else if (code === 'Digit4' || code === 'Numpad4' || key === '4' || key === "'") {
                e.preventDefault();
                handleCategoryClick(language === 'fr' ? 'COMPÉTENCES TECH & LANGUES' : 'TECH SKILLS & LANGUAGES');
            } else if (code === 'Digit5' || code === 'Numpad5' || key === '5' || key === '(') {
                e.preventDefault();
                handleCategoryClick(language === 'fr' ? 'FORMATIONS & DIPLÔMES' : 'EDUCATION & DEGREES');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [is2DPage, selectedProject, language, handleCategoryClick, handleBackToEntrance]);

    return (
        <div 
            style={{ 
                width: '100vw', 
                height: '100vh', 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                pointerEvents: is2DPage ? 'none' : 'auto'
            }}
            aria-hidden={is2DPage}
        >
            {selectedProject && <ProjectOverlay project={selectedProject} onClose={handleCloseProject} />}

            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
                <Canvas 
                    shadows={{ type: THREE.PCFSoftShadowMap }}
                    camera={{ position: [0, 1.6, 9], fov: 50 }}
                    dpr={[1, 1.5]} 
                    performance={{ min: 0.6 }}
                    gl={{
                        antialias: true,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.25
                    }}
                >
                    {/* Deep Atmospheric Night Background & Fog */}
                    <color attach="background" args={['#0F0B0D']} />
                    <fog attach="fog" args={['#0F0B0D', 15, 60]} />

                    {/* Warm Ambient Light to lift deep shadows naturally */}
                    <ambientLight intensity={1.1} color="#F8EFE6" />

                    {/* Main Architectural Directional Key Light */}
                    <directionalLight
                        position={[-10, 20, 12]}
                        intensity={1.45}
                        color="#FFF2DB"
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-bias={-0.0001}
                        shadow-normalBias={0.035}
                        shadow-camera-near={0.5}
                        shadow-camera-far={70}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={25}
                        shadow-camera-bottom={-40}
                    />

                    {/* Soft Nocturnal Teal Fill Light */}
                    <directionalLight
                        position={[10, 14, -18]}
                        intensity={0.65}
                        color="#3C6E71"
                    />

                    {/* Soft Warm Vault Fill Lights along Corridor */}
                    <pointLight position={[0, 7.0, 0]} intensity={0.7} color="#FFE0B2" distance={24} decay={2} />
                    <pointLight position={[0, 7.0, -20]} intensity={0.7} color="#FFE0B2" distance={24} decay={2} />

                    <Suspense fallback={null}>
                        <Library
                            view={view}
                            onProjectClick={handleProjectClick}
                            onCategoryClick={handleCategoryClick}
                            selectedProject={selectedProject}
                        />
                        {children}
                    </Suspense>

                    {/* Cinematic Post-Processing Effects */}
                    <EffectComposer disableNormalPass multisampling={0}>
                        <Bloom 
                            intensity={0.7} 
                            luminanceThreshold={0.82} 
                            luminanceSmoothing={0.35} 
                            mipmapBlur 
                        />
                        <Vignette darkness={0.4} offset={0.35} />
                    </EffectComposer>

                    <CameraController view={view} targetCategory={targetCategory} navTrigger={navTrigger} />
                    <KeyboardControls disabled={!!selectedProject} />
                    <OrbitControls
                        makeDefault
                        enableRotate={false}
                        enableZoom={false}
                        enablePan={false}
                        target={[0, 1.6, -10]}
                    />
                </Canvas>
            </div>
        </div>
    );
};

export default Scene;
