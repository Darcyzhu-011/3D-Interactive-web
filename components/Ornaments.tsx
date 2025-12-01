import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { generateDualPositions } from '../utils/geometry';
import { CONFIG, COLORS } from '../constants';
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

  // Generate Color Data Declaratively
  const colorArray = useMemo(() => {
    const array = new Float32Array(count * 3);
    const tempColor = new THREE.Color();
    const hsl = { h: 0, s: 0, l: 0 };
    
    for (let i = 0; i < count; i++) {
        // Variation in gold and red
        if (Math.random() > 0.6) {
             tempColor.set(COLORS.GOLD_METALLIC);
        } else {
             tempColor.set(COLORS.RED_LUXURY);
        }
        
        // Add slight brightness variation
        tempColor.getHSL(hsl);
        // Vary lightness slightly
        tempColor.setHSL(hsl.h, hsl.s, hsl.l + (Math.random() - 0.5) * 0.1);
        
        tempColor.toArray(array, i * 3);
    }
    return array;
  }, [count]);

  // Temporary Object3D for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Track current interpolation state locally
  const lerpRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Update Lerp Factor
    const target = isTree ? 1 : 0;
    const speed = CONFIG.ANIMATION_SPEED * delta;
    lerpRef.current = THREE.MathUtils.lerp(lerpRef.current, target, speed);
    const t = lerpRef.current;
    
    // Ease the t factor
    const smoothT = t * t * (3 - 2 * t); 

    const time = state.clock.elapsedTime;

    // 2. Update each instance
    for (let i = 0; i < count; i++) {
      const data = instances[i];

      // Calculate Position
      dummy.position.lerpVectors(data.scatterPos, data.treePos, smoothT);
      
      // Add floating noise when scattered
      if (t < 0.95) {
        const floatIntensity = (1.0 - t) * 0.5;
        dummy.position.y += Math.sin(time + data.phaseOffset) * floatIntensity * 0.05;
        dummy.position.x += Math.cos(time * 0.5 + data.phaseOffset) * floatIntensity * 0.05;
      }

      // Calculate Rotation
      dummy.rotation.copy(data.rotation);
      dummy.rotation.x += data.rotationSpeed.x * (2 - t); 
      dummy.rotation.y += data.rotationSpeed.y * (2 - t); 
      dummy.rotation.z += data.rotationSpeed.z * (2 - t);
      // Save updated rotation
      data.rotation.copy(dummy.rotation);
      
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
      frustumCulled={false}
    >
      {type === 'SPHERE' ? (
        <sphereGeometry args={[0.2, 16, 16]} />
      ) : (
        <boxGeometry args={[0.3, 0.3, 0.3]} />
      )}
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
      <meshStandardMaterial
        color={COLORS.WHITE_WARM} // Base color, used if instanceColor fails
        roughness={0.15}
        metalness={0.9}
        envMapIntensity={1.5}
      />
    </instancedMesh>
  );
};

export default Ornaments;