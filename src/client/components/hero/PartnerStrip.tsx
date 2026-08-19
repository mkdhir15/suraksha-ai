import React from 'react';

export const PartnerStrip: React.FC = () => {
  return (
    <div
      className="logos absolute flex items-center justify-between animate-fade"
      style={{
        left: '50%',
        top: 'calc(995 * var(--u))',
        width: 'calc(741 * var(--u))',
        transform: 'translateX(calc(-50% + 20 * var(--u)))',
        color: 'var(--strip)',
        animationDelay: '0.34s',
        zIndex: 30,
      }}
    >
      {/* Partner 1: Shield / Target icon */}
      <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 4a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <span className="ipsum-wordmark text-sm tracking-wider uppercase">logoipsum</span>
      </div>

      {/* Partner 2: Hexagon Pulse with trailing raised dot */}
      <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l9 5.19v10.38L12 22l-9-5.19V7.19L12 2zm0 4.5L6 10v4l6 3.5 6-3.5v-4l-6-3.5z" />
        </svg>
        <span className="ipsum-wordmark text-sm tracking-wider uppercase relative">
          logoipsum
          <span className="absolute -top-1 -right-2 text-xs font-bold text-white">•</span>
        </span>
      </div>

      {/* Partner 3: Diamond Node */}
      <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l6.5 6.5-6.5 6.5-6.5-6.5L12 6.5z" />
        </svg>
        <span className="ipsum-wordmark text-sm tracking-wider uppercase">logoipsum</span>
      </div>

      {/* Partner 4: Infinity Loop */}
      <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.6 6.6c-1.5 0-2.9.7-3.8 1.9l-2.8 3.5-2.8-3.5c-.9-1.2-2.3-1.9-3.8-1.9C3 6.6 1 8.6 1 11.1c0 2.5 2 4.5 4.4 4.5 1.5 0 2.9-.7 3.8-1.9l2.8-3.5 2.8 3.5c.9 1.2 2.3 1.9 3.8 1.9 2.4 0 4.4-2 4.4-4.5 0-2.5-2-4.5-4.4-4.5z" />
        </svg>
        <span className="ipsum-wordmark text-sm tracking-wider uppercase">logoipsum</span>
      </div>
    </div>
  );
};
