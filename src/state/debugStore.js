// Tiny store for runtime debug messages — visible on-screen so we can debug
// mobile loading without remote dev tools. Enable with `?debug` in URL.
let snapshot = { lines: [] }
const listeners = new Set()

function nowStamp() {
  return new Date().toISOString().slice(11, 23)
}

export const debugStore = {
  get: () => snapshot,
  log: (msg) => {
    const line = `${nowStamp()} ${msg}`
    snapshot = { lines: [...snapshot.lines, line].slice(-60) }
    listeners.forEach((l) => l())
    // eslint-disable-next-line no-console
    console.log('[debug]', msg)
  },
  err: (msg) => {
    const line = `${nowStamp()} ❌ ${msg}`
    snapshot = { lines: [...snapshot.lines, line].slice(-60) }
    listeners.forEach((l) => l())
    // eslint-disable-next-line no-console
    console.error('[debug]', msg)
  },
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}
