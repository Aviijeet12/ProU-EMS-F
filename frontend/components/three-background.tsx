"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, MeshDistortMaterial, MeshWobbleMaterial, Sparkles } from "@react-three/drei"
import { useRef } from "react"
import type * as THREE from "three"

function AnimatedSphere({
  position,
  color,
  speed,
  size = 1,
  wobble = false,
}: { position: [number, number, number]; color: string; speed: number; size?: number; wobble?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.5
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 4]} />
        {wobble ? (
          <MeshWobbleMaterial color={color} transparent opacity={0.15} factor={0.6} speed={2} />
        ) : (
          <MeshDistortMaterial color={color} transparent opacity={0.18} distort={0.5} speed={3} roughness={0.1} />
        )}
      </mesh>
    </Float>
  )
}

function TorusKnot({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2
      ref.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <torusKnotGeometry args={[0.8, 0.25, 128, 16]} />
        <MeshDistortMaterial color={color} transparent opacity={0.12} distort={0.3} speed={2} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.015
      meshRef.current.position.y = -5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[80, 80, 50, 50]} />
      <meshBasicMaterial color="#00ffd5" wireframe transparent opacity={0.03} />
    </mesh>
  )
}

function PulsingOrb({
  position,
  color,
  scale = 1,
}: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
      ref.current.scale.setScalar(pulse * scale)
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  )
}

function FloatingRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5
      ref.current.rotation.z = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </Float>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }}>
        <color attach="background" args={["#050508"]} />
        <fog attach="fog" args={["#050508", 10, 40]} />

        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#00ffd5" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00d4ff" />
        <pointLight position={[0, 5, 5]} intensity={0.3} color="#ff00aa" />

        <Stars radius={100} depth={80} count={4000} factor={5} saturation={0.2} fade speed={0.6} />

        <Sparkles count={100} scale={20} size={2} speed={0.5} opacity={0.3} color="#00ffd5" />
        <Sparkles count={50} scale={15} size={3} speed={0.3} opacity={0.2} color="#00d4ff" />

        {/* Main spheres */}
        <AnimatedSphere position={[-6, 3, -10]} color="#00ffd5" speed={1.2} size={2} />
        <AnimatedSphere position={[7, -2, -12]} color="#00d4ff" speed={0.8} size={2.2} wobble />
        <AnimatedSphere position={[0, 5, -15]} color="#ff00aa" speed={0.6} size={1.5} />
        <AnimatedSphere position={[-4, -4, -8]} color="#00ffd5" speed={1.1} size={1.2} wobble />
        <AnimatedSphere position={[5, 4, -14]} color="#00d4ff" speed={0.9} size={1.8} />

        <TorusKnot position={[-8, 0, -15]} color="#ff00aa" />
        <TorusKnot position={[9, 2, -18]} color="#00ffd5" />

        <FloatingRing position={[3, -3, -8]} color="#00ffd5" />
        <FloatingRing position={[-5, 2, -10]} color="#00d4ff" />

        {/* Pulsing orbs */}
        <PulsingOrb position={[4, 3, -5]} color="#00ffd5" scale={1.2} />
        <PulsingOrb position={[-3, -2, -6]} color="#00d4ff" scale={1} />
        <PulsingOrb position={[2, -1, -4]} color="#ff00aa" scale={0.8} />
        <PulsingOrb position={[-6, 1, -7]} color="#00ffd5" scale={0.6} />
        <PulsingOrb position={[6, -3, -8]} color="#00d4ff" scale={1.1} />

        <GridPlane />
      </Canvas>
    </div>
  )
}
