import { Billboard, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { SCREENS } from '../data/screens'
import { cameraStore, TOTAL_WAYPOINTS } from '../state/cameraStore'
import { uiStore } from '../state/uiStore'
import { autoplayStore, autoplayDwell } from '../state/autoplayStore'
import { pathSamples } from '../state/pathSamples'

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

  const targetOpacity = 1 - smoothstep(0, fadeBand, dist)
  const [opacity, setOpacity] = useState(0)
  const bodyRef = useRef(null)
  const cleanupRef = useRef(null)
  const { pausedAtScreen } = useSyncExternalStore(autoplayStore.subscribe, autoplayStore.get)
  const isFocusedByAutoplay = pausedAtScreen === screen.id

  // Callback ref — fires every time the element attaches OR detaches
  // (which happens when the screen fades in/out and the JSX returns null).
  const setBodyRef = useCallback((el) => {
    // Tear down previous listeners
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    bodyRef.current = el
    if (!el) return

    let lastY = null
    const onTouchStart = (e) => {
      if (e.touches[0]) lastY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (lastY === null || !e.touches[0]) return
      const y = e.touches[0].clientY
      el.scrollTop -= (y - lastY)
      lastY = y
      e.stopPropagation()
      e.preventDefault()  // blocks browser pull-to-refresh + native overscroll
    }
    const onTouchEnd = () => { lastY = null }
    const onWheel = (e) => e.stopPropagation()

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })

    cleanupRef.current = () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  useFrame(() => {
    setOpacity((prev) => {
      const next = prev + (targetOpacity - prev) * 0.12
      return Math.abs(next - targetOpacity) < 0.005 ? targetOpacity : next
    })
  })


  // Auto-scroll body during autoplay dwell at a constant pixels-per-second
  // rate (uniform reading speed regardless of content length). Camera dwell
  // is extended to match.
  useEffect(() => {
    if (!isFocusedByAutoplay) return
    const el = bodyRef.current
    if (!el) return
    el.scrollTop = 0

    const SCROLL_SPEED = 20              // px/sec — slow, comfortable reading pace
    const READ_BUFFER = 1.5               // sec held at top before scrolling starts (and at bottom after)
    const overflow = el.scrollHeight - el.clientHeight
    const scrollDuration = Math.max(0, overflow / SCROLL_SPEED)
    const totalDwell = READ_BUFFER + scrollDuration + READ_BUFFER

    // Tell the camera to wait this long
    autoplayDwell.remaining = Math.max(autoplayDwell.remaining, totalDwell)

    if (overflow <= 4) return  // nothing to scroll, just dwell

    const startTime = performance.now() + READ_BUFFER * 1000
    const tick = () => {
      const elapsed = (performance.now() - startTime) / 1000
      const t = Math.max(0, Math.min(1, elapsed / scrollDuration))
      if (bodyRef.current === el) el.scrollTop = overflow * t
      if (t < 1 && bodyRef.current === el) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isFocusedByAutoplay])

  // Resolve 3D position: explicit prop wins, else use the path target at this waypoint
  const basePos = screen.position || pathSamples.targets[anchorIdx] || [0, 10, 0]
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
            <div className="mc-screen__body" ref={setBodyRef}>{screen.content}</div>
          </div>
        </Html>
      </group>
    </Billboard>
  )
}
