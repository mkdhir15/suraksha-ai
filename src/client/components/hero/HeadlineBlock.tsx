import React from 'react';

export const HeadlineBlock: React.FC = () => {
  return (
    <>
      {/* Desktop & Responsive Headline */}
      <h1
        className="headline absolute text-ink font-normal tracking-tight animate-rise"
        style={{
          left: 'calc(75.5 * var(--u))',
          top: 'calc(230.5 * var(--u))',
          fontSize: 'calc(71.6 * var(--h))',
          lineHeight: 'calc(80.5 * var(--h))',
          letterSpacing: 'calc(0.3 * var(--h))',
          color: 'var(--ink)',
          animationDelay: '0.06s',
          zIndex: 30,
        }}
      >
        <span className="block whitespace-nowrap">The Next Layer</span>
        <span className="block whitespace-nowrap">of Intelligence</span>
      </h1>

      {/* Desktop & Responsive Subcopy */}
      <p
        className="sub absolute font-normal animate-rise"
        style={{
          left: 'calc(75.5 * var(--u))',
          top: 'calc(230.5 * var(--u) + 189.0 * var(--h))',
          fontSize: 'calc(20.7 * var(--h))',
          lineHeight: 'calc(23.5 * var(--h))',
          wordSpacing: 'calc(1.8 * var(--h))',
          color: 'var(--muted)',
          animationDelay: '0.14s',
          zIndex: 30,
        }}
      >
        <span className="block whitespace-nowrap">
          Autonomous personal safety intelligence powered by real-time sensor fusion,
        </span>
        <span className="block whitespace-nowrap">
          covert distress triggers, and instant emergency dispatch.
        </span>
      </p>
    </>
  );
};
