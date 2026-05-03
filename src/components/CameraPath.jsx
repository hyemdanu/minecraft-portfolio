import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cameraStore, TOTAL_WAYPOINTS } from '../state/cameraStore'
import { autoplayStore, autoplayDwell, autoplayActivity } from '../state/autoplayStore'
import { pathSamples } from '../state/pathSamples'
import { SCREENS } from '../data/screens'

const WAYPOINTS = [
  { position: [20.07, 9.81, -19.98],   target: [-4.35, 3.14, -14.93] },
  { position: [18.5, 9.55, -18.05],    target: [2.84, 17.96, 7.49] },
  { position: [18.5, 9.55, -18.05],    target: [18.69, 13.04, 11.75] },
  { position: [18.7, 9.93, -15.84],    target: [19.74, 18.07, 13.02] },
  { position: [18.78, 11.29, -12.21],  target: [18.68, 25.79, 14.05] },
  { position: [18.81, 12.09, -10.38],  target: [19.17, 28.07, 15.01] },
  { position: [18.83, 13.51, -7.73],   target: [19.31, 30.71, 16.84] },
  { position: [18.87, 14.83, -5.9],    target: [17.46, 24.95, 22.31] },
  { position: [18.56, 15.62, -3.41],   target: [13.03, 22.86, 25.17] },
  { position: [17.23, 16.55, -1.51],   target: [19.57, 19.32, 28.27] },
  { position: [14.18, 16.55, -0.84],   target: [35.89, 19.78, 19.61] },
  { position: [12.38, 16.55, 1.72],    target: [40.03, 26.38, 7.96] },
  { position: [10.92, 16.37, 1.45],    target: [39.2, 24.74, 6.96] },
  { position: [10.92, 16.37, 1.45],    target: [16.94, 9.65, 30.06] },
  { position: [10.92, 16.37, 1.45],    target: [-14.42, 2.43, 9.42] },
  { position: [8.8, 15.3, 1.52],       target: [-17.98, 1.79, 2.15] },
  { position: [5.19, 14.3, 1.31],      target: [-23.69, 6.37, -0.37] },
  { position: [3.22, 14.64, 1.46],     target: [-25.32, 15.79, -7.71] },
  { position: [-0.31, 14.95, -0.39],   target: [-22.68, 15.11, -20.38] },
  { position: [-2.74, 15.05, -2.14],   target: [-26.58, 17.93, -20.12] },
  { position: [-6.52, 15.51, -4.99],   target: [-30.39, 16.12, 13.17] },
  { position: [-9.74, 15.99, -5.86],   target: [-8.47, 12.39, 23.9] },
  { position: [-13.37, 15.99, -9.97],  target: [-28.69, 21.88, 15.14] },
  { position: [-20.01, 16.96, -11.41], target: [-28.62, 29.81, 14.29] },
  { position: [-22.09, 17.16, -6.34],  target: [-30.79, 34.76, 16.34] },
  { position: [-26.08, 17.29, 2.96],   target: [-26.38, 13.31, 32.69] },
  { position: [-24.59, 16.75, 12.38],  target: [4.9, 11.66, 10.27] },
  { position: [-19.23, 16.03, 14.3],   target: [9.6, 16.29, 22.61] },
  { position: [-12.89, 15.51, 16.5],   target: [5.23, 7.98, 39.19] },
  { position: [-7.82, 15.51, 15.06],   target: [-10.6, 8.28, 44.04] },
  { position: [-3.42, 14.58, 12.09],   target: [21.07, 9.4, -4.45] },
  { position: [2.31, 14.45, 6.36],     target: [5.62, 9.9, -23.11] },
  { position: [2.94, 12.5, -3.64],     target: [2.94, 0.99, -31.34] },
  { position: [3.04, 9.07, -9.57],     target: [1.77, -5.74, -35.63] },
  { position: [3.39, 7.25, -14.79],    target: [10.46, 6.88, -43.94] },
  { position: [5.32, 7.69, -19.78],    target: [18.29, 9.53, -46.77] },
  { position: [10.26, 9.32, -23.96],   target: [39.51, 14.49, -28.16] },
  { position: [14.46, 9.3, -23.33],    target: [44.12, 9.14, -18.82] },
  { position: [17.77, 9.11, -21.6],    target: [39.51, 3.21, -1.78] },
  { position: [19.79, 8.76, -20.51],   target: [17.23, 6.51, 9.3] },
]

