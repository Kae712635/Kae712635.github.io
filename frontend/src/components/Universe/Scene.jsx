import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import Library from '../Library/Library';
import ProjectOverlay from '../Interface/ProjectOverlay';
import KeyboardControls from './KeyboardControls';
import { useLanguage } from '../../context/LanguageContext';

const CameraController = ({ view, targetCategory }) => {
    const { camera, controls } = useThree();
    const [isAnimating, setIsAnimating] = useState(false);
    const transitionTimeout = useRef(null);

    useEffect(() => {
        setIsAnimating(true);
        if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
        transitionTimeout.current = setTimeout(() => {
            setIsAnimating(false);
        }, 3000);

        return () => clearTimeout(transitionTimeout.current);
    }, [view, targetCategory]);

    useFrame((state, delta) => {
        if (!isAnimating) return;

        let targetPos = [0, 1.6, 9]; // Library Entrance
        let targetLookAt = [0, 1.6, -10];

        if (view === 'contact') {
            targetPos = [-2, 1.6, 7];
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
            targetPos = [0, 1.6, z + 5];
            targetLookAt = [0, 1.6, z - 4];
        }

        damp3(state.camera.position, targetPos, 0.35, delta);
        if (controls) {
            damp3(controls.target, targetLookAt, 0.35, delta);
        }
    });

    return null;
};

const Scene = ({ children }) => {
    const [view, setView] = useState('universe');
    const [targetCategory, setTargetCategory] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const location = useLocation();
    const { language } = useLanguage();

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleCloseProject = () => {
        setSelectedProject(null);
    };

    const handleCategoryClick = (catName) => {
        setTargetCategory(catName);
        setView('section');
    };

    const handleBackToEntrance = () => {
        setView('universe');
        setTargetCategory(null);
    };

    const is2DPage = location.pathname !== '/';

    return (
        <div style={{ 
            width: '100vw', 
            height: '100vh', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            pointerEvents: is2DPage ? 'none' : 'auto'
        }}>
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
                        toneMappingExposure: 1.15
                    }}
                >
                    {/* Bright Warm Library Background */}
                    <color attach="background" args={['#EEE2DF']} />

                    {/* Ambient Light */}
                    <ambientLight intensity={0.8} color="#fff8f2" />

                    {/* Main Architectural Directional Light */}
                    <directionalLight
                        position={[-12, 22, 10]}
                        intensity={1.25}
                        color="#fff5e8"
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-bias={-0.0001}
                        shadow-normalBias={0.035}
                        shadow-camera-near={0.5}
                        shadow-camera-far={80}
                        shadow-camera-left={-12}
                        shadow-camera-right={12}
                        shadow-camera-top={32}
                        shadow-camera-bottom={-48}
                    />

                    {/* Soft Warm Vault Fill Lights along the Corridor */}
                    <pointLight position={[0, 8, 5]} intensity={0.4} color="#ffe8cc" distance={20} decay={2} />
                    <pointLight position={[0, 8, -5]} intensity={0.4} color="#ffe8cc" distance={20} decay={2} />
                    <pointLight position={[0, 8, -15]} intensity={0.4} color="#ffe8cc" distance={20} decay={2} />
                    <pointLight position={[0, 8, -25]} intensity={0.4} color="#ffe8cc" distance={20} decay={2} />
                    <pointLight position={[0, 8, -35]} intensity={0.4} color="#ffe8cc" distance={20} decay={2} />

                    <Suspense fallback={null}>
                        <Library
                            view={view}
                            onProjectClick={handleProjectClick}
                            onCategoryClick={handleCategoryClick}
                            selectedProject={selectedProject}
                        />
                        {children}
                    </Suspense>

                    <CameraController view={view} targetCategory={targetCategory} />
                    <KeyboardControls />
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
