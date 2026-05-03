import { useSyncExternalStore, useState, useEffect } from 'react'
import { debugStore } from '../state/debugStore'

// Visible on-screen debug log. Enable with ?debug in URL.
// Tap the overlay to expand/collapse.
export default function DebugOverlay() {
  const enabled =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('debug')
  const [open, setOpen] = useState(true)
  const { lines } = useSyncExternalStore(debugStore.subscribe, debugStore.get)

  // Capture global errors and unhandled promise rejections
  useEffect(() => {
    if (!enabled) return
    const onErr = (e) => {
      const msg = e?.message || String(e)
      const file = e?.filename ? ` @ ${e.filename.split('/').pop()}:${e.lineno}` : ''
      debugStore.err(`window: ${msg}${file}`)
    }
    const onRej = (e) => {
      const msg = e?.reason?.message || String(e?.reason)
      debugStore.err(`promise: ${msg}`)
    }
    window.addEventListener('error', onErr)
    window.addEventListener('unhandledrejection', onRej)

    // Initial environment dump
    try {
      const dpr = window.devicePixelRatio || 1
      const mem = navigator.deviceMemory || '?'
      const cores = navigator.hardwareConcurrency || '?'
      const ua = navigator.userAgent.slice(0, 80)
      debugStore.log(`viewport: ${window.innerWidth}x${window.innerHeight} dpr=${dpr}`)
      debugStore.log(`device: mem=${mem}GB cores=${cores}`)
      debugStore.log(`UA: ${ua}`)
      // WebGL info
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') || c.getContext('webgl')
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info')
        const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '?'
        debugStore.log(`gpu: ${String(renderer).slice(0, 60)}`)
      } else {
        debugStore.err(`no WebGL context available`)
      }
    } catch (e) {
      debugStore.err(`env probe failed: ${e.message}`)
    }

    return () => {
      window.removeEventListener('error', onErr)
      window.removeEventListener('unhandledrejection', onRej)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: 10,
        background: 'rgba(0,0,0,0.9)',
        color: '#7ec850',
        padding: open ? '8px 10px' : '4px 8px',
        maxWidth: open ? '92vw' : '120px',
        maxHeight: open ? '50vh' : '20px',
        overflow: 'auto',
        border: '1px solid #444',
        borderRadius: 4,
        lineHeight: 1.4,
      }}
      onClick={() => setOpen((o) => !o)}
    >
      {open ? (
        <>
          <div style={{ color: '#ffd700', marginBottom: 4 }}>
            DEBUG ({lines.length}) — tap to collapse
          </div>
          {lines.map((l, i) => (
            <div key={i} style={{ color: l.includes('❌') ? '#ff8080' : '#7ec850' }}>
              {l}
            </div>
          ))}
          {lines.length === 0 && <div style={{ color: '#888' }}>no logs yet</div>}
        </>
      ) : (
        <span>DEBUG ({lines.length})</span>
      )}
    </div>
  )
}
