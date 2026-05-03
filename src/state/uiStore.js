// UI visibility flags shared between top-right toggles and the scene.
let snapshot = { screensHidden: false }
const listeners = new Set()

export const uiStore = {
  get: () => snapshot,
  toggleScreens: () => {
    snapshot = { ...snapshot, screensHidden: !snapshot.screensHidden }
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}
