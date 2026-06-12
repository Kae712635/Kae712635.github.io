import { Text } from '@react-three/drei';
import Book from './Book';
import FillerBooks from './FillerBooks';
import { useMemo } from 'react';

const BOOK_COLORS = [
    '#38040E', '#1B2E1C', '#0A0A2A', '#1C0F0B', '#2F0808', '#0F1F2F', '#3B1E08', '#000000',
    '#5D4037', '#4E342E', '#3E2723', '#8D6E63', '#795548', '#6D4C41', // Browns
    '#880E4F', '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', // Deep Colors
    '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', // Greens/Oranges
    '#E65100', '#BF360C', '#3E2723', '#263238', '#212121', '#424242'  // Rust/Grey
];

const Bookshelf = ({ position, name, projects, onProjectClick, selectedProject }) => {
    // No textures - using PBR colors only to avoid GPU texture limit

    const { fillers, activeBooks } = useMemo(() => {
        const fillers = [];
        const activeBooks = [];
        const shelfYPositions = [1.25, 0, -1.2]; // Top, Middle, Bottom

        shelfYPositions.forEach((shelfY, shelfIndex) => {
            // Middle shelf (index 1) contains the actual projects
            const isProjectShelf = shelfIndex === 1;
            // Top shelf (index 0) and Bottom shelf (index 2) are fillers

            const shelfCapacity = 24;
            const startX = -2.3;
            const gap = 0.2;

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

                // Rotation for fillers
                const rotationZ = isFiller ? Math.sin((shelfIndex * 100 + i + (name ? name.length * 10 : 0)) * 123.45) * 0.1 : 0;

                const pos = [x, shelfY + 0.55, 0];
                const rot = [0, 0, rotationZ];

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
            {/* Shelf Structure - Sandblasted Oak with Bevels */}

            {/* Main Backing */}
            <mesh position={[0, 0, -0.4]}>
                <boxGeometry args={[5, 2.5, 0.2]} />
                <meshStandardMaterial color="#d4c5a3" roughness={0.8} metalness={0.0} />
            </mesh>

            {/* Sides with Pillars/Columns effect */}
            <mesh position={[-2.55, 0, -0.1]}>
                <boxGeometry args={[0.3, 2.8, 0.4]} />
                <meshStandardMaterial color="#bfa37e" roughness={0.8} metalness={0.0} />
            </mesh>
            <mesh position={[2.55, 0, -0.1]}>
                <boxGeometry args={[0.3, 2.8, 0.4]} />
                <meshStandardMaterial color="#bfa37e" roughness={0.8} metalness={0.0} />
            </mesh>

            {/* Top Cornice (Molding) */}
            <mesh position={[0, 1.35, -0.3]}>
                <boxGeometry args={[5.2, 0.3, 0.4]} />
                <meshStandardMaterial color="#bfa37e" roughness={0.8} metalness={0.0} />
            </mesh>

            {/* Bottom Baseboard (Molding) */}
            <mesh position={[0, -1.35, -0.3]}>
                <boxGeometry args={[5.2, 0.3, 0.4]} />
                <meshStandardMaterial color="#bfa37e" roughness={0.8} metalness={0.0} />
            </mesh>

            {/* Shelves - Bevelled Edges */}
            {/* Bottom */}
            <mesh position={[0, -1.2, 0]}>
                <boxGeometry args={[5, 0.1, 1]} />
                <meshStandardMaterial color="#d4c5a3" roughness={0.8} metalness={0.0} />
            </mesh>
            {/* Middle */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[5, 0.1, 1]} />
                <meshStandardMaterial color="#d4c5a3" roughness={0.8} metalness={0.0} />
            </mesh>
            {/* Top */}
            <mesh position={[0, 1.25, 0]}>
                <boxGeometry args={[5, 0.1, 1]} />
                <meshStandardMaterial color="#d4c5a3" roughness={0.8} metalness={0.0} />
            </mesh>

            {/* Shelf Label (Gold Plate) */}
            <mesh position={[0, 1.35, 0.52]}>
                <boxGeometry args={[2, 0.25, 0.05]} />
                <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} /> {/* High Polish Gold */}
            </mesh>
            <Text position={[0, 1.35, 0.555]} fontSize={0.14} color="#050505" font="/fonts/Cinzel-Regular.woff" anchorX="center" letterSpacing={0.05}>
                {name.toUpperCase()}
            </Text>

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
        </group>
    );
};

export default Bookshelf;
