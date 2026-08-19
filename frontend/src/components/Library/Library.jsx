import { useMemo } from 'react';
import { Float, Text, useTexture, Sparkles } from '@react-three/drei';
import Bookshelf from './Bookshelf';
import { useProjects } from '../../hooks/useProjects';
import { useLanguage } from '../../context/LanguageContext';
import cvData from '../../data/cvData';
import * as THREE from 'three';

const Library = ({ view, onCategoryClick, onProjectClick, selectedProject }) => {
    const { t, language } = useLanguage();
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

    return (
        <group>
            {/* Gold Dust Particles */}
            <Sparkles
                count={160}
                scale={[20, 14, 50]}
                size={3.5}
                speed={0.3}
                opacity={0.55}
                color="#ffd700"
                position={[0, 4, -15]}
            />

            {/* --- ARCHITECTURE --- */}

            {/* Floor (#8A897C) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -15]} receiveShadow>
                <planeGeometry args={[ROOM_WIDTH, ROOM_LENGTH]} />
                <meshStandardMaterial
                    color="#8A897C"
                    roughness={0.9}
                    metalness={0.0}
                />
            </mesh>

            {/* Front Wall (#EEE2DF) */}
            <group position={[0, 6, 11]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[ROOM_WIDTH, 12, 1]} />
                    <meshStandardMaterial color="#EEE2DF" roughness={0.9} metalness={0.0} />
                </mesh>
            </group>

            {/* Back Wall (#5C4033) */}
            <group position={[0, 6, -38]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[ROOM_WIDTH, 12, 1]} />
                    <meshStandardMaterial color="#5C4033" roughness={0.9} metalness={0.0} />
                </mesh>
            </group>

            {/* Left Wall & Right Wall (#EEE2DF) */}
            <group position={[-9.5, 6, -13.5]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[1, 12, 50]} />
                    <meshStandardMaterial color="#EEE2DF" roughness={0.9} metalness={0.0} />
                </mesh>
            </group>
            <group position={[9.5, 6, -13.5]}>
                <mesh receiveShadow castShadow>
                    <boxGeometry args={[1, 12, 50]} />
                    <meshStandardMaterial color="#EEE2DF" roughness={0.9} metalness={0.0} />
                </mesh>
            </group>

            {/* Ceiling Vault (#EEE2DF) */}
            <group position={[0, ROOM_HEIGHT, -13.5]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} side={THREE.DoubleSide} receiveShadow>
                    <cylinderGeometry args={[ROOM_WIDTH / 2, ROOM_WIDTH / 2, ROOM_LENGTH, 32, 1, true, Math.PI / 2, Math.PI]} />
                    <meshStandardMaterial color="#EEE2DF" side={THREE.DoubleSide} roughness={0.9} metalness={0} />
                </mesh>
            </group>

            {/* --- RECEPTION & CONTACT DESK (ENTRANCE LEFT) --- */}
            <group position={[-4, 0, 7.5]} rotation={[0, Math.PI / 6, 0]}>
                {/* Desk Base */}
                <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
                    <boxGeometry args={[2.8, 1.8, 1.3]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.1} metalness={0.2} />
                </mesh>
                {/* Gold Trim */}
                <mesh position={[0, 1.75, 0.66]}>
                    <boxGeometry args={[2.7, 0.08, 0.05]} />
                    <meshStandardMaterial color="#8A897C" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Avatar Portrait Frame */}
                <group position={[0, 2.4, -0.2]}>
                    <mesh position={[0, 0, 0]} castShadow>
                        <torusGeometry args={[0.55, 0.06, 16, 64]} />
                        <meshStandardMaterial color="#8A897C" metalness={0.9} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0]} receiveShadow>
                        <circleGeometry args={[0.5, 64]} />
                        <meshStandardMaterial map={avatarTexture} side={THREE.DoubleSide} roughness={0.3} metalness={0.1} />
                    </mesh>
                    <mesh position={[0, -0.65, 0]} castShadow>
                        <boxGeometry args={[0.7, 0.05, 0.3]} />
                        <meshStandardMaterial color="#8A897C" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <Text position={[0, -0.85, 0]} fontSize={0.18} color="#8A897C" font="/fonts/Cinzel-Regular.woff" anchorX="center">
                        Klervi Choblet
                    </Text>
                    <Text position={[0, -1.08, 0]} fontSize={0.12} color="#EEE2DF" font="/fonts/Cinzel-Regular.woff" anchorX="center">
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
                        <meshStandardMaterial color="#415D43" metalness={0.5} roughness={0.2} />
                    </mesh>
                    <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.12} color="#ffffff" font="/fonts/Cinzel-Regular.woff">
                        {language === 'fr' ? '✉ ME CONTACTER' : '✉ CONTACT ME'}
                    </Text>
                </group>
            </group>

            {/* Note: Language desk at Entrance Right has been completely removed in accordance with Requirement #7 */}

            {/* --- BAYS & PLAQUES & SHELVES --- */}
            {bays.map((bay) => (
                <group key={`bay-${bay.id}`} position={[0, 0, bay.z]}>
                    
                    {/* Fixed Overhead Arch Plaque (Sage Green #415D43 + Cream Text #EEE2DF) */}
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
                            <meshStandardMaterial color="#415D43" metalness={0.0} roughness={0.8} />
                        </mesh>
                        <Text
                            position={[0, 0, 0.05]}
                            fontSize={0.22}
                            font="/fonts/Cinzel-Regular.woff"
                            anchorX="center"
                            anchorY="middle"
                            color="#EEE2DF"
                            letterSpacing={0.05}
                        >
                            {bay.label}
                        </Text>
                    </group>

                    {/* Left Shelves (Grounded, Facing +Z) */}
                    <group position={[-6.8, 1.25, 0]} rotation={[0, 0, 0]}>
                        <Bookshelf
                            name={bay.label}
                            projects={bay.cat.items.slice(0, 12)}
                            onProjectClick={onProjectClick}
                            selectedProject={selectedProject}
                        />
                    </group>

                    {/* Right Shelves (Grounded, Facing +Z) */}
                    <group position={[6.8, 1.25, 0]} rotation={[0, 0, 0]}>
                        <Bookshelf
                            name={bay.label}
                            projects={bay.cat.items.slice(12, 24)}
                            onProjectClick={onProjectClick}
                            selectedProject={selectedProject}
                        />
                    </group>

                    {/* Decorative Statues/Busts */}
                    <group position={[-3.8, 0, 0]} scale={0.7}>
                        <mesh position={[0, 1, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.6, 2, 0.6]} />
                            <meshStandardMaterial color="#1a1410" roughness={0.15} metalness={0.5} />
                        </mesh>
                        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                            <sphereGeometry args={[0.3, 32, 32]} />
                            <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.05} />
                        </mesh>
                    </group>
                    <group position={[3.8, 0, 0]} scale={0.7}>
                        <mesh position={[0, 1, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.6, 2, 0.6]} />
                            <meshStandardMaterial color="#1a1410" roughness={0.15} metalness={0.5} />
                        </mesh>
                        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                            <sphereGeometry args={[0.3, 32, 32]} />
                            <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.05} />
                        </mesh>
                    </group>
                </group>
            ))}

        </group>
    );
};

export default Library;