export default function CameraPath() {
  const { camera } = useThree()

  const { posCurve, targetCurve } = useMemo(() => {
    const positions = WAYPOINTS.map((w) => new THREE.Vector3(...w.position))
    const targets = WAYPOINTS.map((w) => new THREE.Vector3(...w.target))
    const pc = new THREE.CatmullRomCurve3(positions, true, 'catmullrom', 0.5)
    const tc = new THREE.CatmullRomCurve3(targets, true, 'catmullrom', 0.5)

    // Sample 120 evenly-spaced look-at targets along the curve so screens
    // can anchor themselves to "where the camera is looking" at each waypoint.
    const samples = []
    for (let i = 0; i < TOTAL_WAYPOINTS; i++) {
      samples.push(tc.getPointAt(i / TOTAL_WAYPOINTS).toArray())
    }
    pathSamples.targets = samples

    return { posCurve: pc, targetCurve: tc }
  }, [])

  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const lookAtVec = useRef(new THREE.Vector3())
  const lastWaypointIdx = useRef(-1)
  const wheelAccum = useRef(0)
  const lastTargetProgress = useRef(0)
  const dwellingAt = useRef(null)

  useEffect(() => {
    // ~one mouse wheel "click" of deltaY accumulates to STEP and advances one waypoint
    const STEP = 100
    const TOUCH_SCALE = 2.2  // amplify swipe distance to feel natural

    const insideUI = (target) =>
      target?.closest && target.closest('.mc-screen, .mc-chat, .mc-popup, .mc-toggle, .biz-page, .mc-splash')

    const advance = () => {
      let moved = false
      while (Math.abs(wheelAccum.current) >= STEP) {
        const dir = Math.sign(wheelAccum.current)
        targetProgress.current += dir * (1 / TOTAL_WAYPOINTS)
        targetProgress.current = ((targetProgress.current % 1) + 1) % 1
        wheelAccum.current -= dir * STEP
        moved = true
      }
      // Any user-driven advance cancels autoplay
      if (moved && autoplayStore.get().autoplayOn) {
        autoplayStore.set({ autoplayOn: false, pausedAtScreen: null })
      }
    }

    const onWheel = (e) => {
      if (insideUI(e.target)) return
      wheelAccum.current += e.deltaY
      advance()
    }

    let lastTouchY = null
    const onTouchStart = (e) => {
      if (insideUI(e.target)) { lastTouchY = null; return }
      if (e.touches.length === 1) lastTouchY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (lastTouchY === null || e.touches.length !== 1) return
      const y = e.touches[0].clientY
      wheelAccum.current += (lastTouchY - y) * TOUCH_SCALE  // swipe up = forward
      lastTouchY = y
      advance()
    }
    const onTouchEnd = () => { lastTouchY = null }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])

  useFrame((_, delta) => {
    const auto = autoplayStore.get()

    // ---------- autoplay advance ----------
    if (auto.autoplayOn) {
      // Are we at (or close to) a screen anchor? Pause to read.
      // SceneScreen extends autoplayDwell.remaining so scroll has time to finish.
      if (autoplayDwell.remaining > 0) {
        autoplayDwell.remaining -= delta
        if (autoplayDwell.remaining <= 0) {
          autoplayDwell.remaining = 0
          // resume — nudge past the screen so we don't immediately re-trigger
          targetProgress.current += 2 / TOTAL_WAYPOINTS
          targetProgress.current = ((targetProgress.current % 1) + 1) % 1
          dwellingAt.current = null
          autoplayStore.set({ pausedAtScreen: null })
        }
      } else {
        // Constant forward speed — full loop in ~75 seconds
        targetProgress.current += delta * (1 / 75)
        targetProgress.current = ((targetProgress.current % 1) + 1) % 1

        // Check if we just reached a screen anchor
        const nearestIdxNow = Math.round(targetProgress.current * TOTAL_WAYPOINTS) % TOTAL_WAYPOINTS
        const screenHere = SCREENS.find((s) => {
          const a = (s.anchorWaypoint - 1 + TOTAL_WAYPOINTS) % TOTAL_WAYPOINTS
          return a === nearestIdxNow
        })
        if (screenHere && dwellingAt.current !== screenHere.id) {
          dwellingAt.current = screenHere.id
          // Initial small dwell. SceneScreen will extend this if it needs
          // time to scroll its body content.
          autoplayDwell.remaining = 1.5
          autoplayStore.set({ pausedAtScreen: screenHere.id })
        }
      }
    } else {
      autoplayDwell.remaining = 0
      dwellingAt.current = null
    }

    // ---------- direction (forward / reverse) ----------
    let dProg = targetProgress.current - lastTargetProgress.current
    if (dProg > 0.5) dProg -= 1
    if (dProg < -0.5) dProg += 1
    if (Math.abs(dProg) > 0.0001) {
      const newDir = dProg > 0 ? 1 : -1
      if (newDir !== auto.direction) autoplayStore.set({ direction: newDir })
      if (newDir === -1) autoplayActivity.lastReverseMs = performance.now()
    }
    lastTargetProgress.current = targetProgress.current

    // ---------- smooth camera follow ----------
    let diff = targetProgress.current - currentProgress.current
    if (diff > 0.5) diff -= 1
    if (diff < -0.5) diff += 1
    currentProgress.current += diff * Math.min(delta * 4, 1)
    currentProgress.current = ((currentProgress.current % 1) + 1) % 1

    const t = currentProgress.current
    posCurve.getPointAt(t, camera.position)
    targetCurve.getPointAt(t, lookAtVec.current)
    camera.lookAt(lookAtVec.current)

    // Nearest dense waypoint — only push to store when it changes (no time throttle needed)
    const nearestIdx = Math.round(t * TOTAL_WAYPOINTS) % TOTAL_WAYPOINTS
    if (nearestIdx !== lastWaypointIdx.current) {
      lastWaypointIdx.current = nearestIdx
      cameraStore.set({ waypointIndex: nearestIdx })
    }
  })

  return null
}
