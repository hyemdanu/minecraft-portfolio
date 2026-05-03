import { useSyncExternalStore } from 'react'
import { autoplayStore } from '../state/autoplayStore'

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M7 5l12 7-12 7z" />
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <rect x="6" y="5" width="4" height="14" />
    <rect x="14" y="5" width="4" height="14" />
  </svg>
)

export default function AutoplayToggle() {
  const { autoplayOn } = useSyncExternalStore(autoplayStore.subscribe, autoplayStore.get)
  return (
    <button
      className={`mc-toggle mc-toggle--autoplay ${autoplayOn ? '' : 'is-off'}`}
      onClick={() => autoplayStore.toggle()}
      title={autoplayOn ? 'Pause autoplay' : 'Autoplay'}
      type="button"
    >
      {autoplayOn ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}
