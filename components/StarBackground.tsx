import React from 'react';

const StarBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* 1. Deep Background Gradient (Deep Red to Black) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black"></div>
      
      {/* 2. Abstract Pattern Overlay (Thai Motif feel) */}
      <div 
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #7f1d1d 0, #7f1d1d 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px',
        }}
      ></div>

      {/* 3. Gold & Red Particles */}
      <div className="absolute w-full h-full">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse opacity-70 ${i % 2 === 0 ? 'bg-amber-400' : 'bg-red-600'}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 4 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: i % 2 === 0 ? '0 0 8px rgba(251, 191, 36, 0.6)' : '0 0 8px rgba(220, 38, 38, 0.6)'
            }}
          />
        ))}
      </div>
      
      {/* 4. Vignette for focus */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90"></div>
    </div>
  );
};

export default StarBackground;