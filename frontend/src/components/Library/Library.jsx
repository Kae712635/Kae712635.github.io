import { useMemo } from 'react';
import { Float, Text, useTexture, Sparkles } from '@react-three/drei';
import Bookshelf from './Bookshelf';
import { useProjects } from '../../hooks/useProjects';
import { useLanguage } from '../../context/LanguageContext';
import * as THREE from 'three';

const Library = ({ view, onGalaxyClick, onProjectClick, selectedProject }) => {
    const { t, setLanguage } = useLanguage();
    const { projects: allProjects } = useProjects();

    const avatarTexture = useTexture('/media/photo_identité.png');

    const projectsByCategory = useMemo(() => {
        const groups = {};
        allProjects.forEach(p => {
            const cat = Array.isArray(p.category) ? p.category[0] : p.category;
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });
        return groups;
    }, [allProjects]);

    const categories = Object.keys(projectsByCategory);

    // Trinity College Long Room Parameters (Simplified to Single Hall)
    const SECTION_WIDTH = 20;
    const NUM_SECTIONS = 1;
    const SECTION_OFFSETS = [0]; // Only Center Hall
    const ROOM_LENGTH = 60;
    const ROOM_WIDTH = SECTION_WIDTH * NUM_SECTIONS; // 20
    const ROOM_HEIGHT = 14;
    const BAY_WIDTH = 9; // Plus d'espace entre les étagères
    const NUM_BAYS = 5;

    // Generate Bays (Book Section)
    const bays = useMemo(() => {
        const bayData = [];
        for (let i = 0; i < NUM_BAYS; i++) {
            const z = -5 - (i * BAY_WIDTH);
            bayData.push({ id: i, z, label: categories[i] || `Section ${i + 1}` });
        }
        return bayData;
    }, [categories]);

    // Distribute categories across 3 Sections * 2 Sides * NUM_BAYS
    // Distribute categories across all available slots (3 Sections * 2 Sides * NUM_BAYS * 2 Levels)
    const shelfAssignments = useMemo(() => {
        const assignments = [];
        const levels = [0, 1]; // 0: Ground, 1: Gallery

        // Determine priority order for categories: Center (0)
        const sections = [0];

        let catIndex = 0;
        let fillerIndex = 1;

        levels.forEach(level => {
            sections.forEach(sectionIdx => {
                for (let i = 0; i < NUM_BAYS; i++) {
                    ['left', 'right'].forEach(side => {
                        let category = null;
                        let labelString = "";

                        // Assign real category if available
                        if (catIndex < categories.length) {
                            category = categories[catIndex];
                            labelString = category;
                            catIndex++;
                        } else {
                            // Filler shelf
                            labelString = `Volume ${fillerIndex++}`;
                        }

                        assignments.push({
                            cat: category, // Can be null
                            labelString: labelString,
                            sectionIdx: sectionIdx,
                            side: side,
                            bayIndex: i,
                            level: level
                        });
                    });
                }
            });
        });

        return assignments;
    }, [categories]);




    return (
        <group>
            {/* Lighting is now handled in Scene.jsx for better control */}



            {/* Magical "Gold Dust" Particles */}
            <Sparkles
                count={200}
                scale={[30, 20, 60]}
                size={4}
                speed={0.4}
                opacity={0.6}
                color="#ffd700"
                position={[0, 5, 0]}
            />

            {/* --- ARCHITECTURE --- */}

            {/* Floor - Anthracite */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -15]} receiveShadow>
                <planeGeometry args={[ROOM_WIDTH, ROOM_LENGTH]} />
                <meshStandardMaterial
                    color="#8A897C" // Khaki/Grey floor
                    roughness={0.9}
                    metalness={0.0}
                    roughnessMap={null}
                />
            </mesh>

            {/* Front Wall (Behind Camera) */}
            <group position={[0, 7, 15]}>
                <mesh receiveShadow>
                    <boxGeometry args={[ROOM_WIDTH, 14, 1]} />
                    <meshStandardMaterial
                        color="#EEE2DF" // Cream walls
                        roughness={0.9}
                        metalness={0.0}
                    />
                </mesh>
                <mesh position={[0, -2, -0.6]}>
                    <boxGeometry args={[4, 8, 1]} />
                    <meshStandardMaterial
                        color="#EEE2DF"
                        roughness={0.9}
                        metalness={0.0}
                    />
                </mesh>
            </group>

            {/* Loop through 3 Sections */}
            {SECTION_OFFSETS.map((xOffset, sectionIdx) => (
                <group key={`section-${sectionIdx}`} position={[xOffset, 0, 0]}>

                    {/* Ceiling - High Vaults */}
                    <group position={[0, ROOM_HEIGHT, -15]}>
                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} side={THREE.DoubleSide} receiveShadow>
                            <cylinderGeometry args={[SECTION_WIDTH / 2, SECTION_WIDTH / 2, ROOM_LENGTH, 32, 1, true, Math.PI / 2, Math.PI]} />
                            <meshStandardMaterial color="#EEE2DF" side={THREE.DoubleSide} roughness={0.9} metalness={0} />
                        </mesh>
                    </group>

                    {/* Side Walls */}
                    {/* Left Wall of Left Section */}
                    {sectionIdx === 0 && (
                        <group position={[-SECTION_WIDTH / 2 - 0.5, 7, 3.5]}>
                            <mesh receiveShadow>
                                <boxGeometry args={[1, 14, 26]} />
                                <meshStandardMaterial color="#EEE2DF" metalness={0} roughness={0.9} />
                            </mesh>
                        </group>
                    )}
                    {/* Right Wall of Right Section */}
                    {sectionIdx === NUM_SECTIONS - 1 && (
                        <group position={[SECTION_WIDTH / 2 + 0.5, 7, 3.5]}>
                            <mesh receiveShadow>
                                <boxGeometry args={[1, 14, 26]} />
                                <meshStandardMaterial color="#EEE2DF" metalness={0} roughness={0.9} />
                            </mesh>
                        </group>
                    )}

                    {/* Front Lunette */}
                    <mesh position={[0, 14, 15]}>
                        <circleGeometry args={[10, 32, 0, Math.PI]} />
                        <meshStandardMaterial color="#EEE2DF" side={THREE.DoubleSide} metalness={0} roughness={0.9} />
                    </mesh>

                    {/* Bays */}
                    {bays.map((bay, index) => {
                        const isLast = index === bays.length - 1;
                        
                        // Récupérer les affectations de la baie pour y afficher les plaques
                        const leftAssignment = shelfAssignments.find(a => a.level === 0 && a.sectionIdx === sectionIdx && a.bayIndex === bay.id && a.side === 'left');
                        const rightAssignment = shelfAssignments.find(a => a.level === 0 && a.sectionIdx === sectionIdx && a.bayIndex === bay.id && a.side === 'right');

                        return (
                            <group key={`bay-${sectionIdx}-${bay.id}`} position={[0, 0, bay.z]}>
                                {/* No heavy pillars in Antigravity */}roup>

                                {/* Hanging Signs - Free floating in Antigravity */}
                                {leftAssignment && leftAssignment.cat && (
                                    <Float speed={2} rotationIntensity={0.5} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
                                        <group position={[-4, 4.5 + Math.random() * 2, BAY_WIDTH / 2]}>
                                            <mesh castShadow>
                                                <boxGeometry args={[2.5, 0.6, 0.05]} />
                                                <meshStandardMaterial color="#415D43" metalness={0.0} roughness={0.8} />
                                            </mesh>
                                            <Text
                                                position={[0, 0, 0.03]}
                                                fontSize={0.25}
                                                font="/fonts/Cinzel-Regular.woff"
                                                anchorX="center"
                                                anchorY="middle"
                                                maxWidth={2.3}
                                                textAlign="center"
                                                color="#EEE2DF" // Texte crème
                                            >
                                                {leftAssignment.cat.toUpperCase()}
                                            </Text>
                                        </group>
                                    </Float>
                                )}

                                {rightAssignment && rightAssignment.cat && (
                                    <Float speed={2} rotationIntensity={0.5} floatIntensity={2} floatingRange={[-0.2, 0.2]}>
                                        <group position={[4, 4.5 + Math.random() * 2, BAY_WIDTH / 2]}>
                                            <mesh castShadow>
                                                <boxGeometry args={[2.5, 0.6, 0.05]} />
                                                <meshStandardMaterial color="#415D43" metalness={0.0} roughness={0.8} />
                                            </mesh>
                                            <Text
                                                position={[0, 0, 0.03]}
                                                fontSize={0.25}
                                                font="/fonts/Cinzel-Regular.woff"
                                                anchorX="center"
                                                anchorY="middle"
                                                maxWidth={2.3}
                                                textAlign="center"
                                                color="#EEE2DF" // Texte crème
                                            >
                                                {rightAssignment.cat.toUpperCase()}
                                            </Text>
                                        </group>
                                    </Float>
                                )}

                                {/* Busts/Statues */}
                                <group position={[-3.5, 0, BAY_WIDTH / 2]} scale={0.8}>
                                    {/* Plinth - Dark marble with metallic properties */}
                                    <mesh position={[0, 1, 0]} castShadow receiveShadow>
                                        <boxGeometry args={[0.6, 2, 0.6]} />
                                        <meshStandardMaterial
                                            color="#1a1410"
                                            roughness={0.15}  // Polished marble
                                            metalness={0.5}   // Slight metallic sheen
                                        />
                                    </mesh>
                                    {/* Bust - White marble */}
                                    <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                                        <sphereGeometry args={[0.3, 32, 32]} />
                                        <meshStandardMaterial
                                            color="#f5f5f5"
                                            roughness={0.3}   // Slightly polished
                                            metalness={0.05}
                                        />
                                    </mesh>
                                </group>
                                <group position={[3.5, 0, BAY_WIDTH / 2]} scale={0.8}>
                                    <mesh position={[0, 1, 0]} castShadow receiveShadow>
                                        <boxGeometry args={[0.6, 2, 0.6]} />
                                        <meshStandardMaterial
                                            color="#1a1410"
                                            roughness={0.15}
                                            metalness={0.5}
                                        />
                                    </mesh>
                                    <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                                        <sphereGeometry args={[0.3, 32, 32]} />
                                        <meshStandardMaterial
                                            color="#f5f5f5"
                                            roughness={0.3}
                                            metalness={0.05}
                                        />
                                    </mesh>
                                </group>

                                {/* Shelf Light (Lamp) - Elegant Brass/Dark Metal */}
                                <group position={[0, 6.5, BAY_WIDTH / 2]} rotation={[Math.PI, 0, 0]}>
                                    {/* Suspended Rod */}
                                    <mesh position={[0, -0.5, 0]} castShadow>
                                        <cylinderGeometry args={[0.02, 0.02, 1]} />
                                        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
                                    </mesh>
                                    {/* Lamp shade - Elegant Dark exterior, reflective interior */}
                                    <mesh position={[0, 0.2, 0]}>
                                        <coneGeometry args={[0.4, 0.5, 16, 1, true]} />
                                        <meshStandardMaterial
                                            color="#1a1512" // Dark bronze
                                            metalness={0.8}
                                            roughness={0.2}
                                            side={THREE.DoubleSide}
                                        />
                                    </mesh>
                                    {/* Inner Glowing Bulb */}
                                    <mesh position={[0, 0.35, 0]}>
                                        <sphereGeometry args={[0.1, 8, 8]} />
                                        <meshBasicMaterial color="#ffe4b5" />
                                    </mesh>
                                </group>
                            </group>
                        );
                    })}

                    {/* Back Wall per Section */}
                    <group position={[0, 0, bays[bays.length - 1].z - 6]}>
                        <mesh position={[0, 7, 0]} receiveShadow>
                            <boxGeometry args={[SECTION_WIDTH, 14, 1]} />
                            <meshStandardMaterial color="#5C4033" />
                        </mesh>
                        {/* Lunette */}
                        <mesh position={[0, 14, 0]}>
                            <circleGeometry args={[10, 32, 0, Math.PI]} />
                            <meshStandardMaterial color="#5C4033" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                </group>
            ))}


            {/* --- BOOKSHELVES (Grounded Placement) --- */}
            {shelfAssignments.map((assignment, i) => {
                const bayZ = bays.find(b => b.id === assignment.bayIndex).z;
                const sectionX = SECTION_OFFSETS[assignment.sectionIdx];
                
                // Stable positions on the floor
                const localX = assignment.side === 'left' ? -6.5 : 6.5;
                const xPos = sectionX + localX;
                
                // Base Y position so the bottom shelf (at y=-1.2) sits nicely above the floor
                const yPos = 1.25; 

                if (assignment.level === 0) {
                    return (
                        <group key={`shelf-${i}`}>
                            <group position={[xPos, yPos, bayZ - 2.1]} rotation={[0, 0, 0]}>
                                <Bookshelf
                                    name={assignment.cat || assignment.labelString}
                                    projects={assignment.cat ? projectsByCategory[assignment.cat] : []}
                                    onProjectClick={onProjectClick}
                                    selectedProject={selectedProject}
                                />
                            </group>
                            <group position={[xPos, yPos, bayZ + 2.1]} rotation={[0, Math.PI, 0]}>
                                <Bookshelf
                                    name={assignment.cat || assignment.labelString}
                                    projects={assignment.cat ? projectsByCategory[assignment.cat] : []}
                                    onProjectClick={onProjectClick}
                                    selectedProject={selectedProject}
                                />
                            </group>
                        </group>
                    );
                }

                // Gallery Logic - stable placement
                const shelfRotation = [0, assignment.side === 'left' ? -Math.PI / 2 : Math.PI / 2, 0];
                const shelfOffset = [assignment.side === 'left' ? 1.75 : -1.75, 0, 0];
                const galleryYPos = 7; // Estimated gallery height

                return (
                    <group key={`shelf-${i}`} position={[xPos, galleryYPos + 1.25, bayZ + BAY_WIDTH / 2]} rotation={[0, 0, 0]}>
                        <group rotation={shelfRotation} position={shelfOffset}>
                            <Bookshelf
                                name={assignment.cat || assignment.labelString}
                                projects={assignment.cat ? projectsByCategory[assignment.cat] : []}
                                onProjectClick={onProjectClick}
                                selectedProject={selectedProject}
                            />
                        </group>
                    </group>
                );
            })}

            {/* --- FLOATING CV IN CENTER REMOVED --- */}

            {/* --- SIGNAGE REMOVED --- */}
            {/* Les panneaux suspendus ont été retirés pour épurer la vue et éviter les chevauchements de texte, mettant en valeur l'architecture de la bibliothèque. */}

            {/* --- RECEPTION & LANGUAGE --- */}

            {/* Reception Desk - Baroque */}
            <group position={[-5, 0, 8]} rotation={[0, Math.PI / 4, 0]}>
                {/* Desk Base */}
                <mesh position={[0, 1, 0]} castShadow receiveShadow>
                    <boxGeometry args={[3, 2, 1.5]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.1} metalness={0.2} /> {/* High polish dark walnut */}
                </mesh>
                {/* Gold Trim */}
                <mesh position={[0, 1, 0.76]} >
                    <boxGeometry args={[2.8, 0.1, 0.1]} />
                    <meshStandardMaterial color="#8A897C" metalness={1} roughness={0.1} />
                </mesh>

                {/* Avatar Frame - Baroque Gold Frame */}
                <group position={[0, 2.5, -0.5]}>
                    <mesh position={[0, 0, 0]} castShadow>
                        <torusGeometry args={[0.6, 0.08, 16, 100]} />
                        <meshStandardMaterial color="#8A897C" metalness={1} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0]} receiveShadow>
                        <circleGeometry args={[0.55, 64]} />
                        <meshStandardMaterial map={avatarTexture} side={THREE.DoubleSide} roughness={0.3} metalness={0.1} />
                    </mesh>
                    
                    {/* Socle du cadre */}
                    <mesh position={[0, -0.65, 0]} castShadow>
                        <cylinderGeometry args={[0.1, 0.15, 0.2, 16]} />
                        <meshStandardMaterial color="#1a100c" metalness={0.5} roughness={0.5} />
                    </mesh>
                    <mesh position={[0, -0.75, 0]} castShadow>
                        <boxGeometry args={[0.8, 0.05, 0.4]} />
                        <meshStandardMaterial color="#8A897C" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <Text position={[0, -0.9, 0]} fontSize={0.18} color="#8A897C" font="/fonts/Cinzel-Regular.woff" anchorX="center">
                        Klervi Choblet
                    </Text>
                    <Text position={[0, -1.2, 0]} fontSize={0.12} color="#cca" font="/fonts/Cinzel-Regular.woff" anchorX="center">
                        Creative Developer
                    </Text>
                </group>

                {/* Contact Email Button */}
                <group position={[-1, 2.05, 0.5]} onClick={(e) => { e.stopPropagation(); window.location.href = "mailto:klervi.choblet+portfolio@gmail.com"; }}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[0.8, 0.4, 0.05]} />
                        <meshStandardMaterial color="#8A897C" metalness={0.8} />
                    </mesh>
                    <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.12} color="#2b1b17" font="/fonts/Cinzel-Regular.woff">Contact Me</Text>
                </group>
            </group>

            {/* Language Desk */}
            <group position={[5, 0, 8]} rotation={[0, -Math.PI / 4, 0]}>
                <mesh position={[0, 1, 0]} castShadow receiveShadow>
                    <boxGeometry args={[2, 2, 1]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.1} />
                </mesh>
                <Text position={[0, 2.5, 0]} fontSize={0.3} color="#8A897C" font="/fonts/Cinzel-Regular.woff" anchorX="center">
                    Language
                </Text>

                {/* Lang Buttons */}
                <group position={[-0.5, 2.05, 0]} onClick={(e) => { e.stopPropagation(); setLanguage('fr'); }}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.3, 32]} />
                        <meshStandardMaterial color="#002395" metalness={0.5} roughness={0.2} />
                    </mesh>
                    <Text position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.15} color="white" font="/fonts/Cinzel-Regular.woff">FR</Text>
                </group>
                <group position={[0.5, 2.05, 0]} onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.3, 32]} />
                        <meshStandardMaterial color="#B22234" metalness={0.5} roughness={0.2} />
                    </mesh>
                    <Text position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.15} color="white" font="/fonts/Cinzel-Regular.woff">EN</Text>
                </group>
            </group>

        </group>
    );
};

export default Library;
