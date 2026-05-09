import { useEffect, useRef, useState } from 'react'

// Inline SVG copies of the actual button icons so they look identical to
// what the user sees in the corner.
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
)
const QuestionIcon = () => (
  <span style={{ fontFamily: "'Minecraft', 'Silkscreen', monospace", fontSize: 22, fontWeight: 700, lineHeight: 1, textShadow: '1px 1px 0 #000' }}>?</span>
)
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)

function ButtonRow({ icon, name, desc }) {
  return (
    <div className="info-btn-row">
      <span className="info-btn-icon">{icon}</span>
      <div>
        <strong>{name}</strong>
        <div className="info-btn-desc">{desc}</div>
      </div>
    </div>
  )
}

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
              <h3 className="info-section">Top-right buttons</h3>
              <ButtonRow
                icon={<EyeIcon />}
                name="Eye"
                desc="Hide or show the floating info screens in the world."
              />
              <ButtonRow
                icon={<SpeakerIcon />}
                name="Speaker"
                desc="Mute or play the background music."
              />
              <ButtonRow
                icon={<PlayIcon />}
                name="Play"
                desc="Turn autoplay on or off"
              />
              <ButtonRow
                icon={<QuestionIcon />}
                name="Question"
                desc="Info button about this site"
              />
              <ButtonRow
                icon={<BriefcaseIcon />}
                name="Briefcase"
                desc="Resume site for easier view."
              />

              <h3 className="info-section">Chat (bottom-left)</h3>
              <p>
                Ask EdisonBot. Can not guarantee all information is accurate. Also the amount of tokens is limited per month. So if EdisonBot is tired, all of the tokens have probably been used.
              </p>

              <h3 className="info-section">Credits</h3>
              <p><strong>Font</strong> — JDGraphics</p>
              <p><strong>Music</strong> — <em>A Familiar Room</em> by Aaron Cherof</p>
              <p>
                <strong>Build time</strong> — 50–100 hour because of learning blender (Baking + UV Maps were difficult)
              </p>
                <p>
                    <strong>Inspiration</strong> — This site was inspired by Andrew Woan's 3D Minecraft Folio.
                </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
