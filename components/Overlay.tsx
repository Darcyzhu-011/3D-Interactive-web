import React from 'react';
import { Sparkles, Trees } from 'lucide-react';

interface OverlayProps {
  isTree: boolean;
  setIsTree: (val: boolean) => void;
}

const Overlay: React.FC<OverlayProps> = ({ isTree, setIsTree }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem',
      zIndex: 10
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
        <h1 className="ui-title" style={{ fontSize: '3rem', margin: 0, lineHeight: 1.2 }}>
          Interactive Christmas Tree
        </h1>
        <p className="ui-subtitle" style={{ fontSize: '0.9rem' }}>
          Holiday Collection 2025
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', pointerEvents: 'auto' }}>
        <button
          onClick={() => setIsTree(!isTree)}
          className={`glass-button ${isTree ? 'active' : 'inactive'}`}
        >
          {/* Button Glow Behind */}
          <div className="glow-bg" />

          {isTree ? (
            <>
              <Sparkles size={20} color="#fde047" className="animate-pulse" />
              <span style={{ color: '#fef9c3', fontFamily: 'serif', letterSpacing: '0.1em', fontSize: '1.125rem' }}>SCATTER</span>
            </>
          ) : (
            <>
              <Trees size={20} color="#6ee7b7" />
              <span style={{ color: '#d1fae5', fontFamily: 'serif', letterSpacing: '0.1em', fontSize: '1.125rem' }}>ASSEMBLE</span>
            </>
          )}
        </button>
        
        <div style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.2em' }}>
            {isTree ? 'STATE: STRUCTURED' : 'STATE: CHAOTIC'}
        </div>
      </div>
      
      {/* Ornamental Borders - hidden on small screens typically, but we'll keep simple inline style */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        border: '1px solid rgba(255,255,255,0.05)',
        boxSizing: 'border-box',
        margin: '1rem',
        borderRadius: '8px'
      }} />
    </div>
  );
};

export default Overlay;