import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, useTexture, Sparkles } from '@react-three/drei';
import Bookshelf from './Bookshelf';
import { useProjects } from '../../hooks/useProjects';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import cvData from '../../data/cvData';
import * as THREE from 'three';

// Baroque Gilded Ironwork Volutes Framing the Overhead Arch Plaque
const BayArchwayOrnament = ({ isAnimationsPaused }) => {
    const leftMatRef = useRef();
    const rightMatRef = useRef();

    useFrame((state) => {
        if (isAnimationsPaused) return;
        const shimmer = Math.sin(state.clock.elapsedTime * 1.8) * 0.12 + 0.38;
        if (leftMatRef.current) leftMatRef.current.emissiveIntensity = shimmer;
        if (rightMatRef.current) rightMatRef.current.emissiveIntensity = shimmer;
    });

    return (
        <group position={[0, 0, 0.9]}>
            {/* Right Gilded Volute Bracket (Anchored to top of right bookshelf curving up to plaque) */}
            <group scale={[1, 1, 1]}>
                <group position={[3.65, 3.65, 0]}>
                    {/* Main sweeping architectural curve */}
                    <mesh rotation={[0, 0, Math.PI - 0.22]}>
                        <torusGeometry args={[1.55, 0.032, 12, 36, Math.PI / 1.85]} />
                        <meshStandardMaterial
                            ref={rightMatRef}
                            color="#E8BF73"
                            metalness={0.92}
                            roughness={0.15}
                            emissive="#D4A24E"
                            emissiveIntensity={0.38}
                        />
                    </mesh>
                    {/* Decorative spiral rosette curl at shelf anchor */}
                    <mesh position={[1.0, -1.02, 0]} rotation={[0, 0, -0.8]}>
                        <torusGeometry args={[0.32, 0.022, 12, 32, Math.PI * 1.5]} />
                        <meshStandardMaterial color="#E8BF73" metalness={0.92} roughness={0.15} emissive="#D4A24E" emissiveIntensity={0.35} />
                    </mesh>
                </group>
            </group>

            {/* Left Gilded Volute Bracket (Exact Mirrored Copy of Right Bracket) */}
            <group scale={[-1, 1, 1]}>
                <group position={[3.65, 3.65, 0]}>
                    {/* Main sweeping architectural curve */}
                    <mesh rotation={[0, 0, Math.PI - 0.22]}>
                        <torusGeometry args={[1.55, 0.032, 12, 36, Math.PI / 1.85]} />
                        <meshStandardMaterial
                            ref={leftMatRef}
                            color="#E8BF73"
                            metalness={0.92}
                            roughness={0.15}
                            emissive="#D4A24E"
                            emissiveIntensity={0.38}
                        />
                    </mesh>
                    {/* Decorative spiral rosette curl at shelf anchor */}
                    <mesh position={[1.0, -1.02, 0]} rotation={[0, 0, -0.8]}>
                        <torusGeometry args={[0.32, 0.022, 12, 32, Math.PI * 1.5]} />
                        <meshStandardMaterial color="#E8BF73" metalness={0.92} roughness={0.15} emissive="#D4A24E" emissiveIntensity={0.35} />
                    </mesh>
                </group>
            </group>

            {/* Top Crown Arch Crest above the plaque */}
            <group position={[0, 5.3, 0]}>
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[1.85, 0.028, 12, 36, Math.PI]} />
                    <meshStandardMaterial color="#E8BF73" metalness={0.92} roughness={0.15} emissive="#D4A24E" emissiveIntensity={0.35} />
                </mesh>
                {/* Central Gilded Rosette / Diamond Jewel */}
                <mesh position={[0, 1.85, 0]}>
                    <octahedronGeometry args={[0.1, 0]} />
                    <meshStandardMaterial color="#FFF1C2" metalness={0.95} roughness={0.1} emissive="#D4A24E" emissiveIntensity={0.6} toneMapped={false} />
                </mesh>
            </group>
        </group>
    );
};

