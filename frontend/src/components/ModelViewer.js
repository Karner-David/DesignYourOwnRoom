import React, { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ModelViewer({ modelData }) {
    const vertices = modelData?.vertices || [];
    const faces = modelData?.faces || [];

    const scaleFactor = 10;
    const points = useMemo(() => {
        return vertices.map(([x, y, z]) => ({
            position: [x * scaleFactor, y * scaleFactor, z * scaleFactor],
        }));
    }, [vertices]);

    const calculateBoundingBoxCenter = (vertices) => {
        if (!vertices.length) return [0, 0, 0];

        const x = vertices.map(([x]) => x);
        const y = vertices.map(([, y]) => y);
        const z = vertices.map(([, , z]) => z);

        const centerX = (Math.max(...x) + Math.min(...x)) / 2;
        const centerY = (Math.max(...y) + Math.min(...y)) / 2;
        const centerZ = (Math.max(...z) + Math.min(...z)) / 2;

        return [centerX * scaleFactor, centerY * scaleFactor, centerZ * scaleFactor];
    };

    const center = calculateBoundingBoxCenter(vertices);

    const CameraAdjuster = () => {
        const { camera } = useThree();
        camera.position.set(center[0], center[1], center[2] + 15); // Adjust the 15 to control distance
        camera.lookAt(center[0], center[1], center[2]);
        return null;
    };

    return (
        <Canvas camera={{ position: [0, 0, 20] }} style={{ height: '500px', width: '100%' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />

            <CameraAdjuster />

            {/* Render the mesh */}
            {vertices.length > 0 && faces.length > 0 && (
                <mesh>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array(vertices.flat())}
                            count={vertices.length}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="index"
                            array={new Uint16Array(faces.flat())}
                            count={faces.length * 3}
                            itemSize={1}
                        />
                    </bufferGeometry>
                    <meshStandardMaterial color="blue" wireframe />
                </mesh>
            )}
        </Canvas>
    );
}

export default ModelViewer;
