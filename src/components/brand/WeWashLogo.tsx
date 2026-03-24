import React from 'react';

interface WeWashLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  showText?: boolean;
}

const WeWashLogo: React.FC<WeWashLogoProps> = ({ variant = 'light', className = '', showText = true }) => {
  const bubbleColor = variant === 'light' ? '#FFFFFF' : '#0B1D35';
  const textColor = variant === 'light' ? '#FFFFFF' : '#0B1D35';
  const goldColor = '#C4A052';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Bubble Icon */}
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Large bubble */}
        <circle cx="38" cy="62" r="30" fill={bubbleColor} opacity="0.95" />
        <ellipse cx="28" cy="50" rx="6" ry="10" fill="white" opacity="0.25" transform="rotate(-30 28 50)" />
        {/* Medium bubble */}
        <circle cx="70" cy="55" r="20" fill={bubbleColor} opacity="0.9" />
        <ellipse cx="63" cy="47" rx="4" ry="7" fill="white" opacity="0.25" transform="rotate(-30 63 47)" />
        {/* Small bubble */}
        <circle cx="55" cy="28" r="12" fill={bubbleColor} opacity="0.85" />
        <ellipse cx="51" cy="23" rx="3" ry="5" fill="white" opacity="0.25" transform="rotate(-30 51 23)" />
        {/* Sparkle */}
        <path d="M72 12 L74 18 L80 20 L74 22 L72 28 L70 22 L64 20 L70 18Z" fill={goldColor} />
        <path d="M85 30 L86 33 L89 34 L86 35 L85 38 L84 35 L81 34 L84 33Z" fill={goldColor} opacity="0.6" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span style={{ color: textColor }} className="text-xl font-bold tracking-tight leading-none">
            WeWash
          </span>
          <span style={{ color: goldColor }} className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase leading-none mt-0.5">
            Zambia
          </span>
        </div>
      )}
    </div>
  );
};

export default WeWashLogo;