const Library = ({ view, onCategoryClick, onProjectClick, selectedProject }) => {
    const { t, language } = useLanguage();
    const { isAnimationsPaused } = useAccessibility();
    const { projects: allProjects } = useProjects();

    const avatarTexture = useTexture('/media/photo_identité.png');

    const categories = useMemo(() => [
        { 
            id: 'exp', 
            label: language === 'fr' ? 'Expériences Pro' : 'Work Experiences', 
            items: cvData.experiences.map(e => ({ 
                id: e.id, 
                title: typeof e.role === 'object' ? (e.role[language] || e.role.fr) : e.role, 
                category: language === 'fr' ? 'Expériences Pro' : 'Work Experiences', 
                description: e.description, 
                tech: e.highlights ? (e.highlights[language] || e.highlights.fr || []) : [],
                company: e.company,
                period: e.period,
                school: e.company,
                date: e.period
            })) 
        },
        { 
            id: 'projects', 
            label: language === 'fr' ? 'Projets Phares' : 'Featured Projects', 
            items: allProjects 
        },
        { 
            id: 'skills', 
            label: language === 'fr' ? 'Compétences Tech' : 'Tech Skills', 
            items: [
                ...cvData.skills.flatMap(s => s.items.map(item => ({ 
                    id: `skill-${item}`, 
                    title: item, 
                    category: language === 'fr' ? 'Compétences' : 'Skills', 
                    description: { 
                        fr: `Domaine d'expertise : ${s.categoryName.fr}. Maîtrise des concepts, bonnes pratiques et mise en application sur des projets complexes.`, 
                        en: `Area of expertise: ${s.categoryName.en}. Strong proficiency in core concepts, best practices, and production implementations.` 
                    }, 
                    tech: [item, s.categoryName[language] || s.categoryName.fr] 
                }))),
                ...cvData.languages.map(l => ({
                    id: l.id,
                    title: l.name[language] || l.name.fr,
                    category: language === 'fr' ? 'Langues' : 'Languages',
                    description: l.description,
                    tech: [l.level[language] || l.level.fr]
                }))
            ]
        },
        { 
            id: 'edu', 
            label: language === 'fr' ? 'Formations & Diplômes' : 'Education & Degrees', 
            items: [
                ...cvData.education.map(ed => ({ 
                    id: ed.id, 
                    title: typeof ed.title === 'object' ? (ed.title[language] || ed.title.fr) : ed.title, 
                    category: language === 'fr' ? 'Formations' : 'Education', 
                    description: ed.details, 
                    tech: [ed.school, ed.period],
                    school: ed.school,
                    period: ed.period,
                    date: ed.period
                })),
                ...cvData.interests.map(it => ({
                    id: it.id,
                    title: it.name[language] || it.name.fr,
                    category: language === 'fr' ? "Centres d'intérêt" : "Interests",
                    description: it.description,
                    tech: [language === 'fr' ? 'Passion & Veille' : 'Passion & Research']
                }))
            ]
        }
    ], [language, allProjects]);

    const ROOM_WIDTH = 18;
    const ROOM_LENGTH = 50;
    const ROOM_HEIGHT = 12;

    const bays = useMemo(() => {
        return [
            { id: 0, z: -5, label: language === 'fr' ? 'EXPÉRIENCES PROFESSIONNELLES' : 'WORK EXPERIENCES', cat: categories[0] },
            { id: 1, z: -14, label: language === 'fr' ? 'PROJETS PHARES' : 'FEATURED PROJECTS', cat: categories[1] },
            { id: 2, z: -23, label: language === 'fr' ? 'COMPÉTENCES TECH & LANGUES' : 'TECH SKILLS & LANGUAGES', cat: categories[2] },
            { id: 3, z: -32, label: language === 'fr' ? 'FORMATIONS & DIPLÔMES' : 'EDUCATION & DEGREES', cat: categories[3] }
        ];
    }, [language, categories]);

    // Procedural Stone Tile Floor Texture
    const floorTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Dark noble slate base
        ctx.fillStyle = '#140E10';
        ctx.fillRect(0, 0, 512, 512);

        // Stone tile squares (2x2 grid in 512px)
        const tileSize = 256;
        for (let x = 0; x < 512; x += tileSize) {
            for (let y = 0; y < 512; y += tileSize) {
                const isAlt = (x / tileSize + y / tileSize) % 2 === 0;
                ctx.fillStyle = isAlt ? '#191316' : '#110C0E';
                ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

                // Subtle marble sheen tone
                ctx.fillStyle = 'rgba(212, 162, 78, 0.03)';
                ctx.fillRect(x + 12, y + 12, tileSize - 24, tileSize - 24);

                // Fine gold/bronze tile border grout line
                ctx.strokeStyle = 'rgba(212, 162, 78, 0.15)';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(9, 25);
        return texture;
    }, []);

    // Procedural Luminous Oculus / Stained-Glass Arch Texture
    const oculusTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Radial celestial gradient (bright warm gold at center fading into midnight teal & burgundy)
        const grad = ctx.createRadialGradient(256, 256, 15, 256, 256, 250);
        grad.addColorStop(0, 'rgba(255, 248, 225, 1.0)');
        grad.addColorStop(0.2, 'rgba(245, 215, 140, 0.9)');
        grad.addColorStop(0.45, 'rgba(212, 162, 78, 0.7)');
        grad.addColorStop(0.7, 'rgba(60, 110, 113, 0.45)');
        grad.addColorStop(0.9, 'rgba(43, 15, 20, 0.85)');
        grad.addColorStop(1, 'rgba(16, 10, 14, 0.98)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Delicate star / Gothic rose window geometric lines
        ctx.strokeStyle = 'rgba(212, 162, 78, 0.65)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(256, 256, 220, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(212, 162, 78, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(256, 256, 140, 0, Math.PI * 2);
        ctx.arc(256, 256, 60, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 16; i++) {
            const angle = (i * Math.PI) / 8;
            ctx.beginPath();
            ctx.moveTo(256 + Math.cos(angle) * 60, 256 + Math.sin(angle) * 60);
            ctx.lineTo(256 + Math.cos(angle) * 220, 256 + Math.sin(angle) * 220);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }, []);

    return (
        <group>
            {/* Ambient Golden Magic Dust Particles floating high in the ceiling vaults (clear of camera path) */}
            {!isAnimationsPaused && (
                <Sparkles
                    count={45}
                    scale={[6, 3.5, 48]}
                    size={1.4}
                    speed={0.2}
                    opacity={0.35}
                    color="#D4A24E"
                    position={[0, 6.5, -14]}
                />
            )}

            {/* --- ARCHITECTURE --- */}

            {/* 1. Tiled Stone Floor with Procedural Joint Texture */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -13.5]} receiveShadow>
                <planeGeometry args={[ROOM_WIDTH, ROOM_LENGTH]} />
                <meshStandardMaterial
                    map={floorTexture}
                    roughness={0.45}
                    metalness={0.12}
                />
            </mesh>

            {/* 2. Grand Central Velvet Runner Carpet (Perspective Vanishing Lines) */}
            <group position={[0, -0.08, -13.5]}>
                {/* Main Velvet Carpet */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[4.8, ROOM_LENGTH]} />
                    <meshStandardMaterial color="#2B0E14" roughness={0.7} metalness={0.04} />
                </mesh>
                {/* Left Gold Border Trim */}
                <mesh position={[-2.32, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.08, ROOM_LENGTH]} />
                    <meshStandardMaterial color="#D4A24E" roughness={0.25} metalness={0.85} />
                </mesh>
                {/* Right Gold Border Trim */}
                <mesh position={[2.32, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.08, ROOM_LENGTH]} />
                    <meshStandardMaterial color="#D4A24E" roughness={0.25} metalness={0.85} />
                </mesh>
                {/* Inner Decorative Fine Gold Lines */}
                <mesh position={[-2.15, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.02, ROOM_LENGTH]} />
                    <meshStandardMaterial color="#D4A24E" roughness={0.25} metalness={0.85} />
                </mesh>
                <mesh position={[2.15, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.02, ROOM_LENGTH]} />
                    <meshStandardMaterial color="#D4A24E" roughness={0.25} metalness={0.85} />
                </mesh>
            </group>

            {/* Front Wall (#161214) */}
            <group position={[0, 6, 11]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[ROOM_WIDTH, 12, 1]} />
                    <meshStandardMaterial color="#161214" roughness={0.9} metalness={0.0} />
                </mesh>
            </group>

            {/* Back Wall with Grand Luminous Oculus Window */}
            <group position={[0, 6, -38]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[ROOM_WIDTH, 12, 1]} />
                    <meshStandardMaterial color="#100C0E" roughness={0.95} metalness={0.0} />
                </mesh>

                {/* Grand Luminous Celestial Oculus Arch / Window */}
                <group position={[0, 1.2, 0.55]}>
                    {/* Outer Gold Arch Moulding */}
                    <mesh castShadow>
                        <torusGeometry args={[3.8, 0.18, 16, 64, Math.PI]} rotation={[0, 0, 0]} />
                        <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.2} />
                    </mesh>
                    {/* Luminous Stained-Glass Disc with Radial Moonlit Glow */}
                    <mesh rotation={[0, 0, 0]}>
                        <circleGeometry args={[3.6, 64]} />
                        <meshBasicMaterial map={oculusTexture} toneMapped={false} />
                    </mesh>
                    {/* Soft Backing Ambient Light streaming from Oculus */}
                    <pointLight position={[0, 0, 1.5]} color="#FFE8BA" intensity={2.0} distance={16} decay={2} />
                </group>
            </group>

            {/* Left Wall & Right Wall with Pilasters */}
            <group position={[-9.5, 6, -13.5]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[1, 12, 50]} />
                    <meshStandardMaterial color="#161214" roughness={0.95} metalness={0.0} />
                </mesh>
            </group>
            <group position={[9.5, 6, -13.5]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[1, 12, 50]} />
                    <meshStandardMaterial color="#161214" roughness={0.95} metalness={0.0} />
                </mesh>
            </group>

            {/* Ceiling Vault (Clean Barrel Vault) */}
            <group position={[0, ROOM_HEIGHT, -13.5]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} side={THREE.DoubleSide} receiveShadow>
                    <cylinderGeometry args={[ROOM_WIDTH / 2, ROOM_WIDTH / 2, ROOM_LENGTH, 32, 1, true, Math.PI / 2, Math.PI]} />
                    <meshStandardMaterial color="#141012" side={THREE.DoubleSide} roughness={0.95} metalness={0} />
                </mesh>
            </group>

            {/* --- RECEPTION & CONTACT DESK (ENTRANCE LEFT) --- */}
            <group position={[-4, 0, 7.5]} rotation={[0, Math.PI / 6, 0]}>
                {/* Desk Base */}
                <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
                    <boxGeometry args={[2.8, 1.8, 1.3]} />
                    <meshStandardMaterial color="#2B0F14" roughness={0.3} metalness={0.1} />
                </mesh>
                {/* Gold Trim */}
                <mesh position={[0, 1.75, 0.66]}>
                    <boxGeometry args={[2.7, 0.08, 0.05]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Avatar Portrait Frame */}
                <group position={[0, 2.4, -0.2]}>
                    <mesh position={[0, 0, 0]} castShadow>
                        <torusGeometry args={[0.55, 0.06, 16, 64]} />
                        <meshStandardMaterial color="#D4A24E" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0]} receiveShadow>
                        <circleGeometry args={[0.5, 64]} />
                        <meshStandardMaterial map={avatarTexture} side={THREE.DoubleSide} roughness={0.3} metalness={0.1} />
                    </mesh>
                    <mesh position={[0, -0.65, 0]} castShadow>
                        <boxGeometry args={[0.7, 0.05, 0.3]} />
                        <meshStandardMaterial color="#D4A24E" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <Text position={[0, -0.85, 0]} fontSize={0.18} color="#D4A24E" font="/fonts/Cinzel-Regular.woff" anchorX="center">
                        Klervi Choblet
                    </Text>
                    <Text position={[0, -1.08, 0]} fontSize={0.12} color="#F5EBDD" font="/fonts/Cinzel-Regular.woff" anchorX="center">
                        {language === 'fr' ? 'Ingénieure Logicielle' : 'Software Engineer'}
                    </Text>
                </group>

                {/* Interactive Contact Email Button on Desk */}
                <group 
                    position={[-0.5, 1.85, 0.2]} 
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = "mailto:klervi.choblet+portfolio@gmail.com";
                    }}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                    <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
                        <boxGeometry args={[1.3, 0.45, 0.05]} />
                        <meshStandardMaterial color="#3C6E71" metalness={0.5} roughness={0.2} />
                    </mesh>
                    <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.12} color="#F5EBDD" font="/fonts/Cinzel-Regular.woff">
                        {language === 'fr' ? '✉ ME CONTACTER' : '✉ CONTACT ME'}
                    </Text>
                </group>
            </group>

            {/* --- BAYS & PLAQUES & SHELVES & ILLUMINATING LANTERNS --- */}
            {bays.map((bay) => (
                <group key={`bay-${bay.id}`} position={[0, 0, bay.z]}>
                    
                    {/* Symmetrical Art Nouveau Gilded Architectural Volutes framing the plaque */}
                    <BayArchwayOrnament isAnimationsPaused={isAnimationsPaused} />

                    {/* Fixed Overhead Arch Plaque (Wine Red #A6303B + Cream Text #F5EBDD + Gold Border) */}
                    <group 
                        position={[0, 4.8, 1]}
                        onClick={(e) => {
                            e.stopPropagation();
                            onCategoryClick && onCategoryClick(bay.label);
                        }}
                        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                    >
                        <mesh castShadow>
                            <boxGeometry args={[5.2, 0.85, 0.08]} />
                            <meshStandardMaterial color="#A6303B" metalness={0.1} roughness={0.6} />
                        </mesh>
                        {/* Gold Plaque Frame */}
                        <mesh position={[0, 0, -0.005]}>
                            <boxGeometry args={[5.32, 0.97, 0.06]} />
                            <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.2} />
                        </mesh>
                        <Text
                            position={[0, 0, 0.05]}
                            fontSize={0.22}
                            font="/fonts/Cinzel-Regular.woff"
                            anchorX="center"
                            anchorY="middle"
                            color="#F5EBDD"
                            letterSpacing={0.05}
                        >
                            {bay.label}
                        </Text>
                    </group>

                    {/* Left Shelves */}
                    <group position={[-6.8, 1.25, 0]} rotation={[0, 0, 0]}>
                        <Bookshelf
                            name={bay.label}
                            projects={bay.cat.items.slice(0, 12)}
                            onProjectClick={onProjectClick}
                            selectedProject={selectedProject}
                        />
                    </group>

                    {/* Right Shelves */}
                    <group position={[6.8, 1.25, 0]} rotation={[0, 0, 0]}>
                        <Bookshelf
                            name={bay.label}
                            projects={bay.cat.items.slice(12, 24)}
                            onProjectClick={onProjectClick}
                            selectedProject={selectedProject}
                        />
                    </group>

                    {/* Left Illuminating Victorian Lantern Lamp Post */}
                    <group position={[-3.8, 0, 0]}>
                        {/* Antique Dark Bronze Pedestal Base */}
                        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.3, 0.38, 0.9, 16]} />
                            <meshStandardMaterial color="#2B1A12" roughness={0.35} metalness={0.3} />
                        </mesh>
                        {/* Pedestal Shaft */}
                        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.12, 0.16, 0.9, 16]} />
                            <meshStandardMaterial color="#22150E" roughness={0.35} metalness={0.3} />
                        </mesh>
                        {/* Gold Capital & Lantern Base */}
                        <mesh position={[0, 1.72, 0]} castShadow>
                            <cylinderGeometry args={[0.26, 0.14, 0.12, 16]} />
                            <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.2} />
                        </mesh>
                        {/* Glowing Lantern Orb */}
                        <mesh position={[0, 2.0, 0]}>
                            <sphereGeometry args={[0.24, 32, 32]} />
                            <meshBasicMaterial color="#FFE8A3" toneMapped={false} />
                        </mesh>
                        {/* Translucent Golden Glass Crown */}
                        <mesh position={[0, 2.0, 0]}>
                            <sphereGeometry args={[0.28, 32, 32]} />
                            <meshStandardMaterial color="#D4A24E" transparent opacity={0.25} roughness={0.1} />
                        </mesh>
                        {/* Real Warm Point Light Illuminating Shelves & Floor */}
                        <pointLight position={[0, 2.0, 0]} color="#FFDF9E" intensity={3.5} distance={9} decay={2} />
                        {/* Light Pool on the Floor */}
                        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <circleGeometry args={[2.2, 32]} />
                            <meshBasicMaterial color="#FFDF9E" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
                        </mesh>
                        {/* Targeted Soft Ambient Glow */}
                        {!isAnimationsPaused && (
                            <Sparkles
                                count={10}
                                scale={[1.2, 1.2, 1.2]}
                                size={1.4}
                                speed={0.3}
                                opacity={0.4}
                                color="#D4A24E"
                                position={[0, 2.2, 0]}
                            />
                        )}
                    </group>

                    {/* Right Illuminating Victorian Lantern Lamp Post */}
                    <group position={[3.8, 0, 0]}>
                        {/* Antique Dark Bronze Pedestal Base */}
                        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.3, 0.38, 0.9, 16]} />
                            <meshStandardMaterial color="#2B1A12" roughness={0.35} metalness={0.3} />
                        </mesh>
                        {/* Pedestal Shaft */}
                        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
                            <cylinderGeometry args={[0.12, 0.16, 0.9, 16]} />
                            <meshStandardMaterial color="#22150E" roughness={0.35} metalness={0.3} />
                        </mesh>
                        {/* Gold Capital & Lantern Base */}
                        <mesh position={[0, 1.72, 0]} castShadow>
                            <cylinderGeometry args={[0.26, 0.14, 0.12, 16]} />
                            <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.2} />
                        </mesh>
                        {/* Glowing Lantern Orb */}
                        <mesh position={[0, 2.0, 0]}>
                            <sphereGeometry args={[0.24, 32, 32]} />
                            <meshBasicMaterial color="#FFE8A3" toneMapped={false} />
                        </mesh>
                        {/* Translucent Golden Glass Crown */}
                        <mesh position={[0, 2.0, 0]}>
                            <sphereGeometry args={[0.28, 32, 32]} />
                            <meshStandardMaterial color="#D4A24E" transparent opacity={0.25} roughness={0.1} />
                        </mesh>
                        {/* Real Warm Point Light Illuminating Shelves & Floor */}
                        <pointLight position={[0, 2.0, 0]} color="#FFDF9E" intensity={3.5} distance={9} decay={2} />
                        {/* Light Pool on the Floor */}
                        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <circleGeometry args={[2.2, 32]} />
                            <meshBasicMaterial color="#FFDF9E" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
                        </mesh>
                        {/* Targeted Soft Ambient Glow */}
                        {!isAnimationsPaused && (
                            <Sparkles
                                count={10}
                                scale={[1.2, 1.2, 1.2]}
                                size={1.4}
                                speed={0.3}
                                opacity={0.4}
                                color="#D4A24E"
                                position={[0, 2.2, 0]}
                            />
                        )}
                    </group>
                </group>
            ))}

        </group>
    );
};

export default Library;
