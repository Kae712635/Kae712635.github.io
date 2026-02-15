import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { damp3 } from 'maath/easing';
import Library from '../Library/Library';
import HUD from '../Interface/HUD';
import ProjectOverlay from '../Interface/ProjectOverlay';

import KeyboardControls from './KeyboardControls';
import ProjectList from '../Interface/ProjectList';

const CameraController = ({ view, selectedProject }) => {
    const { camera, controls } = useThree();
    const vec = new THREE.Vector3();
    const [isAnimating, setIsAnimating] = useState(false);
    const transitionTimeout = useRef(null);

    useEffect(() => {
        setIsAnimating(true);
        if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
        transitionTimeout.current = setTimeout(() => {
            setIsAnimating(false);
        }, 4000); // 4 seconds to ensure full settling

        return () => clearTimeout(transitionTimeout.current);
    }, [view]);

    useFrame((state, delta) => {
        if (!isAnimating) return;

        // Define camera targets for each view
        let targetPos = [0, 1.6, 12]; // Library Entrance - Eye level
        let targetLookAt = [0, 1.6, -10]; // Look straight ahead

        if (view === 'projects' || view === 'universe') {
            targetPos = [0, 1.6, 12];
            targetLookAt = [0, 1.6, -10];
        } else if (view === 'contact') {
            targetPos = [8, 1.6, 10]; // Look at Contact Desk
            targetLookAt = [10, 1.4, 8];
        } else if (view === 'languages') {
            targetPos = [-8, 1.6, 10]; // Look at Language Desk
            targetLookAt = [-10, 1.4, 8];
        } else if (view === 'privacy') {
            targetPos = [0, -10, 15];
            targetLookAt = [0, -10, 5];
        }

        // Smoothly animate camera position
        damp3(state.camera.position, targetPos, 0.5, delta);

        // Smoothly animate OrbitControls target if it exists, otherwise lookAt
        if (controls) {
            damp3(controls.target, targetLookAt, 0.5, delta);
        }
    });

    return null;
};

const Scene = ({ children }) => {
    const [view, setView] = useState('universe');
    const [selectedProject, setSelectedProject] = useState(null);
    const [is3D, setIs3D] = useState(true);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleCloseProject = () => {
        setSelectedProject(null);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
            <HUD view={view} onBack={() => setView('universe')} is3D={is3D} onToggleMode={() => setIs3D(!is3D)} />

            {is3D ? (
                <>
                    {selectedProject && <ProjectOverlay project={selectedProject} onClose={handleCloseProject} />}

                    <Canvas shadows camera={{ position: [0, 1.6, 12], fov: 50 }}>
                        <color attach="background" args={['#ffecce']} /> {/* Warm golden sunlight background */}


                        {/* Lighting Setup */}
                        <ambientLight intensity={0.6} color="#ffeebb" /> {/* High warm ambient */}
                        {/* Sun Light (Directional) simulating God Rays source from side/top */}
                        <directionalLight
                            position={[-15, 20, 10]}
                            intensity={2}
                            color="#fff0dd"
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                            shadow-bias={-0.0001}
                        />
                        <pointLight
                            position={[10, 15, 10]}
                            intensity={0.5}
                            color="#ffaa00"
                        />

                        <Suspense fallback={null}>
                            <Library
                                view={view}
                                onGalaxyClick={setView}
                                onProjectClick={handleProjectClick}
                                selectedProject={selectedProject} // Pass this down to control book animation
                            />
                            {children}
                        </Suspense>

                        <CameraController view={view} selectedProject={selectedProject} />
                        <KeyboardControls />
                        <OrbitControls
                            makeDefault
                            enableZoom={true}
                            enablePan={false}
                            autoRotate={false}
                            autoRotateSpeed={0.5}
                            maxDistance={30}
                            minDistance={2}
                            maxPolarAngle={Math.PI / 1.8} // Prevent going below floor level
                            target={[0, 1.6, 0]}
                        />
                    </Canvas>
                </>
            ) : (
                <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#fdf6e3', zIndex: 10, position: 'absolute', top: 0 }}>
                    <ProjectList />
                </div>
            )}
        </div>
    );
};

export default Scene;
