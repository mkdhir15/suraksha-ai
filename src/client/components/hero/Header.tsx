import React from 'react';
import { BrandMark } from './BrandMark';

interface HeaderProps {
  onNavClick?: (target: string) => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick, isMenuOpen, onToggleMenu }) => {
  const handleLinkClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (onNavClick) onNavClick(target);
  };

  return (
    <header className="topbar w-full">
      {/* Desktop Brand Mark */}
      <a
        href="#"
        onClick={(e) => handleLinkClick(e, 'hero')}
        aria-label="Home"
        className="brand absolute hidden md:block animate-rise"
        style={{
          left: 'calc(75 * var(--u))',
          top: 'calc(27 * var(--u))',
          width: 'calc(31.5 * var(--u))',
          height: 'calc(48.5 * var(--u))',
          zIndex: 40,
        }}
      >
        <BrandMark className="w-full h-full" />
      </a>

      {/* Desktop Nav Links */}
      <nav
        aria-label="Primary"
        className="links absolute hidden md:flex items-center animate-rise-nav"
        style={{
          left: '50%',
          top: 'calc(51 * var(--u))',
          fontSize: 'calc(19 * var(--u))',
          fontWeight: 400,
          color: 'var(--nav)',
          gap: 'calc(24.5 * var(--u))',
          zIndex: 40,
        }}
      >
        <a
          href="#about"
          onClick={(e) => handleLinkClick(e, 'about')}
          className="hover:text-white transition-colors duration-200"
        >
          About
        </a>
        <a
          href="#features"
          onClick={(e) => handleLinkClick(e, 'features')}
          className="hover:text-white transition-colors duration-200"
        >
          Features
        </a>
        <a
          href="#faq"
          onClick={(e) => handleLinkClick(e, 'faq')}
          className="hover:text-white transition-colors duration-200"
        >
          FAQ
        </a>
        <a
          href="#contact"
          onClick={(e) => handleLinkClick(e, 'contact')}
          className="hover:text-white transition-colors duration-200"
        >
          Contact
        </a>
      </nav>

      {/* Header Pill CTA */}
      <a
        href="#app"
        onClick={(e) => handleLinkClick(e, 'app')}
        className="pill pill-nav absolute hidden md:inline-flex items-center justify-center animate-rise rounded-full"
        style={{
          right: 'calc(75.4 * var(--u))',
          top: 'calc(27 * var(--u))',
          width: 'calc(175 * var(--u))',
          height: 'calc(49 * var(--u))',
          backgroundColor: 'var(--pill)',
          color: 'var(--pill-ink)',
          fontSize: 'calc(20.6 * var(--u))',
          fontWeight: 500,
          zIndex: 40,
          boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
        }}
      >
        <span style={{ transform: 'translateY(calc(1 * var(--u)))' }}>Get Started</span>
      </a>

      {/* Mobile Bar Top Header */}
      <div className="flex md:hidden items-center justify-between px-6 py-4 w-full relative z-50">
        <a href="#" onClick={(e) => handleLinkClick(e, 'hero')} aria-label="Home" className="w-8 h-10">
          <BrandMark className="w-full h-full" />
        </a>
        
        {/* Frosted Glass Burger Toggle Button */}
        <button
          id="burger"
          type="button"
          onClick={onToggleMenu}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="w-11 h-11 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderColor: 'rgba(255, 255, 255, 0.14)',
            borderWidth: '1px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <i
            className="w-5 h-0.5 bg-white transition-transform duration-300 origin-center"
            style={{
              transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
            }}
          />
          <i
            className="w-5 h-0.5 bg-white transition-transform duration-300 origin-center"
            style={{
              transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>
    </header>
  );
};
