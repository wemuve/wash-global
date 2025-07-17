import React from 'react';

const FloatingParticles: React.FC = () => {
  // Generate static particles to avoid any potential issues with useMemo
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 15 + 5,
    initialX: Math.random() * 100,
    initialY: Math.random() * 40 + 30,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Floating bubbles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/10 animate-float-up"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
      
      {/* Simple cleaning icons */}
      <div className="absolute top-1/4 left-1/4 animate-float-gentle opacity-30">
        <div className="w-6 h-6 rounded-full bg-white/20" />
      </div>
      
      <div className="absolute top-3/4 right-1/4 animate-float-gentle opacity-20" style={{ animationDelay: '3s' }}>
        <div className="w-8 h-8 rounded-full bg-white/15" />
      </div>
      
      <div className="absolute top-1/2 left-3/4 animate-float-gentle opacity-25" style={{ animationDelay: '6s' }}>
        <div className="w-5 h-5 rounded-full bg-white/18" />
      </div>
    </div>
  );
};

export default FloatingParticles;