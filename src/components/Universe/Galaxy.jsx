import { useMemo } from 'react';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import SolarSystem from './SolarSystem';
import allProjects from '../../data/projects.json';

import PlanetRender from './PlanetRender';

// Simple component for non-project galaxies
const GalaxyNode = ({ position, name, color, onClick }) => {
    return (
        <Float floatIntensity={2} rotationIntensity={1}>
            <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
                <PlanetRender size={2} color={color} name={name} isStar={false} />

                {/* Galaxy Ring/Disk Visual */}
                <mesh rotation-x={Math.PI / 2}>
                    <ringGeometry args={[2.5, 4.5, 64]} />
                    <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.3} />
                </mesh>
                <Text position={[0, -3.5, 0]} fontSize={0.8} color="#e0d6ff" anchorX="center" anchorY="top">
                    {name}
                </Text>
            </group>
        </Float>
    );
};

import { useLanguage } from '../../context/LanguageContext';

const Galaxy = ({ view, onGalaxyClick, onProjectClick }) => {
    const { t, setLanguage } = useLanguage();

    // Group projects by category
    const projectsByCategory = useMemo(() => {
        const groups = {};
        allProjects.forEach(p => {
            const cat = Array.isArray(p.category) ? p.category[0] : p.category;
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });
        return groups;
    }, []);

    const categories = Object.keys(projectsByCategory);

    // Positions for the 4 main galaxies
    const mainPositions = {
        projects: [0, 0, 0],
        contact: [10, 5, -5],
        languages: [-10, -5, -5],
        privacy: [0, -10, 5]
    };

    return (
        <group>
            {/* 
         If view is 'universe', show all main systems.
         If view is 'projects', drill down into Solar Systems.
      */}

            {/* Projects Galaxy */}
            <group position={mainPositions.projects} visible={view === 'universe' || view === 'projects'}>
                {view === 'universe' ? (
                    <GalaxyNode
                        position={[0, 0, 0]}
                        name={t('projectsGalaxy')}
                        color="#b57edc"
                        onClick={() => onGalaxyClick('projects')}
                    />
                ) : (
                    // Expanded Projects Galaxy view: Show Solar Systems for each Category
                    <group>
                        <Text position={[0, 10, 0]} fontSize={2} color="#b57edc" anchorX="center">
                            {t('projectsGalaxy')}
                        </Text>
                        {/* Back button is in HUD, but we can also have a 3D back trigger if needed */}

                        {categories.map((cat, i) => {
                            // Spiral or grid layout for categories
                            const angle = (i / categories.length) * Math.PI * 2;
                            const radius = 15;
                            const x = Math.cos(angle) * radius;
                            const z = Math.sin(angle) * radius;
                            return (
                                <SolarSystem
                                    key={cat}
                                    position={[x, 0, z]}
                                    name={t(cat.toLowerCase()) || cat} // Attempt translation or fallback
                                    color="#8a4ca8"
                                    projects={projectsByCategory[cat]}
                                    isCategory={true}
                                    onClick={() => console.log(`Clicked Category ${cat}`)}
                                    onProjectClick={onProjectClick}
                                />
                            );
                        })}
                    </group>
                )}
            </group>

            {/* Other Galaxies */}
            {view === 'universe' && (
                <>
                    <GalaxyNode
                        position={mainPositions.contact}
                        name={t('contactGalaxy')}
                        color="#ff6b6b"
                        onClick={() => onGalaxyClick('contact')}
                    />

                    {/* Languages Galaxy - split into EN/FR planets if zoomed in? 
                        For now let's make the language Galaxy CLICKABLE to open language selection 
                        OR simply replace it with two planets if it's a small section.
                        The user asked: "dans la galaxie des languages on puisse choisir quel langue on veut"
                        So we should perhaps treat it like a mini-galaxy.
                    */}
                    <group position={mainPositions.languages} onClick={(e) => { e.stopPropagation(); onGalaxyClick('languages'); }}>
                        {/* If in universe view, show as single node, OR show 2 planets? 
                            Let's show as single node first to keep main view clean
                        */}
                        <GalaxyNode
                            position={[0, 0, 0]}
                            name={t('languagesGalaxy')}
                            color="#4ecdc4"
                            onClick={() => onGalaxyClick('languages')}
                        />
                    </group>

                    <GalaxyNode
                        position={mainPositions.privacy}
                        name={t('privacyGalaxy')}
                        color="#ffe66d"
                        onClick={() => onGalaxyClick('privacy')}
                    />
                </>
            )}

            {/* Expanded Languages View */}
            {view === 'languages' && (
                <group position={mainPositions.languages}>
                    <Text position={[0, 4, 0]} fontSize={1.2} color="#4ecdc4" anchorX="center" textAlign="center">
                        Select Language{'\n'}Choisir la langue
                    </Text>

                    {/* French Planet */}
                    <group position={[-3, 0, 0]} onClick={(e) => { e.stopPropagation(); setLanguage('fr'); }}>
                        <PlanetRender size={2} color="#0055A4" name="Français" />
                        <Text position={[0, -3, 0]} fontSize={1} color="white" anchorX="center">Français</Text>
                    </group>

                    {/* English Planet */}
                    <group position={[3, 0, 0]} onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}>
                        <PlanetRender size={2} color="#CE1126" name="English" />
                        <Text position={[0, -3, 0]} fontSize={1} color="white" anchorX="center">English</Text>
                    </group>
                </group>
            )}
            {/* Expanded Contact View */}
            {view === 'contact' && (
                <group position={mainPositions.contact}>
                    <Text position={[0, 4, 0]} fontSize={1.2} color="#ff6b6b" anchorX="center" textAlign="center">
                        Contact Me{'\n'}Me Contacter
                    </Text>

                    {/* Email Planet */}
                    <group position={[-3, 0, 0]} onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "mailto:klervi.choblet+portfolio@gmail.com";
                    }}>
                        <PlanetRender size={2} color="#ff6b6b" name="Email" />
                        <Text position={[0, -3, 0]} fontSize={1} color="white" anchorX="center">Email</Text>
                    </group>

                    {/* LinkedIn Planet */}
                    <group position={[3, 0, 0]} onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://www.linkedin.com/in/klervi-choblet', '_blank');
                    }}>
                        <PlanetRender size={2} color="#0077b5" name="LinkedIn" />
                        <Text position={[0, -3, 0]} fontSize={1} color="white" anchorX="center">LinkedIn</Text>
                    </group>
                </group>
            )}
        </group>
    );
};

export default Galaxy;
