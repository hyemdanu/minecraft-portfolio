// Tracks the camera's nearest waypoint along the path so non-Canvas
// components can react. snapshot must be a NEW reference each set()
// so useSyncExternalStore re-renders.
export const TOTAL_WAYPOINTS = 120

let snapshot = { waypointIndex: 0 }
const listeners = new Set()

export const cameraStore = {
  get: () => snapshot,
  set: (patch) => {
    snapshot = { ...snapshot, ...patch }
    listeners.forEach((l) => l())
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}
