import React, { useRef } from 'react';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Float, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import { COLORS, CONFIG } from '../constants';

interface ExperienceProps {
  isTree: boolean;
}

const Experience: React.FC<ExperienceProps> = ({ isTree }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 20]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minDistance={8} 
        maxDistance={40} 
        autoRotate={isTree} // Auto rotate when tree is formed
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5} // Don't go below ground
      />

      {/* Lighting - Cinematic and Dramatic */}
      <ambientLight intensity={0.2} color={COLORS.EMERALD_DEEP} />
      
      {/* Main Key Light (Warm Gold) - Increased Intensity */}
      <spotLight
        position={[10, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={5} 
        color={COLORS.GOLD_HIGHLIGHT}
        castShadow
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light (Cool Emerald) */}
      <pointLight position={[-10, 5, -10]} intensity={2} color={COLORS.EMERALD_LIGHT} />
      
      {/* Rim Light for outline */}
      <spotLight position={[0, 10, -15]} intensity={5} color="#ffffff" angle={0.5} />

      {/* Environment for Reflections */}
      <Environment preset="city" />

      {/* Scene Objects */}
      <group position={[0, -2, 0]}>
        {/* The Foliage System */}
        <Foliage isTree={isTree} />
        
        {/* The Ornaments */}
        <Ornaments isTree={isTree} type="SPHERE" />
        <Ornaments isTree={isTree} type="BOX" />

        {/* Floor Reflection/Shadow */}
        <ContactShadows 
          opacity={0.6} 
          scale={30} 
          blur={2} 
          far={4} 
          resolution={256} 
          color="#000000" 
        />
        
        {/* Star for Top */}
        <TreeTopper />
      </group>

      <BackgroundStars />

      {/* Post Processing - Enhanced Gold Bloom */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
            luminanceThreshold={0.25} // Lower threshold to catch more gold
            luminanceSmoothing={0.9} 
            intensity={2.5} // Higher intensity for "Golden Glow"
            mipmapBlur
        />
        <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

// Helper component for the Star at the top
const TreeTopper = () => {
    // The star remains strictly at the tree top.
    // Tree height is CONFIG.TREE_HEIGHT (12).
    // Geometry is centered vertically (-6 to 6).
    // So the top tip is at y = 6.
    const topY = CONFIG.TREE_HEIGHT / 2;

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
            <mesh position={[0, topY, 0]}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial 
                    color={COLORS.GOLD_HIGHLIGHT} 
                    emissive={COLORS.GOLD_HIGHLIGHT}
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </mesh>
            {/* Light coming from the star - always on */}
            <pointLight 
                position={[0, topY, 0]} 
                intensity={3} 
                distance={15} 
                color={COLORS.GOLD_HIGHLIGHT} 
            />
        </Float>
    );
};

const BackgroundStars = () => {
    return (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    )
}

export default Experience;