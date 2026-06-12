import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './PlanetShaderMaterial'; // Import to register the shader material

const PlanetRender = ({ size, color, name, isStar = false }) => {
    const meshRef = useRef();
    const materialRef = useRef();

    // Generate random seed based on name
    const seed = useMemo(() => {
        return name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
    }, [name]);

    // Generate palette based on the main color
    const palette = useMemo(() => {
        if (isStar) return null; // Stars don't use this shader

        const baseColor = new THREE.Color(color);
        const hsl = {};
        baseColor.getHSL(hsl);

        // Biome colors based on the main hue but with distinct variations
        return {
            deep: new THREE.Color().setHSL(hsl.h, hsl.s, Math.max(0.1, hsl.l - 0.4)),
            shallow: new THREE.Color().setHSL(hsl.h, hsl.s, Math.min(0.8, hsl.l + 0.1)),
            sand: new THREE.Color().setHSL((hsl.h + 0.1) % 1.0, hsl.s * 0.4, 0.7),
            grass: new THREE.Color().setHSL((hsl.h + 0.3) % 1.0, hsl.s, 0.4),
            forest: new THREE.Color().setHSL((hsl.h + 0.3) % 1.0, hsl.s, 0.2),
            rock: new THREE.Color().setHSL((hsl.h + 0.5) % 1.0, 0.2, 0.4),
            snow: new THREE.Color().setHSL(hsl.h, 0.1, 0.95),
        };
    }, [color, isStar]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002;
        }
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
            // slowly rotate sun position or light direction if needed
        }
    });

    if (isStar) {
        return (
            <mesh ref={meshRef}>
                <sphereGeometry args={[size, 64, 64]} />
                <meshBasicMaterial color={color} />
                <pointLight color={color} intensity={2} distance={20} />
                {/* Glow effect for star */}
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshBasicMaterial color={color} transparent opacity={0.2} />
                </mesh>
            </mesh>
        );
    }

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[size, 64, 64]} />
            {/* 
                Use the custom shader material. 
                The tag <planetShaderMaterial /> is available because we called extend({ PlanetShaderMaterial }) 
            */}
            <planetShaderMaterial
                ref={materialRef}
                uColorWaterDeep={palette.deep}
                uColorWaterShallow={palette.shallow}
                uColorSand={palette.sand}
                uColorGrass={palette.grass}
                uColorForest={palette.forest}
                uColorRock={palette.rock}
                uColorSnow={palette.snow}
                uSeed={seed}
                uSunPosition={new THREE.Vector3(10, 5, 10)}
            />
        </mesh>
    );
};

export default PlanetRender;
