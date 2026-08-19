import React, { useState } from 'react';
import { Shield, Navigation, Settings, ArrowLeft } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { RoutePage } from './pages/RoutePage';
import { SettingsPage } from './pages/SettingsPage';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'home' | 'route' | 'settings'>('landing');

  if (currentView === 'landing') {
    return <LandingPage onEnterApp={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-stage text-text-primary flex flex-col font-sans select-none">
      {/* Offline Survival Mode Banner */}
      <OfflineSyncBanner />

      {/* Main Application Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-stage/90 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('landing')}
              className="p-2 rounded-xl bg-surface border border-border hover:border-muted transition-colors text-muted hover:text-text-primary cursor-pointer"
              title="Return to Hero Landing"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-text-primary tracking-tight">
                Suraksha<span className="text-accent font-light">AI</span>
              </span>
            </div>
          </div>

          {/* View Tabs */}
          <nav className="flex items-center gap-2 bg-surface p-1 rounded-2xl border border-border">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-accent text-white shadow-md font-semibold'
                  : 'text-muted hover:text-text-primary'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Guardian Hub
            </button>
            <button
              onClick={() => setCurrentView('route')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'route'
                  ? 'bg-accent text-white shadow-md font-semibold'
                  : 'text-muted hover:text-text-primary'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" /> Safe Routes
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'settings'
                  ? 'bg-accent text-white shadow-md font-semibold'
                  : 'text-muted hover:text-text-primary'
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8">
        {currentView === 'home' && <HomePage />}
        {currentView === 'route' && <RoutePage />}
        {currentView === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
};

export default App;
