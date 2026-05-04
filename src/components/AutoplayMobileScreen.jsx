import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { autoplayStore, autoplayDwell } from '../state/autoplayStore'
import { SCREENS } from '../data/screens'

// During autoplay on mobile, the 3D screen can be tiny / off-center on portrait
// phones. This overlays a centered, readable 2D copy on top, with the same
// auto-scroll behavior. Hidden on desktop (3D version is fine there).
export default function AutoplayMobileScreen() {
  const isMobile = useIsMobile()
  const { pausedAtScreen } = useSyncExternalStore(autoplayStore.subscribe, autoplayStore.get)
  const cleanupRef = useRef(null)

  const setBodyRef = useCallback((el) => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    if (!el) return

    // Auto-scroll at constant speed (same as the 3D screen logic)
    el.scrollTop = 0
    const SCROLL_SPEED = 50
    const READ_BUFFER = 1.5
    const overflow = el.scrollHeight - el.clientHeight
    const scrollDuration = Math.max(0, overflow / SCROLL_SPEED)
    autoplayDwell.remaining = Math.max(autoplayDwell.remaining, READ_BUFFER + scrollDuration + READ_BUFFER)

    let raf = 0
    if (overflow > 4) {
      const startTime = performance.now() + READ_BUFFER * 1000
      const tick = () => {
        const elapsed = (performance.now() - startTime) / 1000
        const t = Math.max(0, Math.min(1, elapsed / scrollDuration))
        el.scrollTop = overflow * t
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    // Manual touch scrolling + block pull-to-refresh
    let lastY = null
    const onTouchStart = (e) => { if (e.touches[0]) lastY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (lastY === null || !e.touches[0]) return
      const y = e.touches[0].clientY
      el.scrollTop -= (y - lastY)
      lastY = y
      e.stopPropagation()
      e.preventDefault()
    }
    const onTouchEnd = () => { lastY = null }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    cleanupRef.current = () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])

  if (!isMobile || !pausedAtScreen) return null
  const screen = SCREENS.find((s) => s.id === pausedAtScreen)
  if (!screen) return null

  return (
    <div className="autoplay-mobile-backdrop">
      <div className="autoplay-mobile-screen mc-screen">
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
    </div>
  )
}
