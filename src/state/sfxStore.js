import clickSrc from '../assets/click.mp3'

const VOLUME = 0.6

let ctx = null
let buffer = null
let loadPromise = null

function getContext() {
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  return ctx
}

function preload() {
  if (loadPromise) return loadPromise
  loadPromise = fetch(clickSrc)
    .then((r) => r.arrayBuffer())
    .then((ab) => {
      const c = getContext()
      if (!c) return null
      return c.decodeAudioData(ab)
    })
    .then((buf) => {
      buffer = buf
    })
    .catch((err) => console.error('SFX preload failed', err))
  return loadPromise
}

// Kick off the fetch + decode immediately at module load
preload()

export const sfx = {
  click: () => {
    const c = getContext()
    if (!c || !buffer) return
    if (c.state === 'suspended') c.resume()
    const src = c.createBufferSource()
    src.buffer = buffer
    const gain = c.createGain()
    gain.gain.value = VOLUME
    src.connect(gain).connect(c.destination)
    src.start(0)
  },
}
