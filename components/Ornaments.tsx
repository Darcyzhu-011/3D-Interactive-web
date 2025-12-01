import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { generateDualPositions } from '../utils/geometry';
import { CONFIG, GOLD_MATERIAL, RED_MATERIAL, COLORS } from '../constants';
import { DualPosition } from '../types';

interface OrnamentGroupProps {
  isTree: boolean;
  type: 'SPHERE' | 'BOX';
}

const Ornaments: React.FC<OrnamentGroupProps> = ({ isTree, type }) => {
  const count = type === 'SPHERE' ? CONFIG.ORNAMENT_SPHERE_COUNT : CONFIG.ORNAMENT_BOX_COUNT;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Data generation
  const instances = useMemo<DualPosition[]>(() => generateDualPositions(count), [count]);

  // Temporary Object3D for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Track current interpolation state locally to avoid heavy React rerenders
  const lerpRef = useRef(0);

  // Set colors for instances once
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const tempColor = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
        // Variation in gold and red
        if (Math.random() > 0.6) {
             tempColor.set(COLORS.GOLD_METALLIC);
        } else {
             tempColor.set(COLORS.RED_LUXURY);
        }
        // Add slight brightness variation
        tempColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
        meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [count]);


  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Update Lerp Factor
    const target = isTree ? 1 : 0;
    const speed = CONFIG.ANIMATION_SPEED * delta;
    lerpRef.current = THREE.MathUtils.lerp(lerpRef.current, target, speed);
    const t = lerpRef.current;
    
    // Ease the t factor for position to make it snappy then smooth
    // Using a smoothstep-like curve for position
    const smoothT = t * t * (3 - 2 * t); 

    const time = state.clock.elapsedTime;

    // 2. Update each instance
    for (let i = 0; i < count; i++) {
      const data = instances[i];

      // Calculate Position
      dummy.position.lerpVectors(data.scatterPos, data.treePos, smoothT);
      
      // Add floating noise when scattered (inverse of t)
      if (t < 0.95) {
        const floatIntensity = (1.0 - t) * 0.5;
        dummy.position.y += Math.sin(time + data.phaseOffset) * floatIntensity * 0.05;
        dummy.position.x += Math.cos(time * 0.5 + data.phaseOffset) * floatIntensity * 0.05;
      }

      // Calculate Rotation
      // Spin faster when scattered, stabilize when in tree
      dummy.rotation.copy(data.rotation);
      dummy.rotation.x += data.rotationSpeed.x * (2 - t); 
      dummy.rotation.y += data.rotationSpeed.y * (2 - t); 
      dummy.rotation.z += data.rotationSpeed.z * (2 - t);
      // Save updated rotation back to state for continuity
      data.rotation.copy(dummy.rotation);
      
      // Orient towards camera or up?
      // For chaos, random is fine. For tree, maybe align slightly? 
      // Keeping random rotation looks more natural for ornaments.

      // Scale
      dummy.scale.setScalar(data.scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      {type === 'SPHERE' ? (
        <sphereGeometry args={[0.2, 16, 16]} />
      ) : (
        <boxGeometry args={[0.3, 0.3, 0.3]} />
      )}
      {/* 
        We use a standard material here, but we could use MeshPhysicalMaterial 
        for better glass/metal effects. 
      */}
      <meshStandardMaterial
        color={COLORS.WHITE_WARM} // Base color, overridden by instanceColor
        roughness={0.15}
        metalness={0.9}
        envMapIntensity={1.5}
      />
    </instancedMesh>
  );
};

export default Ornaments;
