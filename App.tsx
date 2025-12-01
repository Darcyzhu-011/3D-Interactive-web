import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import * as THREE from 'three';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [isTree, setIsTree] = useState<boolean>(false);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#010804', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Scene */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Canvas
          shadows
          dpr={[1, 2]} // Quality scaling for performance
          gl={{ 
            antialias: false, // Postprocessing handles AA
            toneMapping: THREE.ACESFilmicToneMapping, // Better for high dynamic range (bloom)
            toneMappingExposure: 1.0
          }}
        >
          <Suspense fallback={null}>
            <Experience isTree={isTree} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Layer */}
      <Overlay isTree={isTree} setIsTree={setIsTree} />
      
      {/* Loading Screen */}
      <Loader 
        containerStyles={{ background: '#010804' }}
        innerStyles={{ width: '400px', height: '2px', background: '#333' }}
        barStyles={{ height: '2px', background: '#D4AF37' }}
        dataStyles={{ fontFamily: 'serif', color: '#D4AF37', fontSize: '12px', letterSpacing: '0.2em' }}
      />
    </div>
  );
};

export default App;