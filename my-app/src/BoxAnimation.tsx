import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

const ROTATE_STEP = Math.PI / 4
const LERP = 0.12
const DRAG_SENSITIVITY = 0.01

export default function BoxAnimation() {
  const meshRef = useRef<Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0, z: 0 })
  const dragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const targetPosition = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); targetRotation.current.y += ROTATE_STEP; break
        case 'ArrowRight': e.preventDefault(); targetRotation.current.y -= ROTATE_STEP; break
        case 'ArrowUp':    e.preventDefault(); targetRotation.current.x -= ROTATE_STEP; break
        case 'ArrowDown':  e.preventDefault(); targetRotation.current.x += ROTATE_STEP; break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const m = meshRef.current
    const t = targetRotation.current
    m.rotation.x += (t.x - m.rotation.x) * LERP
    m.rotation.y += (t.y - m.rotation.y) * LERP
    m.position.x += (targetPosition.current.x - m.position.x) * LERP
    m.position.y += (targetPosition.current.y - m.position.y) * LERP
  })

  return (
    <mesh
      ref={meshRef}
      onPointerDown={(e) => {
        e.stopPropagation()
        dragging.current = true
        lastPointer.current = { x: e.clientX, y: e.clientY }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!dragging.current || !meshRef.current) return
        const dx = e.clientX - lastPointer.current.x
        const dy = e.clientY - lastPointer.current.y
        lastPointer.current = { x: e.clientX, y: e.clientY }
        meshRef.current.position.x += dx * DRAG_SENSITIVITY
        meshRef.current.position.y -= dy * DRAG_SENSITIVITY
        targetPosition.current.x += dx * DRAG_SENSITIVITY
        targetPosition.current.y -= dy * DRAG_SENSITIVITY
      }}
      onPointerUp={(e) => {
        dragging.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color="red" />
    </mesh>
  )
}