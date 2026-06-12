import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

const tempColor = new THREE.Color();
const tempObj = new THREE.Object3D();

const FillerBooks = ({ bookData }) => {
    const meshRef = useRef();
    const pagesRef = useRef();
    // No textures - using PBR colors only to avoid GPU texture limit

    // Geometry constants matching Book.jsx
    // Book Dimensions: width = 0.15, height = 1, depth = 0.8
    const width = 0.15;
    const height = 1;
    const depth = 0.8;

    const count = bookData.length;

    useLayoutEffect(() => {
        if (!meshRef.current || !pagesRef.current) return;

        bookData.forEach((data, i) => {
            const { position, rotation, color } = data;

            // Set transform
            tempObj.position.set(position[0], position[1], position[2]);
            tempObj.rotation.set(rotation[0], rotation[1], rotation[2]);
            tempObj.updateMatrix();

            // Apply to Cover Mesh
            meshRef.current.setMatrixAt(i, tempObj.matrix);
            tempColor.set(color);
            meshRef.current.setColorAt(i, tempColor);

            // Apply to Pages Mesh (same transform)
            pagesRef.current.setMatrixAt(i, tempObj.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
        pagesRef.current.instanceMatrix.needsUpdate = true;
    }, [bookData]);

    return (
        <group>
            {/* Covers (Spine, Covers) */}
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    roughness={0.6}
                    metalness={0.05}
                />
            </instancedMesh>

            {/* Pages (Inner block) */}
            <instancedMesh ref={pagesRef} args={[null, null, count]}>
                {/* Pages are typically slightly smaller to fit inside covers */}
                <boxGeometry args={[width - 0.04, height - 0.04, depth - 0.04]} />
                <meshStandardMaterial
                    color="#f5deb3"
                    roughness={0.8}
                />
            </instancedMesh>
        </group>
    );
};

export default FillerBooks;
