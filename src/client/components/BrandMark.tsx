import React from 'react';

interface BrandMarkProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ variant = 'full', className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Logo Image suraksha.png */}
      <img
        src="/suraksha.png"
        alt="SurakshaAI Official Logo"
        className={variant === 'icon' ? 'w-8 h-8 object-contain rounded-lg' : 'w-10 h-10 object-contain rounded-xl'}
        onError={(e) => {
          // Graceful fallback if image is loading
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* SVG Shield Vector Lockup */}
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={variant === 'icon' ? 'w-7 h-9' : 'w-9 h-11'}
        aria-label="SurakshaAI Shield Logo"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A0E27" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0DD9C4" />
          </linearGradient>

          <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0DD9C4" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0A0E27" />
          </linearGradient>

          <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0DD9C4" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        <path
          d="M50 6 L88 22 V55 C88 80 70 104 50 114 C30 104 12 80 12 55 V22 L50 6 Z"
          fill="url(#shieldGrad)"
          stroke="#0DD9C4"
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0.9"
        />

        <path
          d="M50 12 L82 26 V54 C82 75 66 96 50 105 C34 96 18 75 18 54 V26 L50 12 Z"
          fill="#070A14"
        />

        <path
          d="M68 32 H40 L34 48 H58 L52 64 H68 L58 84 L32 60 H48 L68 32 Z"
          fill="url(#sGrad)"
        />

        <path d="M68 32 L78 24 M78 24 L84 30" stroke="url(#nodeGrad)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="68" cy="32" r="3" fill="#0DD9C4" />
        <circle cx="78" cy="24" r="3" fill="#38BDF8" />
        <circle cx="84" cy="30" r="2.5" fill="#0DD9C4" />

        <g fill="#0DD9C4" opacity="0.85">
          <circle cx="50" cy="74" r="3.5" />
          <path d="M44 86 C44 80 56 80 56 86 V92 H44 V86 Z" />
          <circle cx="39" cy="77" r="3" />
          <path d="M34 88 C34 83 44 83 44 88 V92 H34 V88 Z" />
          <circle cx="61" cy="77" r="3" />
          <path d="M56 88 C56 83 66 83 66 88 V92 H56 V88 Z" />
        </g>
      </svg>

      {/* Full Wordmark & Tagline Lockup */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none font-sans font-extrabold text-xl tracking-tight">
            <span className="text-text-primary">Suraksha</span>
            <span className="text-[#0DD9C4]">AI</span>
          </div>
          <span className="text-[9px] font-bold font-mono text-muted tracking-[0.2em] uppercase mt-1">
            PREDICT. PROTECT. PREVENT.
          </span>
        </div>
      )}
    </div>
  );
};
