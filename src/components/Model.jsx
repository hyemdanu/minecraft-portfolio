import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTFWithKTX2 } from './useGLTFWithKTX2'

const CHUNKS = [
  '/models/wood-transformed.glb',
  '/models/stone-transformed.glb',
  '/models/terrain-transformed.glb',
  '/models/decoration-transformed.glb',
  '/models/transparent-transformed.glb',
]

function convertMaterialsToMeshBasicMaterial(materials, alphaTestValue = 0.5) {
  Object.keys(materials).forEach((k) => {
    const m = materials[k]
    if (m.emissiveMap) {
      const map = m.emissiveMap
      const needsAlpha = map.format === THREE.RGBAFormat
      materials[k] = new THREE.MeshBasicMaterial({
        map,
        transparent: needsAlpha,
        alphaTest: needsAlpha ? alphaTestValue : 0,
        side: needsAlpha ? THREE.DoubleSide : THREE.FrontSide,
        depthWrite: true,
      })
    } else {
      materials[k] = new THREE.MeshBasicMaterial({
        map: m.map,
        transparent: true,
        alphaTest: alphaTestValue,
        side: THREE.DoubleSide,
        depthWrite: true,
      })
    }
  })
  return materials
}

function Chunk({ path }) {
  const { scene, materials } = useGLTFWithKTX2(path)

  const processedScene = useMemo(() => {
    convertMaterialsToMeshBasicMaterial(materials)
    scene.traverse((child) => {
      if (child.isMesh) {
        const matName = child.material?.name
        if (matName && materials[matName]) {
          child.material = materials[matName]
        }
      }
    })
    scene.position.set(0, 0, 0)
    return scene
  }, [scene, materials])

  return <primitive object={processedScene} />
}

export default function Model() {
  return (
    <group>
      {CHUNKS.map((path) => (
        <Chunk key={path} path={path} />
      ))}
    </group>
  )
}
