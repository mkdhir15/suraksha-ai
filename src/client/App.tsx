import React, { useState, useEffect } from 'react';
import { Shield, Navigation, Settings, ArrowLeft, Lock, EyeOff, Video, HeartHandshake, FileText, BarChart3, ChevronDown, PhoneCall } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { RoutePage } from './pages/RoutePage';
import { SettingsPage } from './pages/SettingsPage';
import { UtilityPage } from './pages/UtilityPage';
import { FakeCallSimulator } from './components/FakeCallSimulator';
import { StalkerwarePage } from './pages/trust/StalkerwarePage';
import { DeepfakeShieldPage } from './pages/trust/DeepfakeShieldPage';
import { CrisisSupportPage } from './pages/trust/CrisisSupportPage';
import { EvidenceLogPage } from './pages/trust/EvidenceLogPage';
import { FairnessReportPage } from './pages/trust/FairnessReportPage';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { BrandMark } from './components/BrandMark';

export type ActiveView =
  | 'landing'
  | 'home'
  | 'route'
  | 'settings'
  | 'utility'
  | 'fake-call'
  | 'trust-stalkerware'
  | 'trust-deepfake'
  | 'trust-crisis'
  | 'trust-evidence'
  | 'trust-fairness';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ActiveView>('landing');
  const [trustDropdownOpen, setTrustDropdownOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/utility') {
        setCurrentView('utility');
      } else if (window.location.hash === '#/fake-call') {
        setCurrentView('fake-call');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isTrustActive = currentView.startsWith('trust-');

  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => setCurrentView('home')}
        onNavigateToTrust={(subView) => setCurrentView(subView)}
      />
    );
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
              onClick={() => {
                setCurrentView('landing');
                window.location.hash = '';
              }}
              className="p-2 rounded-xl bg-surface border border-border hover:border-muted transition-colors text-muted hover:text-text-primary cursor-pointer"
              title="Return to Hero Landing"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setCurrentView('home');
                window.location.hash = '';
              }}
            >
              <BrandMark variant="full" />
            </div>
          </div>

          {/* View Tabs */}
          <nav className="flex items-center gap-2 bg-surface p-1 rounded-2xl border border-border relative">
            <button
              onClick={() => {
                setCurrentView('home');
                setTrustDropdownOpen(false);
                window.location.hash = '';
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-accent text-white shadow-md font-semibold'
                  : 'text-muted hover:text-text-primary'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Guardian Hub
            </button>

            <button
              onClick={() => {
                setCurrentView('route');
                setTrustDropdownOpen(false);
                window.location.hash = '';
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'route'
                  ? 'bg-accent text-white shadow-md font-semibold'
                  : 'text-muted hover:text-text-primary'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" /> Safe Routes
            </button>

            {/* FAKE CALL DETERRENT TAB (Matching screenshot design) */}
            <button
              onClick={() => {
                setCurrentView('fake-call');
                setTrustDropdownOpen(false);
                window.location.hash = '';
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'fake-call'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold border border-indigo-400/40'
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" /> Fake Call
            </button>

            {/* TRUST CENTER DROPDOWN NAV TAB */}
            <div className="relative">
              <button
                onClick={() => setTrustDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isTrustActive
                    ? 'bg-accent text-white shadow-md font-semibold'
                    : 'text-muted hover:text-text-primary'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Trust Center <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {trustDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-surface border border-border shadow-2xl p-2 z-50 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setCurrentView('trust-stalkerware');
                      setTrustDropdownOpen(false);
                      window.location.hash = '';
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      currentView === 'trust-stalkerware' ? 'bg-accent/20 text-accent font-bold' : 'text-muted hover:bg-stage hover:text-text-primary'
                    }`}
                  >
                    <EyeOff className="w-4 h-4 text-sky-400" /> Stalkerware Detector
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('trust-deepfake');
                      setTrustDropdownOpen(false);
                      window.location.hash = '';
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      currentView === 'trust-deepfake' ? 'bg-accent/20 text-accent font-bold' : 'text-muted hover:bg-stage hover:text-text-primary'
                    }`}
                  >
                    <Video className="w-4 h-4 text-indigo-400" /> Deepfake Shield
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('trust-crisis');
                      setTrustDropdownOpen(false);
                      window.location.hash = '';
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      currentView === 'trust-crisis' ? 'bg-accent/20 text-accent font-bold' : 'text-muted hover:bg-stage hover:text-text-primary'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 text-teal-400" /> Mental Health Crisis Interception
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('trust-evidence');
                      setTrustDropdownOpen(false);
                      window.location.hash = '';
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      currentView === 'trust-evidence' ? 'bg-accent/20 text-accent font-bold' : 'text-muted hover:bg-stage hover:text-text-primary'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-amber-400" /> Evidence Chain-of-Custody
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('trust-fairness');
                      setTrustDropdownOpen(false);
                      window.location.hash = '';
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                      currentView === 'trust-fairness' ? 'bg-accent/20 text-accent font-bold' : 'text-muted hover:bg-stage hover:text-text-primary'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" /> AI Bias Audit Dashboard
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setCurrentView('settings');
                setTrustDropdownOpen(false);
                window.location.hash = '';
              }}
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
        {currentView === 'fake-call' && <FakeCallSimulator />}
        {currentView === 'settings' && <SettingsPage />}
        {currentView === 'utility' && <UtilityPage />}
        {currentView === 'trust-stalkerware' && <StalkerwarePage />}
        {currentView === 'trust-deepfake' && <DeepfakeShieldPage />}
        {currentView === 'trust-crisis' && <CrisisSupportPage />}
        {currentView === 'trust-evidence' && <EvidenceLogPage />}
        {currentView === 'trust-fairness' && <FairnessReportPage />}
      </main>
    </div>
  );
};

export default App;
