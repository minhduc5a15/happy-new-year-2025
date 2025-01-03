'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { createSVGTexture } from '@/lib/utils';

function Firework({ position }: { position: [number, number, number] }) {
    const [particles, setParticles] = useState<THREE.Vector3[]>([]);
    const [colors, setColors] = useState<THREE.Color[]>([]);
    const pointsRef = useRef<THREE.Points>(null);
    const startTime = useRef(Date.now());

    useMemo(() => {
        const newParticles: THREE.Vector3[] = [];
        const newColors: THREE.Color[] = [];
        const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
        for (let i = 0; i < 200; i++) {
            newParticles.push(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
            newColors.push(color);
        }
        setParticles(newParticles);
        setColors(newColors);
        startTime.current = Date.now();
    }, []);

    useFrame(() => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            const elapsedTime = (Date.now() - startTime.current) / 1000;
            for (let i = 0; i < particles.length; i++) {
                const i3 = i * 3;
                particles[i].y += 0.02 - elapsedTime * 0.01; // Gravity effect
                particles[i].x += particles[i].x * 0.01;
                particles[i].z += particles[i].z * 0.01;
                positions[i3] = particles[i].x + position[0];
                positions[i3 + 1] = particles[i].y + position[1];
                positions[i3 + 2] = particles[i].z + position[2];
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particles.length} array={new Float32Array(particles.length * 3)} itemSize={3} />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length}
                    array={new Float32Array(colors.flatMap((c) => [c.r, c.g, c.b]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.2} vertexColors />
        </points>
    );
}

function FireworkDisplay({ isLaunching }: { isLaunching: boolean }) {
    const [fireworks, setFireworks] = useState<{ id: number; position: [number, number, number] }[]>([]);
    const { viewport } = useThree();

    const addFirework = useCallback(() => {
        const x = (Math.random() - 0.5) * viewport.width;
        const y = (Math.random() * viewport.height) / 2;
        const z = (Math.random() - 0.5) * 15;
        setFireworks((prev) => [...prev, { id: Date.now(), position: [x, y, z] }]);
    }, [viewport]);

    useFrame(() => {
        if (isLaunching && Math.random() < 0.2) {
            // Increased frequency when button is pressed
            addFirework();
        }
        setFireworks((prev) => prev.filter((f) => Date.now() - f.id < 2000));
    });

    return (
        <>
            {fireworks.map((firework) => (
                <Firework key={firework.id} position={firework.position} />
            ))}
        </>
    );
}

function AnimatedParticles() {
    const particlesRef = useRef<THREE.Points>(null);
    const particlesCount = 1000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.x += 0.001;
            particlesRef.current.rotation.y += 0.002;
            const time = state.clock.getElapsedTime();
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                positions[i3 + 1] += Math.sin(time + positions[i3] * 0.1) * 0.01;
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#ffff00" transparent opacity={0.8} />
        </points>
    );
}

function NewYearText() {
    const textRef = useRef<THREE.Group>(null);
    const textureUrl = createSVGTexture(256, 256);
    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);

    useFrame((state) => {
        if (textRef.current) {
            textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <group ref={textRef}>
            <Text3D
                font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_bold.typeface.json"
                size={0.8}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                position={[-3.2, 1, 0]}
            >
                Happy New Year
                <meshPhongMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} specular="#ffffff" shininess={100} />
            </Text3D>
            <Text3D
                font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_bold.typeface.json"
                size={1.5}
                height={0.3}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.03}
                bevelSize={0.03}
                bevelOffset={0}
                bevelSegments={5}
                position={[-2.2, -1, 0]}
            >
                2025
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.8} metalness={0.5} roughness={0.2} map={texture} />
            </Text3D>
        </group>
    );
}

function FloatingBalls() {
    const ballsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ballsRef.current) {
            ballsRef.current.children.forEach((child, index) => {
                const time = state.clock.getElapsedTime();
                child.position.y = Math.sin(time * 0.8 + index) * 0.5;
                child.rotation.x = time * 0.5;
                child.rotation.z = time * 0.3;
            });
        }
    });

    return (
        <group ref={ballsRef}>
            {[...Array(5)].map((_, index) => (
                <mesh key={index} position={[index * 2 - 4, 0, -2]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshPhongMaterial color={`hsl(${index * 60}, 100%, 75%)`} />
                </mesh>
            ))}
        </group>
    );
}

export default function NewYear2025() {
    const [isLaunching, setIsLaunching] = useState(false);

    return (
        <div className="w-full h-screen bg-black relative">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, -10, -10]} angle={0.3} intensity={1} />
                <NewYearText />
                <AnimatedParticles />
                <FloatingBalls />
                <FireworkDisplay isLaunching={isLaunching} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
                <OrbitControls enableZoom={false} />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                    className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    onPointerDown={() => setIsLaunching(true)}
                    onPointerUp={() => setIsLaunching(false)}
                    onPointerLeave={() => setIsLaunching(false)}
                >
                    Launch Fireworks!
                </Button>
            </div>
        </div>
    );
}
