import { useRef, useState, useMemo } from 'react';
import { Text, Html, useCursor, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Book = ({ position, rotation, color, project, onClick, isSelected, isFiller = false }) => {
    const group = useRef();
    const [hovered, setHover] = useState(false);

    // Load Texture
    const leatherTexture = useTexture('/textures/leather.png');
    // Use texture directly to save uniforms. 
    // Random offset was nice but too expensive for 7000+ books.

    useCursor(hovered && !isFiller);

    // Initial position to return to
    const [initialPos] = useState(() => new THREE.Vector3(...position));

    useFrame((state, delta) => {
        if (!group.current) return;

        // Target position:
        // Only move if NOT a filler
        // If selected: Pull out 0.3 units along Z
        // If hovered: Pull out 0.1 units
        const targetZ = initialPos.z + (!isFiller && isSelected ? 0.3 : (!isFiller && hovered ? 0.1 : 0));

        // Smoothly interpolate Z
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.1);

        // Reset X/Y to ensure stability
        group.current.position.x = initialPos.x;
        group.current.position.y = initialPos.y;
    });

    // Book Dimensions
    const width = 0.15; // Thickness
    const height = 1;
    const depth = 0.8;

    // Material Properties based on Type
    const materialProps = useMemo(() => isFiller ? {
        color: color,
        map: leatherTexture, // Use shared texture instance
        roughness: 0.5,
        metalness: 0.1
    } : {
        color: "#D4AF37", // Gold
        map: leatherTexture,
        roughness: 0.2,
        metalness: 0.9,
        emissive: "#b8860b",
        emissiveIntensity: 0.1
    }, [isFiller, color, leatherTexture]);

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
                <meshStandardMaterial {...materialProps} />
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

            {/* 2. BACK COVER (Left Side, -X) */}
            <mesh position={[-width / 2 + 0.01, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>

            {/* 3. PAGES BLOCK (Center) */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[width - 0.04, height - 0.04, depth - 0.04]} />
                <meshStandardMaterial color="#f5deb3" roughness={0.8} /> {/* Aged Paper */}
            </mesh>

            {/* 4. FRONT COVER (Right Side, +X) */}
            <mesh position={[width / 2 - 0.01, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.02, height, depth]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
        </group>
    );
};

export default Book;
