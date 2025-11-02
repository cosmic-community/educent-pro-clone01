'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere({ position, color }: { position: [number, number, number], color: string }) {
    const meshRef = useRef<THREE.Mesh>(null)
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01
            meshRef.current.rotation.y += 0.01
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5
        }
    })
    
    return (
        <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
            <MeshDistortMaterial color={color} speed={2} distort={0.3} />
        </Sphere>
    )
}

function AnimatedBox({ position, color }: { position: [number, number, number], color: string }) {
    const meshRef = useRef<THREE.Mesh>(null)
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })
    
    return (
        <Box ref={meshRef} position={position} args={[1, 1, 1]}>
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </Box>
    )
}

function AnimatedTorus({ position, color }: { position: [number, number, number], color: string }) {
    const meshRef = useRef<THREE.Mesh>(null)
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.4
        }
    })
    
    return (
        <Torus ref={meshRef} position={position} args={[0.7, 0.3, 16, 100]}>
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </Torus>
    )
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 opacity-30">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <AnimatedSphere position={[-3, 2, 0]} color="#3B82F6" />
                <AnimatedSphere position={[3, -2, 0]} color="#8B5CF6" />
                <AnimatedBox position={[0, 0, 0]} color="#10B981" />
                <AnimatedBox position={[-4, -2, -2]} color="#F59E0B" />
                <AnimatedTorus position={[4, 2, -1]} color="#EF4444" />
                <AnimatedTorus position={[-2, 3, -2]} color="#EC4899" />
                
                <fog attach="fog" args={['#f0f4f8', 5, 15]} />
            </Canvas>
        </div>
    )
}