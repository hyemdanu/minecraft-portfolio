// Autoplay state — whether the camera is auto-advancing the path,
// and which direction the user (or autoplay) last moved.
let snapshot = {
  autoplayOn: false,
  direction: 1,           // 1 = forward, -1 = reverse
  pausedAtScreen: null,   // screen id when pausing for content
}

const listeners = new Set()

// Mutable per-frame state shared between CameraPath (writes/decrements) and
// SceneScreens (extends so scroll has time to finish). Not reactive — we
// don't want a re-render every frame.
export const autoplayDwell = { remaining: 0 }

// Timestamp of the last frame where the user/autoplay moved BACKWARD.
// Polled by ReverseIndicator — non-reactive to avoid per-frame re-renders.
export const autoplayActivity = { lastReverseMs: 0 }

export const autoplayStore = {
  get: () => snapshot,
  set: (patch) => {
    snapshot = { ...snapshot, ...patch }
    listeners.forEach((l) => l())
  },
  toggle: () => {
    snapshot = { ...snapshot, autoplayOn: !snapshot.autoplayOn, pausedAtScreen: null }
    autoplayDwell.remaining = 0
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}
