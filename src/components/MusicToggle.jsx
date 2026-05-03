import { useSyncExternalStore } from 'react'
import { musicStore } from '../state/musicStore'

const SpeakerIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

const MutedIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
)

export default function MusicToggle() {
  const { playing } = useSyncExternalStore(musicStore.subscribe, musicStore.get)

  return (
    <button
      className={`mc-toggle mc-toggle--music ${playing ? '' : 'is-off'}`}
      onClick={() => musicStore.toggle()}
      title={playing ? 'Mute music' : 'Play music'}
      type="button"
    >
      {playing ? <SpeakerIcon /> : <MutedIcon />}
    </button>
  )
}
