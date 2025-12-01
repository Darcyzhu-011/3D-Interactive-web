import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CONFIG, COLORS } from '../constants';
import { getRandomConePoint, getRandomSpherePoint } from '../utils/geometry';

interface FoliageProps {
  isTree: boolean;
}

const vertexShader = `
  uniform float uTime;
  uniform float uMixFactor; // 0.0 = Scattered, 1.0 = Tree
  
  attribute vec3 aTreePos;
  attribute vec3 aScatterPos;
  attribute float aSize;
  attribute float aPhase;
  
  varying float vAlpha;
  
  // Cubic Bezier ease-in-out approximation
  float easeInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    float t = easeInOut(uMixFactor);
    
    // Interpolate position
    vec3 pos = mix(aScatterPos, aTreePos, t);
    
    // Add some floating noise when scattered
    if (uMixFactor < 0.99) {
      float noiseFreq = 0.5;
      float noiseAmp = 0.5 * (1.0 - t); // Less noise when formed
      pos.x += sin(uTime * noiseFreq + aPhase) * noiseAmp;
      pos.y += cos(uTime * noiseFreq + aPhase * 0.5) * noiseAmp;
      pos.z += sin(uTime * noiseFreq * 0.8 + aPhase) * noiseAmp;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    
    // Twinkle effect
    vAlpha = 0.6 + 0.4 * sin(uTime * 2.0 + aPhase);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  uniform vec3 uColorCore;
  uniform vec3 uColorRim;

  void main() {
    // Circular particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    
    // Radial gradient: Green core, Gold rim
    float gradient = smoothstep(0.0, 0.5, dist);
    vec3 finalColor = mix(uColorCore, uColorRim, gradient * gradient); // Bias towards core color
    
    // Soft edge
    float alpha = (1.0 - smoothstep(0.4, 0.5, dist)) * vAlpha;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const Foliage: React.FC<FoliageProps> = ({ isTree }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  // Generate data once
  const { positions, treePositions, scatterPositions, sizes, phases } = useMemo(() => {
    const count = CONFIG.FOLIAGE_COUNT;
    const treePositions = new Float32Array(count * 3);
    const scatterPositions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const positions = new Float32Array(count * 3); // Initial positions (buffer)

    for (let i = 0; i < count; i++) {
      const tPos = getRandomConePoint(CONFIG.TREE_HEIGHT, CONFIG.TREE_RADIUS_BASE);
      const sPos = getRandomSpherePoint(CONFIG.SCATTER_RADIUS);

      treePositions[i * 3] = tPos.x;
      treePositions[i * 3 + 1] = tPos.y;
      treePositions[i * 3 + 2] = tPos.z;

      scatterPositions[i * 3] = sPos.x;
      scatterPositions[i * 3 + 1] = sPos.y;
      scatterPositions[i * 3 + 2] = sPos.z;

      // Randomly assign varying sizes
      sizes[i] = Math.random() < 0.1 ? 0.3 : 0.15; // Occasional large sparkle
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, treePositions, scatterPositions, sizes, phases };
  }, []);

  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smoothly interpolate mix factor
      const targetMix = isTree ? 1.0 : 0.0;
      const currentMix = shaderRef.current.uniforms.uMixFactor.value;
      
      // Lerp logic
      const speed = CONFIG.ANIMATION_SPEED * delta;
      shaderRef.current.uniforms.uMixFactor.value = THREE.MathUtils.lerp(currentMix, targetMix, speed);
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMixFactor: { value: 0 }, // Start scattered
    uColorCore: { value: new THREE.Color(COLORS.EMERALD_LIGHT) },
    uColorRim: { value: new THREE.Color(COLORS.GOLD_METALLIC) },
  }), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions} // Technically unused by shader but needed for bounding box
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTreePos"
          count={treePositions.length / 3}
          array={treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScatterPos"
          count={scatterPositions.length / 3}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={phases.length}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Foliage;
