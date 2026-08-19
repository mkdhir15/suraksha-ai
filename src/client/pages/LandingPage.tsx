import React, { useState } from 'react';
import { Header } from '../components/hero/Header';
import { HeadlineBlock } from '../components/hero/HeadlineBlock';
import { CtaGroup } from '../components/hero/CtaGroup';
import { PartnerStrip } from '../components/hero/PartnerStrip';
import { MobileMenu } from '../components/hero/MobileMenu';

interface LandingPageProps {
  onLaunchApp: () => void;
  onViewArchitecture?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onViewArchitecture }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (target: string) => {
    if (target === 'app') {
      onLaunchApp();
    } else if (target === 'architecture' && onViewArchitecture) {
      onViewArchitecture();
    }
  };

  return (
    <div className="stage select-none">
      {/* Background Plate with Video */}
      <div className="plate">
        <video
          className="plate-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          {/* Safety coded generative canvas fallback or background loop */}
          <source src={import.meta.env.VITE_VIDEO_SRC || '/hero-bg.mp4'} type="video/mp4" />
        </video>
      </div>

      {/* Topbar Header */}
      <Header
        onNavClick={handleNavClick}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavClick={handleNavClick}
      />

      {/* Hero Content Stage */}
      <main className="hero relative w-full h-full">
        <HeadlineBlock />
        <CtaGroup
          onGetStarted={onLaunchApp}
          onViewArchitecture={onViewArchitecture}
        />
        <PartnerStrip />
      </main>
    </div>
  );
};
