import React from 'react';
import { Shield, EyeOff, Lock, Clock, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-stage text-text-primary flex flex-col justify-between">
      {/* Header Bar */}
      <header className="w-full border-b border-border/80 bg-stage/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-text-primary font-sans">
              Suraksha<span className="text-accent font-light">AI</span>
            </span>
          </div>

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
            <div className="flex items-center gap-2 text-xs text-muted">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-knowledge client encryption & local storage</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
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
                Disguises safety controls inside a working calculator app. Entering key code <code className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">911=</code> dispatches emergency beacons silently.
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
                Set trip check-ins for 5, 15, or 30 minutes. If unrenewed by your confidential PIN code, priority escalation ladder dispatches SOS alerts.
              </span>
            </div>
          </Card>
        </div>

        {/* Trust & Privacy Guarantee Banner */}
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
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span>© 2026 SurakshaAI Safety Platform. Built for trust and speed under stress.</span>
          <span className="font-mono text-emerald-400 font-medium">Status: Guardian Engine Operational</span>
        </div>
      </footer>
    </div>
  );
};
