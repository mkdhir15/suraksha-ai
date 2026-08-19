import React from 'react';
import { RiskLevel } from '../../../shared/types/safety.types';

interface BadgeProps {
  level: RiskLevel | 'STANDBY' | 'ACTIVE';
  text?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ level, text, size = 'md' }) => {
  const styles = {
    SAFE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    CAUTION: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    CRITICAL: 'bg-critical text-white border-red-500 animate-pulse font-bold',
    STANDBY: 'bg-white/5 text-muted border-border',
    ACTIVE: 'bg-accent/10 text-accent-light border-accent/30',
  };

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-semibold tracking-wider ${styles[level]} ${sizeClass}`}
    >
      {text || level}
    </span>
  );
};
