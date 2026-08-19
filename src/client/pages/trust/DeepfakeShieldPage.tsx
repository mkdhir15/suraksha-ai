import React, { useState } from 'react';
import { ShieldCheck, Video, PhoneCall, Mic, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { simulateDeepfakeVerification, DeepfakeCheckResult } from '../../../server/services/deepfakeVerificationService';

export const DeepfakeShieldPage: React.FC = () => {
  const [result, setResult] = useState<DeepfakeCheckResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [callbackInitiated, setCallbackInitiated] = useState(false);

  const handleSimulateCall = () => {
    setIsVerifying(true);
    setResult(null);
    setCallbackInitiated(false);
    setTimeout(() => {
      const data = simulateDeepfakeVerification();
      setResult(data);
      setIsVerifying(false);
    }, 2000);
  };

  const handleInitiateCallback = () => {
    setCallbackInitiated(true);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">Deepfake & Impersonation Shield</h1>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Simulated Pipeline — On-Device Inference Demo
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Verifies incoming emergency video calls against facial mesh consistency, lip-sync latency, and voice biometrics.
            </p>
          </div>
        </div>

        <Button variant="primary" onClick={handleSimulateCall} disabled={isVerifying}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isVerifying ? 'animate-spin' : ''}`} />
          {isVerifying ? 'Verifying Stream...' : 'Simulate Emergency Call'}
        </Button>
      </div>

      {/* Verification Results Panel */}
      {result && !isVerifying && (
        <div className="flex flex-col gap-6">
          <Card
            title={`Biometric Verification Stream: ${result.callerName}`}
            subtitle={`Target: ${result.callerNumber} | Verified on ${new Date(result.timestamp).toLocaleTimeString()}`}
            action={
              <Badge
                level={result.verdict === 'SUSPICIOUS' ? 'CAUTION' : 'SAFE'}
                text={result.verdict === 'SUSPICIOUS' ? `SUSPICIOUS (${result.overallConfidence}% Match)` : `AUTHENTIC (${result.overallConfidence}% Match)`}
              />
            }
          >
            <div className="flex flex-col gap-6">
              {/* Reused Confidence Meters Pattern */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stage rounded-2xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                      <Video className="w-4 h-4 text-sky-400" />
                      <span>Facial Mesh Consistency</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted">{result.breakdown.acousticWeight}/35 pts</span>
                  </div>
                  <div role="meter" aria-valuenow={result.breakdown.acousticWeight} aria-valuemin={0} aria-valuemax={35} aria-label="Facial Mesh" className="w-full h-2.5 rounded-full bg-surface border border-border overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${(result.breakdown.acousticWeight / 35) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-muted mt-1.5 block font-mono">Micro-expression distortion detected</span>
                </div>

                <div className="bg-stage rounded-2xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      <span>Lip-Sync Audio Latency</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted">{result.breakdown.motionWeight}/30 pts</span>
                  </div>
                  <div role="meter" aria-valuenow={result.breakdown.motionWeight} aria-valuemin={0} aria-valuemax={30} aria-label="Lip-Sync" className="w-full h-2.5 rounded-full bg-surface border border-border overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${(result.breakdown.motionWeight / 30) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-muted mt-1.5 block font-mono">Audio-visual phase offset: +140ms</span>
                </div>

                <div className="bg-stage rounded-2xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                      <Mic className="w-4 h-4 text-emerald-400" />
                      <span>Voice Biometric Spectrum</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted">{result.breakdown.textWeight}/25 pts</span>
                  </div>
                  <div role="meter" aria-valuenow={result.breakdown.textWeight} aria-valuemin={0} aria-valuemax={25} aria-label="Voice Biometrics" className="w-full h-2.5 rounded-full bg-surface border border-border overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${(result.breakdown.textWeight / 25) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-muted mt-1.5 block font-mono">Harmonic frequency match 70%</span>
                </div>

                <div className="bg-stage rounded-2xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                      <span>Frame Latency Stability</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted">{result.breakdown.contextualWeight}/10 pts</span>
                  </div>
                  <div role="meter" aria-valuenow={result.breakdown.contextualWeight} aria-valuemin={0} aria-valuemax={10} aria-label="Frame Latency" className="w-full h-2.5 rounded-full bg-surface border border-border overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: '90%' }} />
                  </div>
                  <span className="text-[11px] text-muted mt-1.5 block font-mono">Clean transmission rate</span>
                </div>
              </div>

              {/* Callback Verification Trigger */}
              {result.requiresCallbackVerification && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-200">Biometric Score Below Confidence Threshold ({result.threshold}%)</h4>
                      <p className="text-xs text-muted mt-0.5">
                        Deepfake indicators detected. Initiate automated secondary out-of-band callback verification.
                      </p>
                    </div>
                  </div>

                  {!callbackInitiated ? (
                    <Button variant="primary" onClick={handleInitiateCallback}>
                      <PhoneCall className="w-4 h-4 mr-2" /> Out-of-Band Callback Verification
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Calling registered mobile: {result.callerNumber}...
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
