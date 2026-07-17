import React, { useMemo } from 'react';
import { Text, Float } from '@react-three/drei';
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
            // Available width for books
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

                // Randomize color for fillers
                const colorIndex = (shelfIndex * 100 + i) % BOOK_COLORS.length;
                const bookColor = BOOK_COLORS[colorIndex];

                // Rotation and depth for realistic placement
                const depthOffset = isFiller ? (Math.sin(shelfIndex * 10 + i * 7.3) * 0.04 + Math.cos(i * 3.1) * 0.04) : 0;
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
                        rotation: [0, 0, 0], // Active books start straight
                        color: "#D4AF37", // Gold
                        project: project
                    });
                }
            }
        });
        return { fillers, activeBooks };
    }, [projects, name]);

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                {/* JUST THE SHELVES - No heavy backing or pillars */}
                {/* Bottom */}
                <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 1]} />
                    <meshStandardMaterial color="#353535" roughness={0.8} metalness={0.0} />
                </mesh>
                {/* Middle */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 1]} />
                    <meshStandardMaterial color="#353535" roughness={0.8} metalness={0.0} />
                </mesh>
                {/* Top */}
                <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
                    <boxGeometry args={[4, 0.08, 1]} />
                    <meshStandardMaterial color="#353535" roughness={0.8} metalness={0.0} />
                </mesh>

                {/* Shelf Label - Floating above */}
                <Float speed={3} rotationIntensity={0.2} floatIntensity={1} floatingRange={[-0.05, 0.05]}>
                    <group position={[0, 1.8, 0]}>
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[2, 0.25, 0.05]} />
                            <meshStandardMaterial color="#415D43" metalness={0.1} roughness={0.8} />
                        </mesh>
                        <Text position={[0, 0, 0.03]} fontSize={0.14} color="#EEE2DF" font="/fonts/Cinzel-Regular.woff" anchorX="center" letterSpacing={0.05}>
                            {name ? name.toUpperCase() : ''}
                        </Text>
                    </group>
                </Float>

                {/* Filler Books (Instanced Mesh) */}
                <FillerBooks bookData={fillers} />

                {/* Active Project Books (Separate Components) */}
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
            </Float>
        </group>
    );
};

export default Bookshelf;
