import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import Bookshelf from './Bookshelf';
import { useProjects } from '../../hooks/useProjects';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import cvData from '../../data/cvData';
import * as THREE from 'three';

// Glowing Golden Fireflies: Clearly visible golden particles with bright core + soft transparent halo (0 artifacts)
const LuminousGoldDust = ({ isAnimationsPaused, count = 180 }) => {
    const pointsRef = useRef();

    const [geo, material] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const phases = new Float32Array(count);
        const speeds = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = 1.0 + Math.random() * 6.5;
            positions[i * 3 + 2] = -Math.random() * 48 + 5;

            scales[i] = 1.0 + Math.random() * 1.5;
            phases[i] = Math.random() * Math.PI * 2;
            speeds[i * 3] = (Math.random() - 0.5) * 0.09;
            speeds[i * 3 + 1] = 0.07 + Math.random() * 0.14;
            speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.09;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 3));

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorCore: { value: new THREE.Color('#FFFFFF') },
                uColorHalo: { value: new THREE.Color('#FFD700') }
            },
            vertexShader: `
                attribute float aScale;
                attribute float aPhase;
                varying float vPhase;
                uniform float uTime;

                void main() {
                    vPhase = aPhase;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    float pulse = sin(uTime * 2.2 + aPhase) * 0.3 + 1.0;
                    float zDist = max(1.0, -mvPosition.z);
                    gl_PointSize = clamp(aScale * pulse * (160.0 / zDist), 4.0, 36.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vPhase;
                uniform vec3 uColorCore;
                uniform vec3 uColorHalo;

                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord) * 2.0;
                    if (dist > 1.0) discard;

                    // Intense bright core + soft transparent halo
                    float core = exp(-dist * 4.0);
                    float halo = exp(-dist * 1.6) * (1.0 - dist);
                    
                    vec3 col = mix(uColorHalo, uColorCore, core);
                    float alpha = clamp(core * 1.1 + halo * 0.55, 0.0, 1.0);

                    gl_FragColor = vec4(col * alpha, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        return [geometry, mat];
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = isAnimationsPaused ? 0 : state.clock.elapsedTime;
        material.uniforms.uTime.value = time;

        const posAttr = geo.attributes.position;
        const speedAttr = geo.attributes.aSpeed;
        const phaseAttr = geo.attributes.aPhase;

        for (let i = 0; i < count; i++) {
            let y = posAttr.getY(i) + speedAttr.getY(i) * 0.016;
            if (y > 7.8) y = 1.0;
            posAttr.setY(i, y);

            let x = posAttr.getX(i) + Math.sin(time * 0.5 + phaseAttr.getX(i)) * 0.003;
            let z = posAttr.getZ(i) + Math.cos(time * 0.4 + phaseAttr.getX(i)) * 0.003;
            posAttr.setX(i, x);
            posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geo} material={material} raycast={() => null} />
    );
};

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

    const categories = useMemo(() => [
        { 
            id: 'exp', 
            label: language === 'fr' ? 'Expériences Pro' : 'Work Experiences', 
            items: cvData.experiences.map(e => ({ 
                id: e.id, 
                title: typeof e.role === 'object' ? (e.role[language] || e.role.fr) : e.role, 
                category: language === 'fr' ? 'Expériences Pro' : 'Work Experiences', 
                description: e.description, 
                detailed_description: {
                    fr: (e.highlights?.fr || []).map(h => `• ${h}`).join('\n\n'),
                    en: (e.highlights?.en || []).map(h => `• ${h}`).join('\n\n')
                },
                tech: e.id === 'exp-primpromo' ? ['Spring Boot', 'Angular', 'GitLab CI/CD', 'Java'] :
                      e.id === 'exp-bde' ? ['Événementiel', 'Gestion de projet', 'Relationnel', 'Logistique'] :
                      e.id === 'exp-animatrice' ? ['Animation', 'Pédagogie', 'Sécurité', 'Gestion de groupe'] :
                      e.id === 'exp-aub-sante' ? ['Gestion documentaire', 'Comptabilité', 'Inventaire', 'Rigueur'] :
                      e.id === 'exp-detour-loire' ? ['Relation client', 'Maintenance', 'Itinérance', 'Logistique'] :
                      ['Contrôle qualité', 'Maintenance', 'Rigueur', 'Terrain'],
                company: e.company,
                period: typeof e.period === 'object' ? (e.period[language] || e.period.fr) : e.period,
                school: e.company,
                date: typeof e.period === 'object' ? (e.period[language] || e.period.fr) : e.period
            })) 
        },
        { 
            id: 'projects', 
            label: language === 'fr' ? 'Projets Phares' : 'Featured Projects', 
            items: allProjects 
        },
        { 
            id: 'skills', 
            label: language === 'fr' ? 'Compétences & Langues' : 'Skills & Languages', 
            items: [
                // 1. Livre unique : Langages de programmation
                {
                    id: 'skill-languages-prog',
                    title: language === 'fr' ? 'Langages de Programmation' : 'Programming Languages',
                    category: language === 'fr' ? 'Langages' : 'Languages',
                    description: {
                        fr: "Maîtrise des langages fondamentaux et de programmation moderne :\n\n• Systèmes & Objet : C, C++, C#, Java\n• Scripting & Data : Python, Shell / Bash\n• Web & Frontend : JavaScript (ES6+), HTML5, CSS3\n• Données & Requêtes : SQL (PostgreSQL, SQLite)\n",
                        en: "Mastery of fundamental and modern programming languages:\n\n• Systems & OOP: C, C++, C#, Java\n• Scripting & Data: Python, Shell / Bash\n• Web & Frontend: JavaScript (ES6+), HTML5, CSS3\n• Data & Queries: SQL (PostgreSQL, SQLite)\n"
                    },
                    tech: ['C / C++', 'C#', 'Java', 'Python', 'JavaScript', 'HTML5 / CSS3', 'SQL', 'Shell'],
                    company: 'EPITA',
                    period: 'Langages',
                    date: 'Compétences'
                },

                // 2. Livre unique : Compétences Technologies & Frameworks
                {
                    id: 'skill-technologies',
                    title: language === 'fr' ? 'Technologies & Frameworks' : 'Technologies & Frameworks',
                    category: language === 'fr' ? 'Technologies' : 'Technologies',
                    description: {
                        fr: "Écosystèmes, frameworks et outils d'ingénierie logicielle :\n\n• Web & Frontend : ReactJS, Angular, Tailwind CSS\n• Backend & APIs : Spring Boot, Node.js, APIs RESTful\n• 3D & Graphisme : OpenGL, GLSL Shaders, Three.js, WebGL\n• Imagerie Médicale & Calcul : VTK, ITK\n• DevOps & Qualité : GitLab CI/CD, Git, Tests Unitaires, Accessibilité (WCAG 2.2 AA)\n• Systèmes : Sockets Raw, Linux/UNIX",
                        en: "Ecosystems, frameworks, and software engineering toolsets:\n\n• Web & Frontend: ReactJS, Angular, Tailwind CSS\n• Backend & APIs: Spring Boot, Node.js, RESTful APIs\n• 3D & Graphics: OpenGL, GLSL Shaders, Three.js, WebGL\n• Medical Imaging: VTK, ITK\n• DevOps & Quality: GitLab CI/CD, Git, Unit Testing, Accessibility (WCAG 2.2 AA)\n• Systems: Raw Sockets, Linux/UNIX"
                    },
                    tech: ['ReactJS', 'Angular', 'Spring Boot', 'OpenGL & GLSL', 'VTK / ITK', 'GitLab CI/CD', 'Tests Unitaires', 'WCAG'],
                    company: 'Ingénierie',
                    period: 'Frameworks',
                    date: 'Compétences'
                },

                // 3. Livre unique : Compétences Humaines & Transversales
                {
                    id: 'skill-soft-skills',
                    title: language === 'fr' ? 'Compétences Humaines' : 'Human & Soft Skills',
                    category: language === 'fr' ? 'Soft Skills' : 'Soft Skills',
                    description: {
                        fr: "Aptitudes relationnelles, organisationnelles et managériales forgées sur le terrain :\n\n• Organisation : Structuration des plannings, priorisation et gestion logistique.\n• Travail de groupe : Coordination d'équipe, esprit d'entraide et cohésion collective.\n• Communication efficace : Clarté, écoute active et adaptation aux interlocuteurs.\n• Rigueur : Exigence qualité, précision et respect des procédures confidentielles.\n• Apprentissage rapide : Agilité technique, curiosité et assimilation immédiate.\n• Résolution de problèmes : Démarche analytique, diagnostic et solutions robustes.",
                        en: "Interpersonal, organizational, and leadership skills forged through experience:\n\n• Organization: Planning, priority structuring, and logistics coordination.\n• Teamwork: Cross-functional collaboration, mutual aid, and team cohesion.\n• Effective Communication: Clarity, active listening, and audience adaptation.\n• Rigor: Quality standards, precision, and adherence to confidential processes.\n• Fast Learning: Technical agility, curiosity, and rapid assimilation.\n• Problem Solving: Analytical mindset, root cause diagnosis, and robust solutions."
                    },
                    tech: ['Organisation', 'Travail de groupe', 'Communication', 'Rigueur', 'Apprentissage rapide', 'Résolution de problèmes'],
                    company: 'Terrain & Pro',
                    period: 'Soft Skills',
                    date: 'Compétences'
                },

                // 4. Livre unique : Langues & International
                {
                    id: 'skill-languages',
                    title: language === 'fr' ? 'Langues' : 'Languages',
                    category: language === 'fr' ? 'Langues & International' : 'Languages & International',
                    description: {
                        fr: "Maîtrise des langues pour la communication et l'ingénierie internationale :\n\n• Français : Langue maternelle — Rédaction technique et communication fluide.\n• Anglais : Courant / Professionnel — Collaboration en contexte international et documentation.\n• Espagnol : Scolaire / Intermédiaire — Compréhension et communication générale.",
                        en: "Language proficiency for international communication and engineering:\n\n• French: Native — Technical writing and fluent communication.\n• English: Fluent / Professional — International collaboration and technical documentation.\n• Spanish: Intermediate — General reading, listening, and basic communication."
                    },
                    tech: [
                        language === 'fr' ? 'Français (Maternelle)' : 'French (Native)',
                        language === 'fr' ? 'Anglais (Professionnel)' : 'English (Professional)',
                        language === 'fr' ? 'Espagnol (Intermédiaire)' : 'Spanish (Intermediate)'
                    ],
                    company: 'International',
                    period: 'Langues',
                    date: 'Compétences'
                }
            ]
        },
        { 
            id: 'edu', 
            label: language === 'fr' ? 'Formations & Diplômes' : 'Education & Degrees', 
            items: cvData.education.map(ed => ({ 
                id: ed.id, 
                title: typeof ed.title === 'object' ? (ed.title[language] || ed.title.fr) : ed.title, 
                category: language === 'fr' ? 'Formation & Diplôme' : 'Education & Degree', 
                description: ed.details, 
                tech: [ed.school, typeof ed.period === 'object' ? (ed.period[language] || ed.period.fr) : ed.period],
                school: ed.school,
                period: typeof ed.period === 'object' ? (ed.period[language] || ed.period.fr) : ed.period,
                date: typeof ed.period === 'object' ? (ed.period[language] || ed.period.fr) : ed.period
            }))
        }
    ], [language, allProjects]);

    const ROOM_WIDTH = 18;
    const ROOM_LENGTH = 50;
    const ROOM_HEIGHT = 12;

    const bays = useMemo(() => {
        return [
            { id: 0, z: -5, label: language === 'fr' ? 'EXPÉRIENCES PROFESSIONNELLES' : 'WORK EXPERIENCES', cat: categories[0] },
            { id: 1, z: -14, label: language === 'fr' ? 'PROJETS PHARES' : 'FEATURED PROJECTS', cat: categories[1] },
            { id: 2, z: -23, label: language === 'fr' ? 'COMPÉTENCES & LANGUES' : 'SKILLS & LANGUAGES', cat: categories[2] },
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
            {/* Pure Spherical Golden Light Motes (Zero clipping quad artifacts) */}
            <LuminousGoldDust isAnimationsPaused={isAnimationsPaused} count={120} />

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
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
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
                <mesh receiveShadow>
                    <boxGeometry args={[ROOM_WIDTH, 12, 1]} />
                    <meshStandardMaterial color="#161214" roughness={0.9} metalness={0.0} />
                </mesh>
            </group>

            {/* Back Wall with Grand Luminous Oculus Window */}
            <group position={[0, 6, -38]}>
                <mesh receiveShadow>
                    <boxGeometry args={[ROOM_WIDTH, 12, 1]} />
                    <meshStandardMaterial color="#100C0E" roughness={0.95} metalness={0.0} />
                </mesh>

                {/* Grand Luminous Celestial Oculus Arch / Window */}
                <group position={[0, 1.2, 0.55]}>
                    {/* Outer Gold Arch Moulding */}
                    <mesh>
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
                <mesh receiveShadow>
                    <boxGeometry args={[1, 12, 50]} />
                    <meshStandardMaterial color="#161214" roughness={0.95} metalness={0.0} />
                </mesh>
            </group>
            <group position={[9.5, 6, -13.5]}>
                <mesh receiveShadow>
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
                        <mesh>
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
                            projects={bay.cat.items.slice(0, Math.ceil(bay.cat.items.length / 2))}
                            onProjectClick={onProjectClick}
                            selectedProject={selectedProject}
                        />
                    </group>

                    {/* Right Shelves */}
                    <group position={[6.8, 1.25, 0]} rotation={[0, 0, 0]}>
                        <Bookshelf
                            name={bay.label}
                            projects={bay.cat.items.slice(Math.ceil(bay.cat.items.length / 2))}
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
                    </group>
                </group>
            ))}

        </group>
    );
};

export default Library;
