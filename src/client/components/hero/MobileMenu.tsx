import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (target: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavClick }) => {
  if (!isOpen) return null;

  const handleLinkClick = (target: string) => {
    onNavClick(target);
    onClose();
  };

  return (
    <div
      id="menu"
      className="fixed inset-0 z-40 bg-stage/95 backdrop-blur-2xl flex flex-col justify-between p-8 md:hidden animate-fade"
      style={{ animationDuration: '0.25s' }}
    >
      {/* Eyebrow */}
      <div className="pt-16 animate-rise" style={{ animationDelay: '0.06s' }}>
        <span className="text-xs uppercase tracking-widest text-muted font-semibold">Menu</span>
      </div>

      {/* Nav Links List */}
      <nav className="flex flex-col gap-6 text-3xl font-light tracking-tight text-ink my-auto">
        <a
          href="#about"
          onClick={() => handleLinkClick('about')}
          className="hover:text-white transition-colors animate-rise"
          style={{ animationDelay: '0.12s' }}
        >
          About
        </a>
        <a
          href="#features"
          onClick={() => handleLinkClick('features')}
          className="hover:text-white transition-colors animate-rise"
          style={{ animationDelay: '0.18s' }}
        >
          Features
        </a>
        <a
          href="#faq"
          onClick={() => handleLinkClick('faq')}
          className="hover:text-white transition-colors animate-rise"
          style={{ animationDelay: '0.24s' }}
        >
          FAQ
        </a>
        <a
          href="#contact"
          onClick={() => handleLinkClick('contact')}
          className="hover:text-white transition-colors animate-rise"
          style={{ animationDelay: '0.30s' }}
        >
          Contact
        </a>
      </nav>

      {/* Footer CTA Pair */}
      <div className="flex flex-col gap-4 pb-8 animate-rise" style={{ animationDelay: '0.34s' }}>
        <button
          type="button"
          onClick={() => handleLinkClick('app')}
          className="w-full py-4 rounded-full bg-pill text-pill-ink font-medium text-lg shadow-lg hover:bg-white/90 transition-all"
        >
          Get Started
        </button>
        <button
          type="button"
          onClick={() => handleLinkClick('architecture')}
          className="w-full py-3 text-center text-white/80 font-medium text-base hover:text-white"
        >
          View Architecture
        </button>
      </div>
    </div>
  );
};
