
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const KeyboardControls = () => {
    const { camera, controls } = useThree();
    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Avoid conflict with input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.repeat) return;
            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    keys.current.forward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    keys.current.left = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    keys.current.backward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keys.current.right = true;
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    keys.current.forward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    keys.current.left = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    keys.current.backward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    keys.current.right = false;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!controls || !controls.enabled) return;

        const { forward, backward, left, right } = keys.current;
        if (!forward && !backward && !left && !right) return;

        // Settings
        const moveSpeed = 10 * delta;
        const rotateSpeed = 2.0 * delta; // Increased slightly for responsiveness

        // Current vector from camera to target (View Direction)
        const offset = new THREE.Vector3().subVectors(controls.target, camera.position);

        // 1. Rotation (Left/Right turns the view)
        if (left || right) {
            const angle = (left ? 1 : -1) * rotateSpeed;
            // Rotate the offset vector around Y axis (global up)
            offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        }

        // 2. Movement (Forward/Backward relative to view)
        const moveVector = new THREE.Vector3();
        if (forward || backward) {
            const moveDir = offset.clone();
            moveDir.y = 0; // Constrain to floor

            if (moveDir.lengthSq() > 0.001) {
                moveDir.normalize();
                if (backward) moveDir.negate();
                moveVector.copy(moveDir).multiplyScalar(moveSpeed);
            }
        }

        // 3. Collision Detection
        // Define boundaries (Simple Bounding Boxes)

        // 3. Collision Detection
        // Define boundaries (Simple Bounding Boxes)
        const checkCollision = (pos) => {
            const x = pos.x;
            const z = pos.z;
            const PLAYER_RADIUS = 0.2; // Reduced further to prevent getting stuck

            // 1. Map Boundaries (Side and Front/Back Walls)
            if (x < -29.5 + PLAYER_RADIUS || x > 29.5 - PLAYER_RADIUS) return true;
            if (z < -52 + PLAYER_RADIUS || z > 15 - PLAYER_RADIUS) return true;

            // 2. Obstacle Checker Helper
            const inBox = (cx, cz, w, d) => {
                const halfW = w / 2 + PLAYER_RADIUS;
                const halfD = d / 2 + PLAYER_RADIUS;
                return (x > cx - halfW && x < cx + halfW && z > cz - halfD && z < cz + halfD);
            };

            // 3. Reception & Entrance
            // Reduced desk sizes slightly to allow passing on sides
            if (inBox(-5, 8, 2.5, 1.2)) return true; // Left Desk
            if (inBox(5, 8, 1.6, 1.2)) return true;  // Right Desk

            // Removed blocking Entrance Columns to allow access to side aisles

            // 4. Bookshelves & Column Rows (Detailed Objects)
            // Sections at X = -20, 0, 20
            const sectionXs = [-20, 0, 20];

            for (const sX of sectionXs) {
                // Optimization: Skip if we are far from this section
                if (Math.abs(x - sX) > 12) continue;

                // Loop through Bays
                for (let i = 0; i < 8; i++) {
                    const bayZ = -5 - i * 6;

                    // -- COLUMNS (at bay end) --
                    const colZ = bayZ + 3;
                    const colSize = 1.1; // Reduced visual size (1.5) to collision (1.1)
                    if (inBox(sX - 6, colZ, colSize, colSize)) return true;
                    if (inBox(sX + 6, colZ, colSize, colSize)) return true;

                    // -- BUSTS (Aligned with Columns now) --
                    const bustSize = 0.4;
                    if (inBox(sX - 3.5, colZ, bustSize, bustSize)) return true;
                    if (inBox(sX + 3.5, colZ, bustSize, bustSize)) return true;

                    // -- BOOKSHELVES (Centered in bay) --
                    // Offset +/- 7.5 from section center
                    // Size: Depth 5m, Thickness ~0.8m
                    const shelfD = 4.8;
                    const shelfW = 0.8;
                    if (inBox(sX - 7.5, bayZ, shelfW, shelfD)) return true;
                    if (inBox(sX + 7.5, bayZ, shelfW, shelfD)) return true;
                }
            }

            return false;
        };

        // 4. Apply updates with collision check
        // Try full move
        const newPos = camera.position.clone().add(moveVector);
        if (!checkCollision(newPos)) {
            camera.position.add(moveVector);
            controls.target.copy(camera.position).add(offset);
        } else {
            // Sliding Logic: Try X only
            const moveX = new THREE.Vector3(moveVector.x, 0, 0);
            const posX = camera.position.clone().add(moveX);
            if (!checkCollision(posX) && Math.abs(moveVector.x) > 0.0001) {
                camera.position.add(moveX);
                controls.target.copy(camera.position).add(offset);
            } else {
                // Try Z only
                const moveZ = new THREE.Vector3(0, 0, moveVector.z);
                const posZ = camera.position.clone().add(moveZ);
                if (!checkCollision(posZ) && Math.abs(moveVector.z) > 0.0001) {
                    camera.position.add(moveZ);
                    controls.target.copy(camera.position).add(offset);
                }
            }
        }
    });

    return null;
};

export default KeyboardControls;
