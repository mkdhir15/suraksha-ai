import React from 'react';
import { Mic, Activity, MessageSquare, Compass, ShieldAlert } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ThreatAnalysisResult } from '../../shared/types/safety.types';

interface RiskBreakdownPanelProps {
  analysis: ThreatAnalysisResult | null;
}

export const RiskBreakdownPanel: React.FC<RiskBreakdownPanelProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <Card title="Explainable Sensor Fusion Breakdown" subtitle="Real-time multi-modal risk weight analysis">
        <div className="text-sm text-muted py-8 text-center leading-relaxed">
          Guardian sensor stream active. Awaiting real-time acoustic, kinetic, or semantic distress input.
        </div>
      </Card>
    );
  }

  const { breakdown, riskScore, riskLevel, explanation, recommendedAction } = analysis;

  const modalities = [
    {
      name: 'Acoustic Decibels & Stress',
      weight: breakdown.acousticWeight,
      max: 35,
      icon: <Mic className="w-4 h-4 text-sky-400" />,
      desc: '35% Acoustic Weight',
    },
    {
      name: 'Kinetic Motion Acceleration',
      weight: breakdown.motionWeight,
      max: 30,
      icon: <Activity className="w-4 h-4 text-indigo-400" />,
      desc: '30% Motion Weight',
    },
    {
      name: 'Semantic Text Analysis',
      weight: breakdown.textWeight,
      max: 25,
      icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
      desc: '25% Semantic Weight',
    },
    {
      name: 'Contextual Time & Location',
      weight: breakdown.contextualWeight,
      max: 10,
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      desc: '10% Context Weight',
    },
  ];

  return (
    <Card
      title="Explainable Sensor Fusion Breakdown"
      subtitle="Transparent multi-modal risk weighting engine"
      action={<Badge level={riskLevel} text={`${riskLevel} (${riskScore}/100)`} />}
    >
      <div className="flex flex-col gap-5">
        {/* Modality Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modalities.map((m) => {
            const percentage = Math.round((m.weight / m.max) * 100);
            return (
              <div key={m.name} className="bg-stage rounded-2xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                    {m.icon}
                    <span>{m.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-muted">{m.weight}/{m.max} pts</span>
                </div>

                {/* METER BAR WITH role="meter" */}
                <div
                  role="meter"
                  aria-valuenow={m.weight}
                  aria-valuemin={0}
                  aria-valuemax={m.max}
                  aria-label={m.name}
                  className="w-full h-2.5 rounded-full bg-surface border border-border overflow-hidden"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      riskLevel === 'CRITICAL' ? 'bg-critical' : 'bg-accent'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted mt-1.5 block font-mono">{m.desc}</span>
              </div>
            );
          })}
        </div>

        {/* AI Synthesis */}
        <div className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-text-primary">Guardian Engine Synthesis</span>
            <p className="text-muted leading-relaxed">{explanation}</p>
            <span className="font-medium text-accent-light mt-1">Recommended: {recommendedAction}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
