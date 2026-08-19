import React from 'react';

interface CtaGroupProps {
  onGetStarted?: () => void;
  onViewArchitecture?: () => void;
}

export const CtaGroup: React.FC<CtaGroupProps> = ({ onGetStarted, onViewArchitecture }) => {
  return (
    <div className="actions">
      {/* Primary Pill CTA */}
      <button
        type="button"
        onClick={onGetStarted}
        className="pill absolute inline-flex items-center justify-center rounded-full animate-rise transition-transform hover:scale-105 active:scale-95"
        style={{
          left: 'calc(74.9 * var(--u))',
          top: 'calc(230.5 * var(--u) + 264.5 * var(--h))',
          width: 'calc(175.6 * var(--h))',
          height: 'calc(50 * var(--h))',
          backgroundColor: 'var(--pill)',
          color: 'var(--pill-ink)',
          fontSize: 'calc(20.6 * var(--h))',
          fontWeight: 500,
          animationDelay: '0.22s',
          zIndex: 30,
          boxShadow: '0 4px 24px rgba(255, 255, 255, 0.2)',
        }}
      >
        <span>Get Started</span>
      </button>

      {/* Ghost Link */}
      <button
        type="button"
        onClick={onViewArchitecture}
        className="absolute inline-flex items-center text-white font-medium animate-rise hover:opacity-80 transition-opacity"
        style={{
          left: 'calc(74.9 * var(--u) + 220.6 * var(--h))',
          top: 'calc(230.5 * var(--u) + 279.5 * var(--h))',
          fontSize: 'calc(20.6 * var(--h))',
          letterSpacing: 'calc(0.12 * var(--h))',
          animationDelay: '0.22s',
          zIndex: 30,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        View Architecture
      </button>
    </div>
  );
};
