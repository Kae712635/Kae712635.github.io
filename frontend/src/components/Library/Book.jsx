import { useRef, useState } from 'react';
import { Html, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLanguage } from '../../context/LanguageContext';
import * as THREE from 'three';

const Book = ({ position, rotation, color = "#3a281d", project, onClick, isSelected, isFiller = false }) => {
    const group = useRef();
    const spineMaterialRef = useRef();
    const [hovered, setHover] = useState(false);
    const { language } = useLanguage();

    useCursor(hovered && !isFiller);

    // Initial position
    const [initialPos] = useState(() => new THREE.Vector3(...position));

    useFrame((state) => {
        if (!group.current) return;

        // Interactive books advance forward when hovered or selected
        const targetZ = initialPos.z + (!isFiller && isSelected ? 0.35 : (!isFiller && hovered ? 0.18 : 0));
        const targetRotX = rotation[0] + (!isFiller && isSelected ? -0.12 : 0);

        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.12);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.12);

        group.current.position.x = initialPos.x;
        group.current.position.y = initialPos.y;

        // Animate subtle golden shimmer on interactive books
        if (!isFiller && spineMaterialRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2.8 + initialPos.x * 4) * 0.5 + 0.5;
            const targetEmissive = hovered ? 0.6 : (isSelected ? 0.5 : 0.16 + pulse * 0.16);
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

    const baseColor = color || "#3a281d";

    return (
        <group
            ref={group}
            position={position}
            rotation={rotation}
            onClick={(e) => {
                e.stopPropagation();
                if (!isFiller && onClick) onClick();
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                if (!isFiller) setHover(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                if (!isFiller) setHover(false);
            }}
        >
            {/* 1. SPINE (Facing Z+) */}
            <mesh position={[0, 0, depth / 2]} castShadow receiveShadow>
                <boxGeometry args={[width, height, 0.04]} />
                <meshStandardMaterial
                    ref={spineMaterialRef}
                    color={baseColor}
                    roughness={isFiller ? 0.6 : 0.35}
                    metalness={isFiller ? 0.05 : 0.2}
                    emissive={!isFiller ? "#D4A24E" : "#000000"}
                    emissiveIntensity={!isFiller ? 0.25 : 0}
                />
            </mesh>

            {/* Crevice Shadow Grooves (Left & Right edges of spine for depth/ambient occlusion) */}
            <mesh position={[-width / 2 + 0.004, 0, depth / 2 + 0.021]}>
                <boxGeometry args={[0.008, height * 0.98, 0.002]} />
                <meshBasicMaterial color="#0A0608" opacity={0.65} transparent />
            </mesh>
            <mesh position={[width / 2 - 0.004, 0, depth / 2 + 0.021]}>
                <boxGeometry args={[0.008, height * 0.98, 0.002]} />
                <meshBasicMaterial color="#0A0608" opacity={0.65} transparent />
            </mesh>

            {/* Spine Gold Accent Lines for Interactive Books */}
            {!isFiller && (
                <>
                    {/* Top Gold Line */}
                    <mesh position={[0, 0.38, depth / 2 + 0.024]}>
                        <boxGeometry args={[width * 0.9, 0.025, 0.006]} />
                        <meshStandardMaterial color="#E8BF73" metalness={0.9} roughness={0.1} emissive="#D4A24E" emissiveIntensity={0.5} />
                    </mesh>
                    {/* Middle Gold Emblem Line */}
                    <mesh position={[0, 0.0, depth / 2 + 0.024]}>
                        <boxGeometry args={[width * 0.6, 0.015, 0.006]} />
                        <meshStandardMaterial color="#E8BF73" metalness={0.9} roughness={0.1} emissive="#D4A24E" emissiveIntensity={0.4} />
                    </mesh>
                    {/* Bottom Gold Line */}
                    <mesh position={[0, -0.38, depth / 2 + 0.024]}>
                        <boxGeometry args={[width * 0.9, 0.025, 0.006]} />
                        <meshStandardMaterial color="#E8BF73" metalness={0.9} roughness={0.1} emissive="#D4A24E" emissiveIntensity={0.5} />
                    </mesh>
                </>
            )}

            {/* Tooltip on Hover */}
            {!isFiller && hovered && (
                <Html position={[0, 0.58, depth / 2 + 0.15]} center distanceFactor={7} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                    <div style={{
                        padding: '6px 14px',
                        background: 'rgba(43, 15, 20, 0.96)',
                        color: '#F5EBDD',
                        border: '1px solid #D4A24E',
                        borderRadius: '6px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.85), 0 0 12px rgba(212,162,78,0.45)',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'Cinzel, serif',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{ color: '#D4A24E', fontWeight: 'bold' }}>✨</span>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                            {project?.title || (language === 'fr' ? 'Ouvrage interactif' : 'Interactive Book')}
                        </span>
                    </div>
                </Html>
            )}

            {/* 2. BACK COVER (Left) */}
            <mesh position={[-width / 2 + 0.01, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial
                    color={baseColor}
                    roughness={isFiller ? 0.7 : 0.3}
                    metalness={isFiller ? 0.05 : 0.25}
                    emissive={!isFiller ? "#4a3610" : "#000000"}
                    emissiveIntensity={!isFiller ? 0.1 : 0}
                />
            </mesh>

            {/* 3. PAGES BLOCK (Center) */}
            <mesh position={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[width - 0.04, height - 0.04, depth - 0.04]} />
                <meshStandardMaterial
                    color="#f5deb3"
                    roughness={0.85}
                    metalness={0.0}
                />
            </mesh>

            {/* 4. FRONT COVER (Right) */}
            <mesh position={[width / 2 - 0.01, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial
                    color={baseColor}
                    roughness={isFiller ? 0.7 : 0.3}
                    metalness={isFiller ? 0.05 : 0.25}
                    emissive={!isFiller ? "#4a3610" : "#000000"}
                    emissiveIntensity={!isFiller ? 0.1 : 0}
                />
            </mesh>
        </group>
    );
};

export default Book;
