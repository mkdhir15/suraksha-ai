import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'critical';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  isOpen,
  onClose,
  duration = 4500,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgStyles = {
    info: 'bg-surface border-border text-text-primary',
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
    critical: 'bg-critical border-red-400 text-white shadow-xl shadow-red-900/50',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-accent" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    critical: <AlertTriangle className="w-5 h-5 text-white animate-bounce" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgStyles[type]}`}
        role="alert"
        aria-live="polite"
      >
        {icons[type]}
        <span className="text-sm font-semibold tracking-wide">{message}</span>
      </div>
    </div>
  );
};
