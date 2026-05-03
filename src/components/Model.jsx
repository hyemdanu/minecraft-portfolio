import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTFWithKTX2 } from './useGLTFWithKTX2'

// Andrew Woan's convert function — handles both baked (opaque emissive) and original (transparent) materials
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

export default function Model(props) {
  const { scene, materials } = useGLTFWithKTX2('/models/scene.glb')

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

    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.x = -center.x
    scene.position.y = -box.min.y
    scene.position.z = -center.z

    return scene
  }, [scene, materials])

  return <primitive object={processedScene} {...props} />
}
