import React from 'react';

export const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 31.5 48.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Suraksha AI Brand Mark"
    >
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      {/* S / Bolt geometric path */}
      <path
        d="M27.5 3.5H9.5L4 15.5H19.5L13.5 27.5H27.5L22 45L4 23.5H16.5L27.5 3.5Z"
        fill="url(#bg1)"
      />
      {/* Bright notch rectangles */}
      <rect x="22" y="5.5" width="4" height="4" fill="#ffffff" rx="0.5" />
      <rect x="5.5" y="38.5" width="4" height="4" fill="#ffffff" rx="0.5" />
    </svg>
  );
};
