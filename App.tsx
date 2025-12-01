import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Experience from './components/Experience';
import Overlay from './components/Overlay';

const App: React.FC = () => {
  const [isTree, setIsTree] = useState<boolean>(false);

  return (
    <div className="w-full h-screen bg-[#010804] text-white overflow-hidden relative">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]} // Quality scaling for performance
          gl={{ 
            antialias: false, // Postprocessing handles AA better usually, or we use FXAA
            toneMapping: 1, // ACESFilmic
            toneMappingExposure: 1.2
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
