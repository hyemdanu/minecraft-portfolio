import { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FallingPetals({
  position = [0, 0, 0],
  radius = 9,
  height = 39,
  color = '#d45e6e',
  opacity = 0.95,
  glareStrength = 0.6,
  count = 100,
  modelPath = '/models/petal.glb',
}) {
  const { scene } = useGLTF(modelPath)
  const meshRef = useRef()

  const { geometry, material } = useMemo(() => {
    let geom = null
    scene.traverse((child) => {
      if (child.isMesh && !geom) geom = child.geometry
    })
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: opacity < 1,
      opacity: opacity,
      side: THREE.DoubleSide,
      depthWrite: true,
      alphaTest: opacity < 1 ? 0.01 : 0,
      toneMapped: false,
    })
    return { geometry: geom, material: mat }
  }, [scene, color, opacity])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const petals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * radius * 2,
      z: (Math.random() - 0.5) * radius * 2,
      y: Math.random() * height,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      rotSpeedX: (Math.random() - 0.5) * 1.5,
      rotSpeedY: (Math.random() - 0.5) * 1.5,
      rotSpeedZ: (Math.random() - 0.5) * 1.5,
      fallSpeed: 0.6 + Math.random() * 0.8,
      swayAmp: 0.6 + Math.random() * 1.2,
      swayFreq: 0.4 + Math.random() * 0.8,
      swayPhase: Math.random() * Math.PI * 2,
      scale: 0.4 + Math.random() * 0.4,
    }))
  }, [count, radius, height])

  const sunDir = useMemo(() => new THREE.Vector3(-0.6, 0.5, 0.6).normalize(), [])
  const localUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const tmpVec = useMemo(() => new THREE.Vector3(), [])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const baseColor = useMemo(() => new THREE.Color(color), [color])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i]

      p.y -= p.fallSpeed * delta
      if (p.y < -2) p.y = height + Math.random() * 5

      p.rotX += p.rotSpeedX * delta
      p.rotY += p.rotSpeedY * delta
      p.rotZ += p.rotSpeedZ * delta

      const swayX = Math.sin(t * p.swayFreq + p.swayPhase) * p.swayAmp
      const swayZ = Math.cos(t * p.swayFreq * 0.7 + p.swayPhase) * p.swayAmp

      dummy.position.set(p.x + swayX, p.y, p.z + swayZ)
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      tmpVec.copy(localUp).applyEuler(dummy.rotation)
      const facing = Math.max(0, tmpVec.dot(sunDir))
      const lift = 0.5 + Math.pow(facing, 0.8) * glareStrength
      tmpColor.copy(baseColor)
      tmpColor.r += lift
      tmpColor.g += lift
      tmpColor.b += lift
      meshRef.current.setColorAt(i, tmpColor)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  if (!geometry || !material) return null

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    </group>
  )
}

useGLTF.preload('/models/petal.glb')
