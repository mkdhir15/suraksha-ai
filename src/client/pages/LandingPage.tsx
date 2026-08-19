import React from 'react';
import { Shield, EyeOff, Lock, Clock, Navigation, CheckCircle2, ArrowRight, Video, HeartHandshake, FileText, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BrandMark } from '../components/BrandMark';
import { ActiveView } from '../App';

interface LandingPageProps {
  onEnterApp: () => void;
  onNavigateToTrust?: (subView: ActiveView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigateToTrust }) => {
  const handleTrustClick = (subView: ActiveView) => {
    if (onNavigateToTrust) {
      onNavigateToTrust(subView);
    } else {
      onEnterApp();
    }
  };

  return (
    <div className="min-h-screen bg-stage text-text-primary flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="w-full border-b border-border bg-stage/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <BrandMark variant="full" />
          <Button variant="primary" size="sm" onClick={onEnterApp}>
            Launch Guardian App <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col gap-16">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent-light font-mono">
            <Shield className="w-3.5 h-3.5" /> Autonomous Personal Safety Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight leading-[1.15]">
            Calm, instant protection when you feel vulnerable.
          </h1>

          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            Designed for solo commuters, hostel students, and families. Continuous sensor fusion, covert panic triggers, and dead-man check-ins designed to operate without raising suspicion.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={onEnterApp}>
              Enter Guardian App <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-knowledge client encryption & local storage</span>
            </div>
          </div>
        </div>

        {/* Feature Grid: Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Silent Sensor Guardian"
            subtitle="Multi-modal acoustic and motion distress detection."
          >
            <div className="flex items-start gap-3 pt-2 text-xs text-muted leading-relaxed">
              <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>
                Fuses decibel spikes, vocal stress probability, and sudden kinetic impacts to calculate real-time threat levels automatically.
              </span>
            </div>
          </Card>

          <Card
            title="Covert Disguises"
            subtitle="Operational utility disguise with silent 911 trigger."
          >
            <div className="flex items-start gap-3 pt-2 text-xs text-muted leading-relaxed">
              <EyeOff className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>
                Disguises safety controls inside a working calculator app. Entering key code <code className="font-mono text-text-primary bg-white/10 px-1 py-0.5 rounded">911=</code> dispatches emergency beacons silently.
              </span>
            </div>
          </Card>

          <Card
            title="Dead-Man Check-In"
            subtitle="PIN-secured safety check-in countdown timer."
          >
            <div className="flex items-start gap-3 pt-2 text-xs text-muted leading-relaxed">
              <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>
                Set trip check-ins for 5, 15, or 30 minutes. If unrenewed by your confidential PIN code (9999), priority escalation ladder dispatches SOS alerts.
              </span>
            </div>
          </Card>
        </div>

        {/* NEW SECTION: Trust Infrastructure Suite */}
        <div className="flex flex-col gap-6 pt-4 border-t border-border">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Trust Infrastructure Suite</h2>
            <p className="text-xs text-muted leading-relaxed">
              Five specialized security & transparency modules for surveillance detection, deepfake shield, crisis support, evidence preservation, and bias auditing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div
              onClick={() => handleTrustClick('trust-stalkerware')}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-accent transition-all cursor-pointer flex flex-col gap-2"
            >
              <EyeOff className="w-5 h-5 text-sky-400" />
              <h3 className="text-xs font-bold text-text-primary">Stalkerware Detector</h3>
              <p className="text-[11px] text-muted leading-relaxed">Passive surveillance scanner & device admin audit.</p>
            </div>

            <div
              onClick={() => handleTrustClick('trust-deepfake')}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-accent transition-all cursor-pointer flex flex-col gap-2"
            >
              <Video className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xs font-bold text-text-primary">Deepfake Shield</h3>
              <p className="text-[11px] text-muted leading-relaxed">Emergency video call biometric verification & callback.</p>
            </div>

            <div
              onClick={() => handleTrustClick('trust-crisis')}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-accent transition-all cursor-pointer flex flex-col gap-2"
            >
              <HeartHandshake className="w-5 h-5 text-teal-400" />
              <h3 className="text-xs font-bold text-text-primary">Crisis Support</h3>
              <p className="text-[11px] text-muted leading-relaxed">Confidential reflection chat & 5-4-3-2-1 grounding exercise.</p>
            </div>

            <div
              onClick={() => handleTrustClick('trust-evidence')}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-accent transition-all cursor-pointer flex flex-col gap-2"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-text-primary">Evidence Log</h3>
              <p className="text-[11px] text-muted leading-relaxed">Genuine client SHA-256 evidence hashing & JSON export.</p>
            </div>

            <div
              onClick={() => handleTrustClick('trust-fairness')}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-accent transition-all cursor-pointer flex flex-col gap-2"
            >
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold text-text-primary">AI Bias Audit</h3>
              <p className="text-[11px] text-muted leading-relaxed">Demographic parity metrics & interactive threshold slider.</p>
            </div>
          </div>
        </div>

        {/* Privacy Guarantee Banner */}
        <div className="p-8 rounded-3xl border border-border bg-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Privacy First Architecture</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed max-w-xl">
                Location data and audio telemetry remain on your device unless an active distress threshold or dead-man timer expires. No background tracking servers, no ad tracking.
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={onEnterApp}>
            Open System <Navigation className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 text-center text-xs text-muted">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandMark variant="full" />
          <span>© 2026 SurakshaAI Platform. Built for trust and speed under stress.</span>
          <span className="font-mono text-emerald-400 font-medium">Status: Guardian Engine Operational</span>
        </div>
      </footer>
    </div>
  );
};
