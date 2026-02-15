import { Text, useTexture, RoundedBox } from '@react-three/drei';
import Book from './Book';
import { useMemo } from 'react';
import * as THREE from 'three';

const BOOK_COLORS = [
    '#38040E', '#1B2E1C', '#0A0A2A', '#1C0F0B', '#2F0808', '#0F1F2F', '#3B1E08', '#000000',
    '#5D4037', '#4E342E', '#3E2723', '#8D6E63', '#795548', '#6D4C41', // Browns
    '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', // Deep Colors
    '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', // Greens/Oranges
    '#E65100', '#BF360C', '#3E2723', '#263238', '#212121', '#424242'  // Rust/Grey
];

const Bookshelf = ({ position, name, color, projects, onProjectClick, selectedProject }) => {
    // Load Texture
    const woodTexture = useTexture('/textures/sandblasted_oak.png');
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(2, 2);

    // Generate static colors for books based on their ID or index
    const bookColors = useMemo(() => {
        return projects.map((_, i) => BOOK_COLORS[i % BOOK_COLORS.length]);
    }, [projects]);

    return (
        <group position={position}>


            {/* Shelf Structure - Sandblasted Oak with Bevels */}

            {/* Main Backing */}
            <mesh position={[0, 0, -0.4]} receiveShadow castShadow>
                <boxGeometry args={[5, 2.5, 0.2]} />
                <meshStandardMaterial map={woodTexture} color="#d4c5a3" roughness={0.8} /> {/* Light Sandblasted Oak */}
            </mesh>

            {/* Top Cornice (Molding) */}
            <RoundedBox args={[5.2, 0.3, 0.4]} radius={0.05} smoothness={4} position={[0, 1.35, -0.3]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#bfa37e" roughness={0.8} />
            </RoundedBox>

            {/* Bottom Baseboard (Molding) */}
            <RoundedBox args={[5.2, 0.3, 0.4]} radius={0.05} smoothness={4} position={[0, -1.35, -0.3]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#bfa37e" roughness={0.8} />
            </RoundedBox>

            {/* Shelves - Bevelled Edges */}
            {/* Bottom */}
            <RoundedBox args={[5, 0.1, 1]} radius={0.02} smoothness={4} position={[0, -1.2, 0]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#d4c5a3" roughness={0.8} />
            </RoundedBox>
            {/* Middle */}
            <RoundedBox args={[5, 0.1, 1]} radius={0.02} smoothness={4} position={[0, 0, 0]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#d4c5a3" roughness={0.8} />
            </RoundedBox>
            {/* Top */}
            <RoundedBox args={[5, 0.1, 1]} radius={0.02} smoothness={4} position={[0, 1.25, 0]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#d4c5a3" roughness={0.8} />
            </RoundedBox>

            {/* Sides with Pillars/Columns effect */}
            <RoundedBox args={[0.3, 2.8, 0.4]} radius={0.05} smoothness={4} position={[-2.55, 0, -0.1]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#bfa37e" roughness={0.8} />
            </RoundedBox>
            <RoundedBox args={[0.3, 2.8, 0.4]} radius={0.05} smoothness={4} position={[2.55, 0, -0.1]} receiveShadow castShadow>
                <meshStandardMaterial map={woodTexture} color="#bfa37e" roughness={0.8} />
            </RoundedBox>

            {/* Shelf Label (Gold Plate) */}
            <mesh position={[0, 1.35, 0.52]} castShadow>
                <boxGeometry args={[2, 0.25, 0.05]} />
                <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} /> {/* High Polish Gold */}
            </mesh>
            <Text position={[0, 1.35, 0.555]} fontSize={0.14} color="#050505" font="/fonts/Cinzel-Regular.woff" anchorX="center" letterSpacing={0.05}>
                {name.toUpperCase()}
            </Text>

            {/* Books - Fill all 3 shelves */}
            {[1.25, 0, -1.2].flatMap((shelfY, shelfIndex) => {
                // Middle shelf (index 1) contains the actual projects
                const isProjectShelf = shelfIndex === 1;
                // Top shelf (index 0) and Bottom shelf (index 2) are fillers

                const shelfCapacity = 24;
                const startX = -2.3;
                const gap = 0.2;

                const projectCount = projects?.length || 0;
                const startIndex = Math.floor((shelfCapacity - projectCount) / 2);

                return Array.from({ length: shelfCapacity }).map((_, i) => {
                    const x = startX + i * gap;

                    let project = null;
                    let isFiller = true;

                    if (isProjectShelf) {
                        const projectIndex = i - startIndex;
                        if (projectIndex >= 0 && projectIndex < projectCount) {
                            project = projects[projectIndex];
                            isFiller = false;
                        }
                    }

                    // Randomize color for fillers
                    const colorIndex = (shelfIndex * 100 + i) % BOOK_COLORS.length;
                    const bookColor = BOOK_COLORS[colorIndex];

                    const key = `shelf-${shelfIndex}-book-${i}`;

                    return (
                        <Book
                            key={key}
                            position={[x, shelfY + 0.55, 0]}
                            rotation={[0, 0, isFiller ? Math.sin((shelfIndex * 100 + i + (name ? name.length * 10 : 0)) * 123.45) * 0.1 : 0]}
                            color={isFiller ? bookColor : "#D4AF37"}
                            project={project}
                            onClick={() => !isFiller && onProjectClick(project)}
                            isSelected={!isFiller && selectedProject?.id === project?.id}
                            isFiller={isFiller}
                        />
                    );
                });
            })}
        </group>
    );
};

export default Bookshelf;
