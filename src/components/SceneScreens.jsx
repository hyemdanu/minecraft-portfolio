import { Billboard, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState, useSyncExternalStore } from 'react'
import { SCREENS } from '../data/screens'
import { cameraStore, TOTAL_WAYPOINTS } from '../state/cameraStore'
import { uiStore } from '../state/uiStore'
import { DENSE_TARGETS } from './CameraPath'

// Cyclic distance between two waypoint indices on the looped path
function cyclicDistance(a, b, total) {
  const d = Math.abs(a - b)
  return Math.min(d, total - d)
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export default function SceneScreens() {
  const { waypointIndex } = useSyncExternalStore(cameraStore.subscribe, cameraStore.get)
  const { screensHidden } = useSyncExternalStore(uiStore.subscribe, uiStore.get)
  if (screensHidden) return null
  return (
    <>
      {SCREENS.map((screen) => (
        <SceneScreen key={screen.id} screen={screen} currentWp={waypointIndex} />
      ))}
    </>
  )
}

function SceneScreen({ screen, currentWp }) {
  const anchorIdx = (screen.anchorWaypoint - 1 + TOTAL_WAYPOINTS) % TOTAL_WAYPOINTS
  const fadeBand = screen.fadeBand ?? 6
  const dist = cyclicDistance(currentWp, anchorIdx, TOTAL_WAYPOINTS)

  // 1 when at anchor, 0 once dist >= fadeBand, smooth in between
  const targetOpacity = 1 - smoothstep(0, fadeBand, dist)

  const [opacity, setOpacity] = useState(0)
  useFrame(() => {
    setOpacity((prev) => {
      const next = prev + (targetOpacity - prev) * 0.12
      return Math.abs(next - targetOpacity) < 0.005 ? targetOpacity : next
    })
  })

  // Resolve 3D position: explicit prop wins, else use the path target at this waypoint
  const basePos = screen.position || DENSE_TARGETS[anchorIdx] || [0, 10, 0]
  const off = screen.offset || [0, 0, 0]
  const position = [basePos[0] + off[0], basePos[1] + off[1], basePos[2] + off[2]]

  if (opacity <= 0.01) return null

  return (
    <Billboard position={position} follow={true}>
      <group scale={screen.scale ?? 1}>
        <Html
          transform
          center
          distanceFactor={10}
          zIndexRange={[40, 0]}
          style={{
            opacity,
            pointerEvents: opacity > 0.6 ? 'auto' : 'none',
            transition: 'opacity 60ms linear',
          }}
        >
          <div className="mc-screen">
            <div className="mc-screen__titlebar">
              <span
                className="mc-screen__icon"
                style={{ background: screen.iconColor || '#5a5a5a' }}
              >
                {screen.icon}
              </span>
              <span className="mc-screen__title">{screen.title}</span>
            </div>
            <div className="mc-screen__body">{screen.content}</div>
          </div>
        </Html>
      </group>
    </Billboard>
  )
}
