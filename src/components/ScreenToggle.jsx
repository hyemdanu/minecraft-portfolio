import { useSyncExternalStore } from 'react'
import { uiStore } from '../state/uiStore'
import { sfx } from '../state/sfxStore'

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosed = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.5 19.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-3.17 4.19" />
    <path d="M9.5 9.5a3 3 0 0 0 4.95 3.45" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
)

export default function ScreenToggle() {
  const { screensHidden } = useSyncExternalStore(uiStore.subscribe, uiStore.get)

  return (
    <button
      className={`mc-toggle ${screensHidden ? 'is-off' : ''}`}
      onClick={() => {
        sfx.click()
        uiStore.toggleScreens()
      }}
      title={screensHidden ? 'Show screens' : 'Hide screens'}
      type="button"
    >
      {screensHidden ? <EyeClosed /> : <EyeOpen />}
    </button>
  )
}
