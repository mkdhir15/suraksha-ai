import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-stage active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-sky-500 shadow-md shadow-sky-500/10',
    secondary: 'bg-surface border border-border text-text-primary hover:bg-surface-hover',
    outline: 'bg-transparent border border-border text-text-primary hover:border-muted hover:bg-white/5',
    critical: 'bg-critical text-white hover:bg-red-600 shadow-lg shadow-red-500/20 font-bold',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
