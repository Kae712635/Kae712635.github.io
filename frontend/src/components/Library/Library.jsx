import { useMemo } from 'react';
import { Text, useTexture, Sparkles } from '@react-three/drei';
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

    // Trinity College Long Room Parameters (Tripled)
    const SECTION_WIDTH = 20;
    const NUM_SECTIONS = 3;
    const SECTION_OFFSETS = [-20, 0, 20]; // Left, Center, Right Halls
    const ROOM_LENGTH = 80;
    const ROOM_WIDTH = SECTION_WIDTH * NUM_SECTIONS; // 60
    const ROOM_HEIGHT = 14;
    const BAY_WIDTH = 6;
    const NUM_BAYS = 8;

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

        // Determine priority order for categories: Center (1), Left (0), Right (2)
        const sections = [1, 0, 2];

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

            {/* Floor - Terracotta with realistic PBR properties */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -15]} receiveShadow>
                <planeGeometry args={[ROOM_WIDTH, ROOM_LENGTH]} />
                {/* Terracotta floor with varied roughness for realistic light reflection */}
                <meshStandardMaterial
                    color="#8B5A2B"
                    roughness={0.7}      // Higher roughness for matte terracotta
                    metalness={0.0}      // No metallic properties
                    roughnessMap={null}  // Could add texture here for variation
                />
            </mesh>

            {/* Front Wall (Behind Camera) */}
            <group position={[0, 7, 15]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[ROOM_WIDTH, 14, 1]} />
                    <meshStandardMaterial
                        color="#A0522D"
                        roughness={0.8}
                        metalness={0.0}
                    />
                </mesh>
                <mesh position={[0, -2, -0.6]} castShadow>
                    <boxGeometry args={[4, 8, 1]} />
                    <meshStandardMaterial
                        color="#5C4033"
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
                            <meshStandardMaterial color="#F5DEB3" side={THREE.DoubleSide} roughness={0.9} /> {/* Wheat/Cream Plaster */}
                        </mesh>

                        {/* Ribs - Gold/Brass Accents */}
                        {bays.map((bay) => (
                            <group key={`rib-${sectionIdx}-${bay.id}`} position={[0, 0, bay.z - (-15) + BAY_WIDTH / 2]}>
                                <mesh rotation={[0, 0, 0]} castShadow receiveShadow>
                                    <torusGeometry args={[SECTION_WIDTH / 2 - 0.2, 0.2, 8, 32, Math.PI]} />
                                    <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.6} />
                                </mesh>
                            </group>
                        ))}
                    </group>

                    {/* Side Walls with Arched Windows */}
                    {/* Left Wall of Left Section */}
                    {sectionIdx === 0 && (
                        <group position={[-SECTION_WIDTH / 2 + 0.5, 7, 3.5]}>
                            {/* Wall Mass */}
                            <mesh receiveShadow>
                                <boxGeometry args={[1, 14, 26]} />
                                <meshStandardMaterial color="#A0522D" />
                            </mesh>
                            {/* Window Simulations (Emissive Panels) - Bright for Bloom */}
                            <mesh position={[0.6, 2, -5]}>
                                <planeGeometry args={[0.2, 6, 3]} />
                                <meshStandardMaterial
                                    color="#ffffff"
                                    emissive="#ffffff"
                                    emissiveIntensity={2.5}  // High intensity for bloom effect
                                    toneMapped={false}
                                />
                            </mesh>
                            <mesh position={[0.6, 2, 5]}>
                                <planeGeometry args={[0.2, 6, 3]} />
                                <meshStandardMaterial
                                    color="#ffffff"
                                    emissive="#ffffff"
                                    emissiveIntensity={2.5}
                                    toneMapped={false}
                                />
                            </mesh>

                            {/* Volumetric Rays (Cones) */}
                            <mesh position={[5, 0, -5]} rotation={[0, 0, -Math.PI / 3]}>
                                <coneGeometry args={[2, 15, 32, 1, true]} />
                                <meshBasicMaterial color="#fff5cc" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
                            </mesh>
                            <mesh position={[5, 0, 5]} rotation={[0, 0, -Math.PI / 3]}>
                                <coneGeometry args={[2, 15, 32, 1, true]} />
                                <meshBasicMaterial color="#fff5cc" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
                            </mesh>
                        </group>
                    )}

                    {/* Right Wall of Right Section */}
                    {sectionIdx === NUM_SECTIONS - 1 && (
                        <group position={[SECTION_WIDTH / 2 - 0.5, 7, 3.5]}>
                            <mesh receiveShadow>
                                <boxGeometry args={[1, 14, 26]} />
                                <meshStandardMaterial color="#A0522D" />
                            </mesh>
                            {/* Windows - Bright for Bloom */}
                            <mesh position={[-0.6, 2, -5]}>
                                <planeGeometry args={[0.2, 6, 3]} />
                                <meshStandardMaterial
                                    color="#ffffff"
                                    emissive="#ffffff"
                                    emissiveIntensity={2.5}
                                    toneMapped={false}
                                />
                            </mesh>
                            {/* Rays */}
                            <mesh position={[-5, 0, -5]} rotation={[0, 0, Math.PI / 3]}>
                                <coneGeometry args={[2, 15, 32, 1, true]} />
                                <meshBasicMaterial color="#fff5cc" transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
                            </mesh>
                        </group>
                    )}

                    {/* Front Lunette */}
                    <mesh position={[0, 14, 15]}>
                        <circleGeometry args={[10, 32, 0, Math.PI]} />
                        <meshStandardMaterial color="#A0522D" side={THREE.DoubleSide} />
                    </mesh>

                    {/* Gallery floors */}
                    <mesh position={[-SECTION_WIDTH / 2 + 2, 5, 6.5]} receiveShadow>
                        <boxGeometry args={[4, 0.4, 17]} />
                        <meshStandardMaterial color="#8B4513" /> {/* SaddleBrown */}
                    </mesh>
                    <mesh position={[SECTION_WIDTH / 2 - 2, 5, 6.5]} receiveShadow>
                        <boxGeometry args={[4, 0.4, 17]} />
                        <meshStandardMaterial color="#8B4513" />
                    </mesh>

                    {/* Bays */}
                    {bays.map((bay, index) => {
                        const isLast = index === bays.length - 1;
                        
                        // Récupérer les affectations de la baie pour y afficher les plaques
                        const leftAssignment = shelfAssignments.find(a => a.level === 0 && a.sectionIdx === sectionIdx && a.bayIndex === bay.id && a.side === 'left');
                        const rightAssignment = shelfAssignments.find(a => a.level === 0 && a.sectionIdx === sectionIdx && a.bayIndex === bay.id && a.side === 'right');

                        return (
                            <group key={`bay-${sectionIdx}-${bay.id}`} position={[0, 0, bay.z]}>
                                {/* Left Side Structure */}
                                <group position={[-SECTION_WIDTH / 2 + 2, 0, 0]}>
                                    <mesh position={[2, 7, BAY_WIDTH / 2]} castShadow receiveShadow>
                                        <boxGeometry args={[1.5, 14, 1.5]} />
                                        <meshStandardMaterial color="#CD853F" roughness={0.4} /> {/* Peru / Light Oak */}
                                    </mesh>
                                    <mesh position={[0, 5, 0]} castShadow receiveShadow>
                                        <boxGeometry args={[4, 0.4, BAY_WIDTH]} />
                                        <meshStandardMaterial color="#DEB887" /> {/* Burlywood */}
                                    </mesh>
                                    <mesh position={[2, 6, 0]}>
                                        <boxGeometry args={[0.1, 1.2, BAY_WIDTH - 0.2]} />
                                        <meshStandardMaterial color="#5C4033" />
                                    </mesh>
                                    {sectionIdx === 0 && (
                                        <mesh position={[-2, 7, 0]}>
                                            <boxGeometry args={[1, 14, BAY_WIDTH]} />
                                            <meshStandardMaterial color="#A0522D" />
                                        </mesh>
                                    )}

                                    {/* Plaque d'information de l'allée (gauche) */}
                                    {leftAssignment && leftAssignment.cat && (
                                        <group position={[2, 4.5, -BAY_WIDTH / 2 + 0.76]}>
                                            <mesh castShadow>
                                                <boxGeometry args={[1.4, 0.6, 0.04]} />
                                                <meshStandardMaterial color="#1a100c" metalness={0.4} roughness={0.5} />
                                            </mesh>
                                            <Text
                                                position={[0, 0, 0.025]}
                                                fontSize={0.14}
                                                color="#FFD700" // Doré brillant
                                                font="/fonts/Cinzel-Regular.woff"
                                                anchorX="center"
                                                anchorY="middle"
                                                maxWidth={1.3}
                                                textAlign="center"
                                            >
                                                {leftAssignment.cat.toUpperCase()}
                                            </Text>
                                        </group>
                                    )}
                                </group>
                                {/* Right Side Structure */}
                                <group position={[SECTION_WIDTH / 2 - 2, 0, 0]}>
                                    <mesh position={[-2, 7, BAY_WIDTH / 2]} castShadow receiveShadow>
                                        <boxGeometry args={[1.5, 14, 1.5]} />
                                        <meshStandardMaterial color="#CD853F" roughness={0.4} />
                                    </mesh>
                                    <mesh position={[0, 5, 0]} castShadow receiveShadow>
                                        <boxGeometry args={[4, 0.4, BAY_WIDTH]} />
                                        <meshStandardMaterial color="#DEB887" />
                                    </mesh>
                                    <mesh position={[-2, 6, 0]}>
                                        <boxGeometry args={[0.1, 1.2, BAY_WIDTH - 0.2]} />
                                        <meshStandardMaterial color="#5C4033" />
                                    </mesh>
                                    {sectionIdx === NUM_SECTIONS - 1 && (
                                        <mesh position={[2, 7, 0]}>
                                            <boxGeometry args={[1, 14, BAY_WIDTH]} />
                                            <meshStandardMaterial color="#A0522D" />
                                        </mesh>
                                    )}

                                    {/* Plaque d'information de l'allée (droite) */}
                                    {rightAssignment && rightAssignment.cat && (
                                        <group position={[-2, 4.5, -BAY_WIDTH / 2 + 0.76]}>
                                            <mesh castShadow>
                                                <boxGeometry args={[1.4, 0.6, 0.04]} />
                                                <meshStandardMaterial color="#1a100c" metalness={0.4} roughness={0.5} />
                                            </mesh>
                                            <Text
                                                position={[0, 0, 0.025]}
                                                fontSize={0.14}
                                                color="#FFD700" // Doré brillant
                                                font="/fonts/Cinzel-Regular.woff"
                                                anchorX="center"
                                                anchorY="middle"
                                                maxWidth={1.3}
                                                textAlign="center"
                                            >
                                                {rightAssignment.cat.toUpperCase()}
                                            </Text>
                                        </group>
                                    )}
                                </group>

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
                            <meshStandardMaterial color="#A0522D" />
                        </mesh>
                        {/* Lunette */}
                        <mesh position={[0, 14, 0]}>
                            <circleGeometry args={[10, 32, 0, Math.PI]} />
                            <meshStandardMaterial color="#A0522D" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                </group>
            ))}


            {/* --- BOOKSHELVES --- */}
            {shelfAssignments.map((assignment, i) => {
                const bayZ = bays.find(b => b.id === assignment.bayIndex).z;
                const sectionX = SECTION_OFFSETS[assignment.sectionIdx];
                const localX = assignment.side === 'left'
                    ? (assignment.level === 0 ? -9.2 : -7.5)
                    : (assignment.level === 0 ? 9.2 : 7.5);
                const xPos = sectionX + localX;
                const yPos = assignment.level === 0 ? 0 : 5;

                // Ground Floor (level 0): Use Alcove format (Two shelves facing inward)
                // Gallery (level 1): Keep original layout (Parallel to wall)
                if (assignment.level === 0) {
                    return (
                        <group key={`shelf-${i}`}>
                            {/* Shelf 1: Back of Bay, Facing +Z (Toward Camera) */}
                            <group position={[xPos, yPos, bayZ - 2.1]} rotation={[0, 0, 0]}>
                                <Bookshelf
                                    name={assignment.cat ? (t(assignment.cat.toLowerCase()) || assignment.cat) : assignment.labelString}
                                    projects={assignment.cat ? projectsByCategory[assignment.cat] : []}
                                    onProjectClick={onProjectClick}
                                    selectedProject={selectedProject}
                                />
                            </group>
                            {/* Shelf 2: Front of Bay, Facing -Z (Toward Back of Room) */}
                            <group position={[xPos, yPos, bayZ + 2.1]} rotation={[0, Math.PI, 0]}>
                                <Bookshelf
                                    name={assignment.cat ? (t(assignment.cat.toLowerCase()) || assignment.cat) : assignment.labelString}
                                    projects={assignment.cat ? projectsByCategory[assignment.cat] : []}
                                    onProjectClick={onProjectClick}
                                    selectedProject={selectedProject}
                                />
                            </group>
                        </group>
                    );
                }

                // Gallery Logic
                const shelfRotation = [0, assignment.side === 'left' ? -Math.PI / 2 : Math.PI / 2, 0];
                const shelfOffset = [assignment.side === 'left' ? -0.5 : 0.5, 0, 0];

                return (
                    <group key={`shelf-${i}`} position={[xPos, yPos, bayZ]} rotation={[0, assignment.side === 'left' ? 0 : 0, 0]}>
                        <group rotation={shelfRotation} position={shelfOffset}>
                            <Bookshelf
                                name={assignment.cat ? (t(assignment.cat.toLowerCase()) || assignment.cat) : assignment.labelString}
                                projects={assignment.cat ? projectsByCategory[assignment.cat] : []}
                                onProjectClick={onProjectClick}
                                selectedProject={selectedProject}
                            />
                        </group>
                    </group>
                );
            })}

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
                    <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
                </mesh>

                {/* Avatar Frame - Baroque Gold Frame */}
                <group position={[0, 2.5, -0.5]}>
                    <mesh position={[0, 0, 0]}>
                        <torusGeometry args={[0.6, 0.08, 16, 100]} />
                        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <circleGeometry args={[0.55, 64]} />
                        <meshBasicMaterial map={avatarTexture} side={THREE.DoubleSide} />
                    </mesh>
                    <Text position={[0, -0.9, 0]} fontSize={0.18} color="#D4AF37" font="/fonts/Cinzel-Regular.woff" anchorX="center">
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
                        <meshStandardMaterial color="#D4AF37" metalness={0.8} />
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
                <Text position={[0, 2.5, 0]} fontSize={0.3} color="#D4AF37" font="/fonts/Cinzel-Regular.woff" anchorX="center">
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
