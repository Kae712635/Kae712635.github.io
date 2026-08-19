import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import Book from './Book';
import FillerBooks from './FillerBooks';

const BOOK_COLORS = [
    '#353535', '#415D43', '#8A897C', '#B36A5E', '#EEE2DF',
    '#252525', '#314D33', '#7A796C', '#A35A4E', '#DED2CF',
    '#454545', '#516D53', '#9A998C', '#C37A6E', '#FEF2EF'
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
                    <meshStandardMaterial color="#2c1a12" roughness={0.7} metalness={0.05} />
                </mesh>

                {/* 2. Solid Wooden Backing Panel (No see-through void behind books) */}
                <mesh position={[0, 0.05, -0.48]} castShadow receiveShadow>
                    <boxGeometry args={[4.15, 2.7, 0.06]} />
                    <meshStandardMaterial color="#22140e" roughness={0.75} metalness={0.02} />
                </mesh>

                {/* 3. Solid Heavy Side Columns */}
                <mesh position={[-2.05, 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.14, 2.65, 1.02]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.7} metalness={0.05} />
                </mesh>
                <mesh position={[2.05, 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.14, 2.65, 1.02]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.7} metalness={0.05} />
                </mesh>

                {/* 4. Shelves */}
                {/* Bottom shelf */}
                <mesh position={[0, -1.18, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 0.98]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.75} metalness={0.05} />
                </mesh>
                {/* Middle shelf */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 0.98]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.75} metalness={0.05} />
                </mesh>
                {/* Top shelf */}
                <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 0.98]} />
                    <meshStandardMaterial color="#3E2723" roughness={0.75} metalness={0.05} />
                </mesh>

                {/* 5. Top Crown Cornice */}
                <mesh position={[0, 1.34, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4.25, 0.1, 1.05]} />
                    <meshStandardMaterial color="#2c1a12" roughness={0.7} metalness={0.05} />
                </mesh>

                {/* Shelf Label Header */}
                <group position={[0, 1.52, 0]}>
                    <mesh position={[0, 0, 0]} castShadow>
                        <boxGeometry args={[2.2, 0.26, 0.06]} />
                        <meshStandardMaterial color="#415D43" metalness={0.1} roughness={0.8} />
                    </mesh>
                    <Text position={[0, 0, 0.035]} fontSize={0.14} color="#EEE2DF" font="/fonts/Cinzel-Regular.woff" anchorX="center" letterSpacing={0.05}>
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
