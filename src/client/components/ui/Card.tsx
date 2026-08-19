import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 shadow-xl transition-colors hover:border-border/80 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-border/60">
          <div>
            {title && <h3 className="text-lg font-bold text-text-primary tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-1 leading-relaxed">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
