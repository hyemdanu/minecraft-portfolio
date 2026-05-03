import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { musicStore } from '../state/musicStore'

export default function LoadingScreen() {
  const { progress, active } = useProgress()
  const [closing, setClosing] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setReady(true), 250)
      return () => clearTimeout(t)
    }
  }, [active, progress])

  const join = () => {
    musicStore.play()
    setClosing(true)
    setTimeout(() => setHidden(true), 700)
  }

  if (hidden) return null

  return (
    <div className={`mc-splash ${closing ? 'is-closing' : ''}`}>
      <div className="mc-splash__inner">
        {ready ? (
          <>
            <button className="mc-splash__btn" type="button" onClick={join}>
              Join Edison's World
            </button>
            <div className="mc-splash__hints">
              <div>Best viewed on a computer or iPad</div>
              <div>Scroll down to explore</div>
            </div>
          </>
        ) : (
          <div className="mc-splash__loading">
            <div className="mc-splash__bar">
              <div
                className="mc-splash__bar-fill"
                style={{ width: `${Math.min(100, Math.round(progress))}%` }}
              />
            </div>
            <div className="mc-splash__loading-text">
              Loading world... {Math.min(100, Math.round(progress))}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
