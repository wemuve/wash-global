import React, { useMemo } from 'react';

interface Particle {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
}

interface CleaningIcon {
  id: number;
  type: 'bubble' | 'drop' | 'sparkle';
  x: number;
  y: number;
  delay: number;
  size: number;
}

const FloatingParticles: React.FC = () => {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 15 + 5, // 5-20px
      initialX: Math.random() * 100, // 0-100%
      initialY: Math.random() * 40 + 30, // 30-70% (middle area)
      duration: Math.random() * 10 + 15, // 15-25s
      delay: Math.random() * 10, // 0-10s delay
    }));
  }, []);

  // Generate cleaning-themed icons
  const cleaningIcons = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      type: ['bubble', 'drop', 'sparkle'][i % 3] as 'bubble' | 'drop' | 'sparkle',
      x: 10 + (Math.random() * 80), // 10-90%
      y: 10 + (Math.random() * 80), // 10-90%
      delay: Math.random() * 8, // 0-8s delay
      size: Math.random() * 10 + 20, // 20-30px
    }));
  }, []);

  const renderIcon = (icon: CleaningIcon) => {
    switch(icon.type) {
      case 'bubble':
        return (
          <svg width={icon.size} height={icon.size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fillOpacity="0.1" fill="white"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" fillOpacity="0.2" fill="white"/>
          </svg>
        );
      case 'drop':
        return (
          <svg width={icon.size} height={icon.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L6 12C4 14 4 18 8 20C12 22 16 20 18 16C20 12 14 4 12 2Z" stroke="currentColor" strokeWidth="1" fillOpacity="0.1" fill="white"/>
          </svg>
        );
      case 'sparkle':
        return (
          <svg width={icon.size} height={icon.size} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14 9H21L16 14L18 21L12 17L6 21L8 14L3 9H10L12 2Z" stroke="currentColor" strokeWidth="1" fillOpacity="0.1" fill="white"/>
          </svg>
        );
    }
  };

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
      
      {/* Cleaning-themed icons */}
      {cleaningIcons.map(icon => (
        <div
          key={`icon-${icon.id}`}
          className="absolute text-white/30 animate-float-gentle"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDelay: `${icon.delay}s`,
            animationDuration: `${8 + (icon.id % 4)}s`,
          }}
        >
          {renderIcon(icon)}
        </div>
      ))}
      
      {/* Light beam effect */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-400/5 to-transparent opacity-30" />
    </div>
  );
};

export default FloatingParticles;