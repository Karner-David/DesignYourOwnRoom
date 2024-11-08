import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ModelViewer({ modelData }) {
    // Separate vertices and faces if provided
    const vertices = modelData?.vertices;  
    const faces = modelData?.faces;        

    const points = useMemo(() => {
        const scaleFactor = 10;
        return modelData?.map(([x, y, z]) => ({
            position: [x * scaleFactor, y * scaleFactor, z * scaleFactor]
        }));
    }, [modelData]);

    return (
        <Canvas camera={{ position: [0, 0, 20] }} style={{ height: '500px', width: '100%' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />

            {/* Render mesh if vertices and faces are provided */}
            {vertices && faces && (
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
                    <meshStandardMaterial color="blue" wireframe={true} />
                </mesh>
            )}

            {/* Otherwise, fallback to rendering point cloud */}
            {!vertices && points && points.map((point, index) => (
                <mesh key={index} position={point.position}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            ))}
        </Canvas>
    );
}

export default ModelViewer;
