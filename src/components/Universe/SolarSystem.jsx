import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

import PlanetRender from './PlanetRender';

const Planet = ({ position, size, color, name, onClick }) => {
    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <PlanetRender size={size} color={color} name={name} />
            <Text position={[0, size + 0.8, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="bottom">
                {name}
            </Text>
        </group>
    );
};

const SolarSystem = ({ position, name, color, projects = [], onClick, onProjectClick, isCategory = false }) => {
    const groupRef = useRef();

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
    });

    // Generate planet positions in orbit
    const planets = useMemo(() => {
        return projects.map((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2;
            const radius = 4 + (index * 1.5); // Spiral out or simple orbit
            return {
                ...project,
                position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
                size: 0.5
            };
        });
    }, [projects]);

    return (
        <group position={position} ref={groupRef}>
            {/* Central Star (Category or Galaxy Core) */}
            <group onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
                <PlanetRender size={1.5} color={color} name={name} isStar={false} />
            </group>

            <Text position={[0, 2.5, 0]} fontSize={0.8} color={color} anchorX="center" anchorY="bottom">
                {name}
            </Text>

            {/* Orbit Rings */}
            {projects.length > 0 && (
                <mesh rotation-x={Math.PI / 2}>
                    <ringGeometry args={[3, 10, 64]} />
                    <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.05} />
                </mesh>
            )}

            {/* Planets */}
            {planets.map((planet, i) => (
                <Planet
                    key={i}
                    position={planet.position}
                    size={planet.size}
                    color={isCategory ? "#aaa" : "#ffcc00"} // Different color for actual projects vs categories if needed
                    name={planet.title || planet.name}
                    onClick={() => onProjectClick && onProjectClick(planet)}
                />
            ))}
        </group>
    );
};

export default SolarSystem;
