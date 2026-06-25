import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

function ChromeSphere() {
  const meshRef = useRef<Mesh>(null)
  const { camera, pointer } = useThree()
  const target = new Vector3()

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Subtle mouse tracking — sphere leans toward cursor
    target.set(pointer.x * 0.8, pointer.y * 0.5, 0)
    meshRef.current.position.lerp(target, delta * 1.5)

    // Very slow rotation — alive but not distracting
    meshRef.current.rotation.y += delta * 0.08
    meshRef.current.rotation.x += delta * 0.03
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        metalness={1}
        roughness={0.05}
        envMapIntensity={1.5}
        color="#ffffff"
      />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#060a14' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        {/* HDRI environment — what the chrome reflects */}
        <Environment preset="studio" />

        {/* Warm amber key light */}
        <directionalLight
          position={[5, 8, 3]}
          intensity={1.2}
          color="#ffa050"
        />

        {/* Cool fill */}
        <directionalLight
          position={[-5, 3, -3]}
          intensity={0.2}
          color="#8090c0"
        />

        {/* Very low ambient */}
        <ambientLight intensity={0.04} />

        <ChromeSphere />

        {/* Subtle bloom on the chrome highlights */}
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        {/* Remove this once you're done exploring */}
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}