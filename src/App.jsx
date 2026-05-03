import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { sfx } from './state/sfxStore'
import Model from './components/Model'
import CameraPath from './components/CameraPath'
import CustomSky from './components/CustomSky'
import FallingPetals from './components/FallingPetals'
import MinecraftChat from './components/MinecraftChat'
import SceneScreens from './components/SceneScreens'
import ScreenToggle from './components/ScreenToggle'
import MusicToggle from './components/MusicToggle'
import InfoButton from './components/InfoButton'
import BusinessButton from './components/BusinessButton'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

export default function App() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest && e.target.closest('button')) sfx.click()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Block browser zoom (ctrl/cmd + wheel, ctrl/cmd + +/-/=/0, pinch on Mac)
  useEffect(() => {
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault()
    }
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (['=', '+', '-', '_', '0'].includes(e.key)) e.preventDefault()
    }
    const onGesture = (e) => e.preventDefault()
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('gesturestart', onGesture)
    window.addEventListener('gesturechange', onGesture)
    window.addEventListener('gestureend', onGesture)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('gesturestart', onGesture)
      window.removeEventListener('gesturechange', onGesture)
      window.removeEventListener('gestureend', onGesture)
    }
  }, [])

  return (
    <div className="app">
      <Canvas camera={{ position: [80, 60, 80], fov: 50, near: 0.1, far: 2500 }}>
        <fog attach="fog" args={['#d8b89c', 8, 80]} />
        <CustomSky />
        <Suspense fallback={null}>
          <Model />
          <Sparkles
            count={400}
            scale={[80, 50, 80]}
            position={[0, 15, 0]}
            size={8}
            speed={0.4}
            opacity={1}
            color="#ffeac9"
          />
          {/* Cherry blossom petals — locked positions */}
          <FallingPetals
            position={[24.5, -8.5, 7.0]}
            radius={9}
            height={39}
            color="#d45e6e"
            opacity={0.95}
            glareStrength={0.6}
            count={100}
          />
          <FallingPetals
            position={[-24.0, -24.5, 9.0]}
            radius={9}
            height={60}
            color="#d45e6e"
            opacity={0.95}
            glareStrength={1.35}
            count={300}
          />
          <SceneScreens />
        </Suspense>
        <CameraPath />
      </Canvas>
      <ScreenToggle />
      <MusicToggle />
      <InfoButton />
      <BusinessButton />
      <MinecraftChat />
      <LoadingScreen />
    </div>
  )
}
