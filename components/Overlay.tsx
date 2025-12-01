import React from 'react';
import { Sparkles, Trees, Minimize2 } from 'lucide-react';
import { COLORS } from '../constants';

interface OverlayProps {
  isTree: boolean;
  setIsTree: (val: boolean) => void;
}

const Overlay: React.FC<OverlayProps> = ({ isTree, setIsTree }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Header */}
      <div className="flex flex-col items-center mt-4">
        <h1 
          className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 tracking-widest uppercase drop-shadow-lg text-center"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Interactive Christmas Tree
        </h1>
        <p className="text-emerald-400 text-sm md:text-base tracking-[0.3em] mt-2 font-light uppercase opacity-80">
          Holiday Collection 2025
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center mb-12 pointer-events-auto">
        <button
          onClick={() => setIsTree(!isTree)}
          className={`
            group relative flex items-center justify-center gap-3 px-8 py-4 
            rounded-full transition-all duration-500 ease-out
            backdrop-blur-md border border-white/10
            ${isTree ? 'bg-emerald-900/40' : 'bg-black/40'}
            hover:bg-emerald-800/60 hover:scale-105 hover:border-yellow-500/50
            shadow-[0_0_30px_rgba(0,0,0,0.5)]
          `}
        >
          {/* Button Glow Behind */}
          <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-xl group-hover:bg-yellow-500/20 transition-all" />

          {isTree ? (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-yellow-100 font-serif tracking-widest text-lg">SCATTER</span>
            </>
          ) : (
            <>
              <Trees className="w-5 h-5 text-emerald-300" />
              <span className="text-emerald-100 font-serif tracking-widest text-lg">ASSEMBLE</span>
            </>
          )}
        </button>
        
        <div className="mt-4 text-white/30 text-xs font-mono tracking-widest">
            {isTree ? 'STATE: STRUCTURED' : 'STATE: CHAOTIC'}
        </div>
      </div>
      
      {/* Ornamental Borders */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-[1px] border-white/5 m-4 rounded-lg hidden md:block" />
    </div>
  );
};

export default Overlay;