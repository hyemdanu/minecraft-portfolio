import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { sfx } from './state/sfxStore'
import { useIsMobile } from './hooks/useIsMobile'
import { debugStore } from './state/debugStore'
import DebugProbes from './components/DebugProbes'
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
import DebugOverlay from './components/DebugOverlay'
import './App.css'

export default function App() {
  const isMobile = useIsMobile()

  useEffect(() => {
    debugStore.log(`App mounted (mobile=${isMobile})`)
    // Visibility/freeze tracking
    const onVis = () => debugStore.log(`visibility: ${document.visibilityState}`)
    const onFreeze = () => debugStore.log(`page frozen by browser`)
    document.addEventListener('visibilitychange', onVis)
    document.addEventListener('freeze', onFreeze)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      document.removeEventListener('freeze', onFreeze)
    }
  }, [isMobile])

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
      <Canvas
        camera={{ position: [80, 60, 80], fov: 50, near: 0.1, far: 2500 }}
        dpr={isMobile ? 0.6 : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        onCreated={() => debugStore.log('canvas onCreated')}
      >
        {!isMobile && <fog attach="fog" args={['#d8b89c', 8, 80]} />}
        {!isMobile && <CustomSky />}
        {isMobile && <color attach="background" args={['#9aa1c4']} />}
        <Suspense fallback={null}>
          <Model />
          {!isMobile && (
            <>
              <Sparkles
                count={400}
                scale={[80, 50, 80]}
                position={[0, 15, 0]}
                size={8}
                speed={0.4}
                opacity={1}
                color="#ffeac9"
              />
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
            </>
          )}
          <SceneScreens />
        </Suspense>
        <CameraPath />
        <DebugProbes />
      </Canvas>
      <ScreenToggle />
      <MusicToggle />
      <InfoButton />
      <BusinessButton />
      <MinecraftChat />
      <LoadingScreen />
      <DebugOverlay />
    </div>
  )
}
