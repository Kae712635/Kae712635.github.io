import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import Book from './Book';
import FillerBooks from './FillerBooks';

const BOOK_COLORS = [
    '#2E221B', '#3B2C24', '#4A382D', '#242526', '#2B3D41',
    '#1F2022', '#342720', '#5C2830', '#243336', '#C8B9A6',
    '#3D2A22', '#453529', '#2B2D2F', '#7A6032', '#D4C5B3'
];

const Bookshelf = ({ position, name, projects, onProjectClick, selectedProject }) => {
    // Determine book layouts
    const { fillers, activeBooks } = useMemo(() => {
        const fillers = [];
        const activeBooks = [];
        const shelfYPositions = [1.25, 0, -1.2]; // Top, Middle, Bottom

        shelfYPositions.forEach((shelfY, shelfIndex) => {
            // Middle shelf (index 1) contains the actual projects
            const isProjectShelf = shelfIndex === 1;

            const shelfCapacity = 24;
            const SHELF_WIDTH = 3.6;
            const startX = -SHELF_WIDTH / 2;
            const gap = SHELF_WIDTH / shelfCapacity;

            const projectCount = projects?.length || 0;
            const startIndex = Math.floor((shelfCapacity - projectCount) / 2);

            for (let i = 0; i < shelfCapacity; i++) {
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

                // Pick color for both filler and active books from the rich library palette
                const colorIndex = (shelfIndex * 100 + i) % BOOK_COLORS.length;
                const bookColor = BOOK_COLORS[colorIndex];

                // Rotation and depth for realistic placement
                const depthOffset = isFiller ? (Math.sin(shelfIndex * 10 + i * 7.3) * 0.04 + Math.cos(i * 3.1) * 0.04) : 0.02;
                const rotationY = isFiller ? (Math.sin(i * 12.3) * 0.08) : 0;
                const rotationZ = isFiller ? Math.sin((shelfIndex * 100 + i + (name ? name.length * 10 : 0)) * 123.45) * 0.05 : 0;

                const pos = [x, shelfY + 0.55, depthOffset];
                const rot = [0, rotationY, rotationZ];

                if (isFiller) {
                    fillers.push({
                        position: pos,
                        rotation: rot,
                        color: bookColor
                    });
                } else {
                    activeBooks.push({
                        key: `shelf-${shelfIndex}-book-${i}`,
                        position: pos,
                        rotation: [0, 0, 0], // Active books stand proud
                        color: bookColor,     // Same base palette as other books
                        project: project
                    });
                }
            }
        });
        return { fillers, activeBooks };
    }, [projects, name]);

    return (
        <group position={position}>
            <group>
                {/* 1. Solid Ground Base Plinth (Firmly seated on floor) */}
                <mesh position={[0, -1.26, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4.25, 0.16, 1.05]} />
                    <meshStandardMaterial color="#321D13" roughness={0.5} metalness={0.08} />
                </mesh>

                {/* 2. Solid Wooden Backing Panel (No see-through void behind books) */}
                <mesh position={[0, 0.05, -0.48]} castShadow receiveShadow>
                    <boxGeometry args={[4.15, 2.7, 0.06]} />
                    <meshStandardMaterial color="#2A170F" roughness={0.65} metalness={0.05} />
                </mesh>

                {/* 3. Solid Heavy Side Columns with Gold Capitals */}
                <mesh position={[-2.05, 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.14, 2.65, 1.02]} />
                    <meshStandardMaterial color="#42281D" roughness={0.4} metalness={0.1} />
                </mesh>
                <mesh position={[2.05, 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.14, 2.65, 1.02]} />
                    <meshStandardMaterial color="#42281D" roughness={0.4} metalness={0.1} />
                </mesh>
                {/* Gold Column Trims */}
                <mesh position={[-2.05, 1.34, 0.52]}>
                    <boxGeometry args={[0.16, 0.04, 0.03]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[2.05, 1.34, 0.52]}>
                    <boxGeometry args={[0.16, 0.04, 0.03]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* 4. Shelves with Warm Wood & Fine Gold Edge Moulding */}
                {/* Bottom shelf */}
                <mesh position={[0, -1.18, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 0.98]} />
                    <meshStandardMaterial color="#42281D" roughness={0.38} metalness={0.12} />
                </mesh>
                <mesh position={[0, -1.18, 0.5]}>
                    <boxGeometry args={[4.02, 0.015, 0.02]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* Middle shelf */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 0.98]} />
                    <meshStandardMaterial color="#42281D" roughness={0.38} metalness={0.12} />
                </mesh>
                <mesh position={[0, 0, 0.5]}>
                    <boxGeometry args={[4.02, 0.015, 0.02]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* Top shelf */}
                <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 0.98]} />
                    <meshStandardMaterial color="#42281D" roughness={0.38} metalness={0.12} />
                </mesh>
                <mesh position={[0, 1.25, 0.5]}>
                    <boxGeometry args={[4.02, 0.015, 0.02]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* 5. Top Crown Cornice with Gold Architrave */}
                <mesh position={[0, 1.34, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4.25, 0.1, 1.05]} />
                    <meshStandardMaterial color="#382218" roughness={0.45} metalness={0.08} />
                </mesh>
                <mesh position={[0, 1.39, 0.53]}>
                    <boxGeometry args={[4.27, 0.02, 0.02]} />
                    <meshStandardMaterial color="#D4A24E" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Shelf Label Header */}
                <group position={[0, 1.52, 0]}>
                    <mesh position={[0, 0, 0]} castShadow>
                        <boxGeometry args={[2.4, 0.28, 0.06]} />
                        <meshStandardMaterial color="#A6303B" metalness={0.1} roughness={0.6} />
                    </mesh>
                    <mesh position={[0, 0, -0.005]}>
                        <boxGeometry args={[2.46, 0.32, 0.05]} />
                        <meshStandardMaterial color="#D4A24E" metalness={0.85} roughness={0.2} />
                    </mesh>
                    <Text position={[0, 0, 0.036]} fontSize={0.14} color="#F5EBDD" font="/fonts/Cinzel-Regular.woff" anchorX="center" letterSpacing={0.05}>
                        {name ? name.toUpperCase() : ''}
                    </Text>
                </group>

                {/* Filler Books (Instanced Mesh) */}
                <FillerBooks bookData={fillers} />

                {/* Active Project Books (Separate Components with subtle shimmer) */}
                {activeBooks.map((book) => (
                    <Book
                        key={book.key}
                        position={book.position}
                        rotation={book.rotation}
                        color={book.color}
                        project={book.project}
                        onClick={() => onProjectClick(book.project)}
                        isSelected={selectedProject?.id === book.project?.id}
                        isFiller={false}
                    />
                ))}
            </group>
        </group>
    );
};

export default Bookshelf;
