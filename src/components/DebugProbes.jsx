import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { debugStore } from '../state/debugStore'

// Inside-Canvas probes. Tracks WebGL context loss, render stats,
// and a heartbeat so we know when (and where) the page dies.
export default function DebugProbes() {
  const enabled =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('debug')

  const { gl, scene } = useThree()
  const frameCount = useRef(0)
  const lastDump = useRef(0)
  const lastBeat = useRef(0)

  // WebGL context loss detection — fires when the GPU/OS kills the context
  useEffect(() => {
    if (!enabled) return
    const canvas = gl.domElement
    const onLost = (e) => {
      e.preventDefault()
      debugStore.err(`WEBGL CONTEXT LOST — GPU dropped us`)
    }
    const onRestored = () => {
      debugStore.log(`webgl context restored`)
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    debugStore.log(`canvas mounted, gl ready`)
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
    }
  }, [enabled, gl])

  // Heartbeat + periodic stats every 2 seconds while alive.
  useFrame((state) => {
    if (!enabled) return
    frameCount.current += 1
    const now = state.clock.elapsedTime

    if (now - lastBeat.current >= 2) {
      lastBeat.current = now
      // Memory if available (Chrome only)
      let mem = ''
      if (performance.memory) {
        const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(0)
        const limit = (performance.memory.jsHeapSizeLimit / 1048576).toFixed(0)
        mem = ` heap=${used}/${limit}MB`
      }
      const info = gl.info
      const calls = info?.render?.calls ?? '?'
      const tris = info?.render?.triangles ?? '?'
      const geos = info?.memory?.geometries ?? '?'
      const texs = info?.memory?.textures ?? '?'
      let sceneObjs = 0
      scene.traverse(() => { sceneObjs += 1 })
      debugStore.log(
        `t=${now.toFixed(1)}s frames=${frameCount.current} draws=${calls} tris=${tris} geom=${geos} tex=${texs} obj=${sceneObjs}${mem}`
      )
    }

    // Per-second tick (compact heartbeat) — different cadence
    if (now - lastDump.current >= 10) {
      lastDump.current = now
      const dpr = gl.getPixelRatio()
      const size = gl.getSize(new (window.THREE?.Vector2 || class V {})())
      debugStore.log(`tick: dpr=${dpr.toFixed(2)} canvas=${size?.x ?? '?'}x${size?.y ?? '?'}`)
    }
  })

  return null
}
