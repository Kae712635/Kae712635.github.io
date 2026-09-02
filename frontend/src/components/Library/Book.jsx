import { useRef, useState } from 'react';
import { Html, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLanguage } from '../../context/LanguageContext';
import * as THREE from 'three';

const noRaycast = () => null;

const Book = ({ position, rotation, color = "#3a281d", project, onClick, isSelected, isFiller = false }) => {
    const group = useRef();
    const spineMaterialRef = useRef();
    const [hovered, setHover] = useState(false);
    const { language } = useLanguage();

    useCursor(hovered && !isFiller);

    // Fixed base initial coordinates (No idle movement)
    const [initialPos] = useState(() => new THREE.Vector3(...position));

    useFrame((state) => {
        if (!group.current) return;

        // Interactive books advance forward ONLY when hovered or selected (no idle movement)
        const targetZ = initialPos.z + (!isFiller && isSelected ? 0.35 : (!isFiller && hovered ? 0.18 : 0));
        const targetRotX = rotation[0] + (!isFiller && isSelected ? -0.12 : 0);

        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.14);
        group.current.position.y = initialPos.y;
        group.current.position.x = initialPos.x;
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.14);

        // Visible, elegant golden glow that registers in bloom without blinding
        if (!isFiller && spineMaterialRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2.5 + initialPos.x * 3.5) * 0.5 + 0.5;
            const targetEmissive = hovered ? 1.4 : (isSelected ? 1.2 : 0.85 + pulse * 0.3);
            spineMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
                spineMaterialRef.current.emissiveIntensity,
                targetEmissive,
                0.15
            );
        }
    });

    const width = 0.15;
    const height = 1.0;
    const depth = 0.8;

    // Palette harmonisée avec la bibliothèque du portfolio
    const baseColor = color || "#3a281d";

    return (
        <group
            ref={group}
            position={position}
            rotation={rotation}
        >
            {/* Generous Invisible Hitbox for 100% Reliable Clicking & Hovering */}
            {!isFiller && (
                <mesh
                    position={[0, 0, depth * 0.25]}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onClick) onClick();
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHover(true);
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        setHover(false);
                    }}
                >
                    <boxGeometry args={[width * 1.25, height * 1.05, depth * 1.1]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
            )}

            {/* 1. SPINE (Facing Z+) */}
            <mesh 
                position={[0, 0, depth / 2]} 
                castShadow 
                receiveShadow
                onClick={isFiller ? undefined : (e) => {
                    e.stopPropagation();
                    if (onClick) onClick();
                }}
                onPointerOver={isFiller ? undefined : (e) => {
                    e.stopPropagation();
                    setHover(true);
                }}
                onPointerOut={isFiller ? undefined : (e) => {
                    e.stopPropagation();
                    setHover(false);
                }}
            >
                <boxGeometry args={[width, height, 0.04]} />
                <meshStandardMaterial
                    ref={spineMaterialRef}
                    color={baseColor}
                    roughness={isFiller ? 0.6 : 0.25}
                    metalness={isFiller ? 0.05 : 0.4}
                    emissive={!isFiller ? "#D4A24E" : "#000000"}
                    emissiveIntensity={!isFiller ? 0.9 : 0}
                    toneMapped={isFiller}
                />
            </mesh>

            {/* Crevice Shadow Grooves */}
            <mesh position={[-width / 2 + 0.004, 0, depth / 2 + 0.021]} raycast={noRaycast}>
                <boxGeometry args={[0.008, height * 0.98, 0.002]} />
                <meshBasicMaterial color="#0A0608" opacity={0.65} transparent />
            </mesh>
            <mesh position={[width / 2 - 0.004, 0, depth / 2 + 0.021]} raycast={noRaycast}>
                <boxGeometry args={[0.008, height * 0.98, 0.002]} />
                <meshBasicMaterial color="#0A0608" opacity={0.65} transparent />
            </mesh>

            {/* Luminous Gold Accent Trims for Interactive Books */}
            {!isFiller && (
                <>
                    {/* Soft Golden Spine Halo */}
                    <mesh position={[0, 0, depth / 2 + 0.012]} raycast={noRaycast}>
                        <planeGeometry args={[width * 1.35, height * 1.04]} />
                        <meshBasicMaterial
                            color="#FFD700"
                            transparent
                            opacity={hovered ? 0.28 : 0.16}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>

                    {/* Top Gold Line */}
                    <mesh position={[0, 0.38, depth / 2 + 0.024]} raycast={noRaycast}>
                        <boxGeometry args={[width * 0.9, 0.028, 0.006]} />
                        <meshStandardMaterial
                            color="#FFE8A3"
                            metalness={0.95}
                            roughness={0.1}
                            emissive="#FFD700"
                            emissiveIntensity={hovered ? 1.5 : 1.1}
                            toneMapped={false}
                        />
                    </mesh>
                    {/* Middle Gold Emblem Line */}
                    <mesh position={[0, 0.0, depth / 2 + 0.024]} raycast={noRaycast}>
                        <boxGeometry args={[width * 0.65, 0.018, 0.006]} />
                        <meshStandardMaterial
                            color="#FFE8A3"
                            metalness={0.95}
                            roughness={0.1}
                            emissive="#FFD700"
                            emissiveIntensity={hovered ? 1.4 : 1.0}
                            toneMapped={false}
                        />
                    </mesh>
                    {/* Bottom Gold Line */}
                    <mesh position={[0, -0.38, depth / 2 + 0.024]} raycast={noRaycast}>
                        <boxGeometry args={[width * 0.9, 0.028, 0.006]} />
                        <meshStandardMaterial
                            color="#FFE8A3"
                            metalness={0.95}
                            roughness={0.1}
                            emissive="#FFD700"
                            emissiveIntensity={hovered ? 1.5 : 1.1}
                            toneMapped={false}
                        />
                    </mesh>
                </>
            )}

            {/* Tooltip on Hover */}
            {!isFiller && hovered && (
                <Html position={[0, 0.62, depth / 2 + 0.18]} center distanceFactor={7} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                    <div style={{
                        padding: '7px 15px',
                        background: 'rgba(38, 12, 18, 0.97)',
                        color: '#F5EBDD',
                        border: '1.5px solid #D4A24E',
                        borderRadius: '8px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.9), 0 0 16px rgba(212,162,78,0.5)',
                        backdropFilter: 'blur(10px)',
                        fontFamily: 'Cinzel, serif',
                        fontSize: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px',
                        pointerEvents: 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>📖</span>
                            <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
                                {project?.title || (language === 'fr' ? 'Ouvrage interactif' : 'Interactive Book')}
                            </span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#FFD700', letterSpacing: '0.04em', fontStyle: 'italic' }}>
                            {language === 'fr' ? '✨ Cliquez pour ouvrir le dossier ☞' : '✨ Click to open project file ☞'}
                        </span>
                    </div>
                </Html>
            )}

            {/* 2. BACK COVER (Left) */}
            <mesh position={[-width / 2 + 0.01, 0, 0]} castShadow receiveShadow raycast={noRaycast}>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial
                    color={baseColor}
                    roughness={isFiller ? 0.7 : 0.32}
                    metalness={isFiller ? 0.05 : 0.25}
                    emissive={!isFiller ? "#3A281D" : "#000000"}
                    emissiveIntensity={!isFiller ? 0.08 : 0}
                />
            </mesh>

            {/* 3. PAGES BLOCK (Center) */}
            <mesh position={[0, 0, 0]} receiveShadow raycast={noRaycast}>
                <boxGeometry args={[width - 0.04, height - 0.04, depth - 0.04]} />
                <meshStandardMaterial
                    color="#f5deb3"
                    roughness={0.85}
                    metalness={0.0}
                />
            </mesh>

            {/* 4. FRONT COVER (Right) */}
            <mesh position={[width / 2 - 0.01, 0, 0]} castShadow receiveShadow raycast={noRaycast}>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial
                    color={baseColor}
                    roughness={isFiller ? 0.7 : 0.32}
                    metalness={isFiller ? 0.05 : 0.25}
                    emissive={!isFiller ? "#3A281D" : "#000000"}
                    emissiveIntensity={!isFiller ? 0.08 : 0}
                />
            </mesh>
        </group>
    );
};

export default Book;
