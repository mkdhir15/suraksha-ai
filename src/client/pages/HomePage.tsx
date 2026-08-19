import React, { useState } from 'react';
import { Shield, Radio, AlertOctagon, Play, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { RiskBreakdownPanel } from '../components/RiskBreakdownPanel';
import { DeadManSwitch } from '../components/DeadManSwitch';
import { EscalationLadder } from '../components/EscalationLadder';
import { useDistressFusion } from '../hooks/useDistressFusion';
import { EscalationState, EscalationLevel } from '../../shared/types/safety.types';
import {
  createInitialEscalationState,
  escalateState,
  resetEscalationState,
} from '../../server/services/escalationService';

export const HomePage: React.FC = () => {
  const { isMonitoring, toggleMonitoring, analyzeThreat, analysisResult } = useDistressFusion();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [escalation, setEscalation] = useState<EscalationState>(createInitialEscalationState());
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const handleEscalate = (targetLevel: EscalationLevel, reason: string) => {
    setEscalation((prev) => escalateState(prev, targetLevel, reason));
  };

  const handleResetEscalation = () => {
    setEscalation(resetEscalationState());
  };

  const handleSimulateThreat = async () => {
    const result = await analyzeThreat({
      textSnippet: 'Someone is following me down this dark street, need help fast',
      audioFeatures: { decibels: 88, pitchHz: 340, stressProbability: 0.92 },
      motionFeatures: { accelerationMagnitude: 2.8, isRapidMovement: true, freefallDetected: false },
    });
    setToastMessage(`Threat Analyzed: ${result.riskLevel} (${result.riskScore}/100) — Modality Weights Updated`);
  };

  const handleDeadManExpire = () => {
    handleEscalate(3, "Dead-Man's Switch expired without PIN renewal");
    setToastMessage('CRITICAL: DEAD-MAN SWITCH EXPIRED -> LEVEL 3 EMERGENCY SOS DISPATCHED');
  };

  const handleTriggerSos = () => {
    handleEscalate(3, 'Silent emergency SOS dispatched manually');
    setToastMessage('CRITICAL: SILENT EMERGENCY SOS DISPATCHED TO GUARDIANS');
  };

  // Single-Click "Guided Live Demo Flow"
  const handleRunGuidedDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);

    if (!isMonitoring) {
      toggleMonitoring();
    }

    // Step 1 (0s): Simulate Threat Signal & Risk Fusion Weight Analysis
    setToastMessage('Guided Demo (Step 1/3): Analyzing Multi-Modal Threat Signals...');
    await analyzeThreat({
      textSnippet: 'Urgent: Unidentified person following close behind',
      audioFeatures: { decibels: 89, pitchHz: 360, stressProbability: 0.94 },
      motionFeatures: { accelerationMagnitude: 2.9, isRapidMovement: true, freefallDetected: false },
    });

    // Step 2 (1.4s): Escalation Ladder Level 1 -> Level 2
    setTimeout(() => {
      handleEscalate(1, 'Guided Demo: Level 1 Warning Signal Detected');
      setToastMessage('Guided Demo (Step 2/3): Escalating to Level 1 Warning...');
    }, 1400);

    setTimeout(() => {
      handleEscalate(2, 'Guided Demo: Level 2 Silent Contact Beacon Active');
      setToastMessage('Guided Demo (Step 2/3): Escalation Ladder Level 2 Silent Beacon Active');
    }, 2600);

    // Step 3 (4.0s): Dead-Man Switch Expiry -> Level 3 Active
    setTimeout(() => {
      handleEscalate(3, 'Guided Demo: Dead-Man Switch Expiration Event');
      setToastMessage('Guided Demo (Step 3/3): Dead-Man Expiration -> Level 3 Emergency SOS Dispatched!');
      setIsDemoRunning(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Guardian Status Header Card */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isMonitoring
                ? 'bg-accent/15 text-accent border-accent/30'
                : 'bg-white/5 text-muted border-border'
            }`}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">Guardian Telemetry Stream</h1>
              <Badge level={isMonitoring ? 'ACTIVE' : 'STANDBY'} />
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              {isMonitoring
                ? 'Active multi-modal monitoring: Acoustic decibels, motion acceleration, & contextual telemetry fused.'
                : 'Guardian engine in standby mode. Click Start Guardian or Run Guided Live Demo.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={isMonitoring ? 'primary' : 'outline'}
            onClick={toggleMonitoring}
            className="flex items-center gap-2"
          >
            <Radio className={`w-4 h-4 ${isMonitoring ? 'animate-pulse text-white' : ''}`} />
            {isMonitoring ? 'Guardian Active' : 'Start Guardian'}
          </Button>

          <Button variant="critical" onClick={handleSimulateThreat}>
            <AlertOctagon className="w-4 h-4 mr-1.5" /> Simulate Threat Signal
          </Button>

          <Button
            variant="secondary"
            onClick={handleRunGuidedDemo}
            disabled={isDemoRunning}
            className="border border-accent/40 text-accent font-bold"
          >
            {isDemoRunning ? (
              <Sparkles className="w-4 h-4 mr-1.5 animate-spin text-accent" />
            ) : (
              <Play className="w-4 h-4 mr-1.5 text-accent" />
            )}
            {isDemoRunning ? 'Executing Live Demo...' : 'Run Guided Live Demo'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Explainable Risk Breakdown, Escalation Ladder, & Dead-Man Switch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Risk Breakdown Panel */}
        <div className="flex flex-col gap-8">
          <RiskBreakdownPanel analysis={analysisResult} />
        </div>

        {/* Right Column: Escalation Ladder & Dead-Man Switch */}
        <div className="flex flex-col gap-8">
          <EscalationLadder
            onLevel3Triggered={handleTriggerSos}
            escalationState={escalation}
            onEscalate={handleEscalate}
            onReset={handleResetEscalation}
          />

          <DeadManSwitch onSosTriggered={handleDeadManExpire} />
        </div>
      </div>

      <Toast
        isOpen={!!toastMessage}
        message={toastMessage || ''}
        type={toastMessage?.includes('CRITICAL') ? 'critical' : 'info'}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
