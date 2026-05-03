import { useEffect, useState } from 'react'
import { autoplayActivity } from '../state/autoplayStore'

const HIDE_AFTER_MS = 1200   // hide once it's been this long since last reverse motion

export default function ReverseIndicator() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      const recent = performance.now() - autoplayActivity.lastReverseMs < HIDE_AFTER_MS
      setVisible((prev) => (prev !== recent ? recent : prev))
    }, 200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={`reverse-indicator ${visible ? 'is-visible' : ''}`}>
      ↑ scrolling back
    </div>
  )
}
