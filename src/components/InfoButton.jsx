import { useEffect, useRef, useState } from 'react'

export default function InfoButton() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  // Stop wheel inside the popup from moving the camera
  useEffect(() => {
    if (!open) return
    const el = panelRef.current
    if (!el) return
    const stop = (e) => e.stopPropagation()
    el.addEventListener('wheel', stop, { passive: false })
    return () => el.removeEventListener('wheel', stop)
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        className="mc-toggle mc-toggle--info"
        onClick={() => setOpen(true)}
        title="About this site"
        type="button"
      >
        <span className="mc-info-q">?</span>
      </button>

      {open && (
        <div
          className="mc-popup-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="mc-popup" ref={panelRef}>
            <div className="mc-popup__titlebar">
              <span className="mc-popup__title">About this site</span>
              <button
                className="mc-popup__close"
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="mc-popup__body">
              <p>
                <strong>Font</strong> — JDGraphics
              </p>
              <p>
                <strong>Music</strong> — <em>A Familiar Room</em> by Aaron Cherof
              </p>
              <p>
                <strong>Build time</strong> — 50–100 hours, mostly spent learning
                Blender (baking + UV maps were the worst part).
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
