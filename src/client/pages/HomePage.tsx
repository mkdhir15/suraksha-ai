import React, { useState } from 'react';
import { Shield, Radio, AlertOctagon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';
import { RiskBreakdownPanel } from '../components/RiskBreakdownPanel';
import { DeadManSwitch } from '../components/DeadManSwitch';
import { CalculatorDisguise } from '../components/CalculatorDisguise';
import { EscalationLadder } from '../components/EscalationLadder';
import { useDistressFusion } from '../hooks/useDistressFusion';

export const HomePage: React.FC = () => {
  const { isMonitoring, toggleMonitoring, analyzeThreat, analysisResult } = useDistressFusion();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSimulateThreat = async () => {
    const result = await analyzeThreat({
      textSnippet: 'Someone is following me down this dark street, need help fast',
      audioFeatures: { decibels: 88, pitchHz: 340, stressProbability: 0.92 },
      motionFeatures: { accelerationMagnitude: 2.8, isRapidMovement: true, freefallDetected: false },
    });
    setToastMessage(`Threat Analyzed: ${result.riskLevel} (${result.riskScore}/100)`);
  };

  const handleTriggerSos = () => {
    setToastMessage('CRITICAL: SILENT EMERGENCY SOS DISPATCHED TO GUARDIANS');
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
                : 'Guardian engine in standby mode. Click Start Guardian to begin background telemetry.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Risk Breakdown & Escalation Ladder */}
        <div className="flex flex-col gap-8">
          <RiskBreakdownPanel analysis={analysisResult} />
          <EscalationLadder onLevel3Triggered={handleTriggerSos} />
        </div>

        {/* Right Column: Dead-Man Switch & Covert Calculator */}
        <div className="flex flex-col gap-8">
          <DeadManSwitch onSosTriggered={handleTriggerSos} />
          <CalculatorDisguise onTriggerSos={handleTriggerSos} />
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
