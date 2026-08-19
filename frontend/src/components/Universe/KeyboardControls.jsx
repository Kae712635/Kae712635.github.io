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
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.repeat) return;

            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                case 'KeyZ':
                    keys.current.forward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                case 'KeyQ':
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
                case 'KeyZ':
                    keys.current.forward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                case 'KeyQ':
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

    // Room boundaries (strict walls)
    const MIN_X = -7.5;
    const MAX_X = 7.5;
    const MIN_Z = -36.2;
    const MAX_Z = 9.4;
    const EYE_Y = 1.6;

    useFrame((state, delta) => {
        if (!controls) return;

        const { forward, backward, left, right } = keys.current;

        // Current forward offset from camera to target
        const offset = new THREE.Vector3().subVectors(controls.target, camera.position);
        if (offset.lengthSq() < 0.0001) {
            offset.set(0, 0, -10);
        }

        if (forward || backward || left || right) {
            const moveSpeed = 7.5 * delta;
            const rotateSpeed = 1.9 * delta;

            // 1. Turn camera angle with Left/Right keys
            if (left || right) {
                const angle = (left ? 1 : -1) * rotateSpeed;
                offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            }

            // 2. Forward/backward movement along view direction
            const moveVector = new THREE.Vector3();
            if (forward || backward) {
                const moveDir = offset.clone();
                moveDir.y = 0; // Lock strictly to floor plane
                if (moveDir.lengthSq() > 0.001) {
                    moveDir.normalize();
                    if (backward) moveDir.negate();
                    moveVector.copy(moveDir).multiplyScalar(moveSpeed);
                }
            }

            // Solid collision check
            const checkCollision = (pos) => {
                const x = pos.x;
                const z = pos.z;
                const PLAYER_RADIUS = 0.45;

                // 1. Outer library boundary check
                if (x < MIN_X + PLAYER_RADIUS || x > MAX_X - PLAYER_RADIUS) return true;
                if (z < MIN_Z + PLAYER_RADIUS || z > MAX_Z - PLAYER_RADIUS) return true;

                const inBox = (cx, cz, w, d) => {
                    const halfW = w / 2 + PLAYER_RADIUS;
                    const halfD = d / 2 + PLAYER_RADIUS;
                    return (x > cx - halfW && x < cx + halfW && z > cz - halfD && z < cz + halfD);
                };

                // 2. Reception & Language Desks (Front Entrance)
                if (inBox(-4, 7.5, 3.2, 2.0)) return true;
                if (inBox(4, 7.5, 3.2, 2.0)) return true;

                // 3. Bookshelves & Pillars (along left and right aisles)
                for (let i = 0; i < 5; i++) {
                    const bayZ = -5 - i * 9;
                    if (inBox(-6.8, bayZ, 2.2, 5.5)) return true;
                    if (inBox(6.8, bayZ, 2.2, 5.5)) return true;
                }

                return false;
            };

            // Apply movement with sliding
            if (moveVector.lengthSq() > 0.0001) {
                const newPos = camera.position.clone().add(moveVector);
                if (!checkCollision(newPos)) {
                    camera.position.add(moveVector);
                } else {
                    // Try sliding along X
                    const moveX = new THREE.Vector3(moveVector.x, 0, 0);
                    const posX = camera.position.clone().add(moveX);
                    if (!checkCollision(posX) && Math.abs(moveVector.x) > 0.0001) {
                        camera.position.add(moveX);
                    } else {
                        // Try sliding along Z
                        const moveZ = new THREE.Vector3(0, 0, moveVector.z);
                        const posZ = camera.position.clone().add(moveZ);
                        if (!checkCollision(posZ) && Math.abs(moveVector.z) > 0.0001) {
                            camera.position.add(moveZ);
                        }
                    }
                }
            }
        }

        // HARD SAFETY LOCKDOWN: Camera is physically clamped inside room bounds every frame
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, MIN_X, MAX_X);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, MIN_Z, MAX_Z);
        camera.position.y = EYE_Y;

        // Keep look target aligned
        controls.target.copy(camera.position).add(offset);
        camera.lookAt(controls.target);
    });

    return null;
};

export default KeyboardControls;
