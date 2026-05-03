import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedural pink/purple/orange sunset sky.
 * Renders on the inside of a large sphere using a custom gradient shader.
 */
export default function CustomSky() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        // Soft warm peach at horizon (subtle)
        horizonColor: { value: new THREE.Color('#e8c5a3') },
        // Muted lavender mid (very desaturated)
        midColor: { value: new THREE.Color('#9aa1c4') },
        // Soft blue-grey upper
        highColor: { value: new THREE.Color('#5a6b94') },
        // Deep dusk blue zenith
        zenithColor: { value: new THREE.Color('#2c3a5c') },
        sunDirection: { value: new THREE.Vector3(0.6, 0.05, 0.8).normalize() },
        sunColor: { value: new THREE.Color('#f5e6d3') },
      },
      vertexShader: `
        varying vec3 vWorldDir;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldDir = normalize(worldPosition.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 horizonColor;
        uniform vec3 midColor;
        uniform vec3 highColor;
        uniform vec3 zenithColor;
        uniform vec3 sunDirection;
        uniform vec3 sunColor;
        varying vec3 vWorldDir;

        void main() {
          // Vertical gradient: y goes from -1 (bottom) → 1 (top)
          float h = clamp(vWorldDir.y, -0.2, 1.0);

          // Multi-stop gradient
          vec3 color;
          if (h < 0.15) {
            // Horizon → mid
            float t = smoothstep(-0.2, 0.15, h);
            color = mix(horizonColor, midColor, t);
          } else if (h < 0.45) {
            // Mid → high
            float t = smoothstep(0.15, 0.45, h);
            color = mix(midColor, highColor, t);
          } else {
            // High → zenith
            float t = smoothstep(0.45, 1.0, h);
            color = mix(highColor, zenithColor, t);
          }

          // Sun bloom — bright glow near sun direction
          float sunDot = max(0.0, dot(vWorldDir, sunDirection));
          float sun = pow(sunDot, 16.0) * 0.6;
          float sunHalo = pow(sunDot, 4.0) * 0.3;
          color += sunColor * sun + sunColor * sunHalo;

          // Subtle cloud-like noise for atmosphere — based on direction
          float noise = sin(vWorldDir.x * 6.0) * cos(vWorldDir.z * 5.5) * 0.04;
          color += vec3(0.1, 0.05, 0.15) * noise;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  }, [])

  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[800, 64, 32]} />
    </mesh>
  )
}
