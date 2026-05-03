import musicSrc from '../assets/familiar_room.mp3'

const VOLUME = 0.4

let audio = null
let snapshot = { playing: false }
const listeners = new Set()

function notify() {
  snapshot = { ...snapshot }
  listeners.forEach((l) => l())
}

function getAudio() {
  if (!audio) {
    audio = new Audio(musicSrc)
    audio.loop = true
    audio.volume = VOLUME
    audio.preload = 'auto'
    audio.addEventListener('pause', () => {
      snapshot = { playing: false }
      listeners.forEach((l) => l())
    })
    audio.addEventListener('play', () => {
      snapshot = { playing: true }
      listeners.forEach((l) => l())
    })
  }
  return audio
}

export const musicStore = {
  get: () => snapshot,
  subscribe: (l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  play: () => {
    return getAudio()
      .play()
      .catch((err) => console.error('Music play failed', err))
  },
  pause: () => {
    if (audio) audio.pause()
  },
  toggle: () => {
    if (snapshot.playing) musicStore.pause()
    else musicStore.play()
  },
}
