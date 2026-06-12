import { useRef, useState, useMemo } from 'react';
import { Text, Html, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Book = ({ position, rotation, color, project, onClick, isSelected, isFiller = false }) => {
    const group = useRef();
    const [hovered, setHover] = useState(false);

    // No textures - using PBR colors only to avoid GPU texture limit (16 max)

    useCursor(hovered && !isFiller);

    // Initial position to return to
    const [initialPos] = useState(() => new THREE.Vector3(...position));

    useFrame(() => {
        if (!group.current) return;

        // Target position & rotation
        const targetZ = initialPos.z + (!isFiller && isSelected ? 0.4 : (!isFiller && hovered ? 0.15 : 0));
        const targetRotX = rotation[0] + (!isFiller && isSelected ? -0.15 : 0);

        // Smoothly interpolate Z and Rotation X
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.1);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.1);

        // Reset X/Y to ensure stability
        group.current.position.x = initialPos.x;
        group.current.position.y = initialPos.y;
    });

    // Book Dimensions
    const width = 0.15; // Thickness
    const height = 1;
    const depth = 0.8;

    // Material Properties based on Type - PBR colors only, no textures
    const materialProps = useMemo(() => isFiller ? {
        color: color,
        roughness: 0.6,      // Leather-like roughness
        metalness: 0.05,     // Slight sheen
    } : {
        color: "#D4AF37",    // Gold
        roughness: 0.2,      // Polished gold
        metalness: 0.9,      // Very metallic
        emissive: "#b8860b", // Gold glow
        emissiveIntensity: 0.15
    }, [isFiller, color]);

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
            {/* 1. SPINE (Facing Z+) - Slightly darker */}
            <mesh position={[0, 0, depth / 2]}>
                <boxGeometry args={[width, height, 0.04]} />
                <meshStandardMaterial
                    color={isFiller ? color : "#C4A037"}  // Darker gold for active books
                    roughness={isFiller ? 0.6 : 0.2}
                    metalness={isFiller ? 0.05 : 0.9}
                    emissive={isFiller ? "#000000" : "#b8860b"}
                    emissiveIntensity={isFiller ? 0 : 0.15}
                />
            </mesh>

            {/* Tooltip on Hover (Replacing text on spine) */}
            {!isFiller && hovered && (
                <Html position={[0, 0.5, depth / 2 + 0.1]} center distanceFactor={6} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                    <div className="px-3 py-2 bg-neutral-900/90 text-gold border border-gold/50 rounded shadow-xl backdrop-blur-sm">
                        <span className="font-serif text-sm tracking-wider uppercase font-semibold">
                            {project?.title}
                        </span>
                    </div>
                </Html>
            )}

            {/* 2. BACK COVER (Left Side, -X) - Main color */}
            <mesh position={[-width / 2 + 0.01, 0, 0]}>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial
                    color={isFiller ? color : "#D4AF37"}
                    roughness={isFiller ? 0.6 : 0.2}
                    metalness={isFiller ? 0.05 : 0.9}
                    emissive={isFiller ? "#000000" : "#b8860b"}
                    emissiveIntensity={isFiller ? 0 : 0.15}
                />
            </mesh>

            {/* 3. PAGES BLOCK (Center) - Cream/beige paper */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[width - 0.04, height - 0.04, depth - 0.04]} />
                <meshStandardMaterial
                    color="#f5deb3"
                    roughness={0.9}
                    metalness={0.0}
                />
            </mesh>

            {/* 4. FRONT COVER (Right Side, +X) - Main color */}
            <mesh position={[width / 2 - 0.01, 0, 0]}>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial
                    color={isFiller ? color : "#D4AF37"}
                    roughness={isFiller ? 0.6 : 0.2}
                    metalness={isFiller ? 0.05 : 0.9}
                    emissive={isFiller ? "#000000" : "#b8860b"}
                    emissiveIntensity={isFiller ? 0 : 0.15}
                />
            </mesh>
        </group>
    );
};

export default Book;
