import React, { useState } from 'react';
import { Sliders, ShieldCheck, BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { getFairnessMetrics } from '../../../server/services/fairnessMetricsService';

export const FairnessReportPage: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(50);
  const metrics = getFairnessMetrics(sensitivity);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">AI Fairness & Bias Audit Dashboard</h1>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Transparent Parity & Calibration
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Monitors demographic parity, calibration curve alignment, and false-positive distribution across transit cohorts.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Sensitivity Threshold Slider Card */}
      <Card
        title="Interactive Risk Sensitivity Threshold"
        subtitle="Adjusting sensitivity balances false alarm rates against borderline signal detection."
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-muted flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-accent" /> Sensitivity Index:
            </span>
            <span className="text-accent font-bold text-sm">{sensitivity}/100</span>
          </div>

          <input
            type="range"
            min={10}
            max={90}
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full h-2 bg-stage rounded-lg appearance-none cursor-pointer accent-accent"
          />

          <div className="p-3 rounded-xl bg-stage border border-border text-xs text-muted leading-relaxed">
            <span className="font-bold text-text-primary">Tradeoff Explanation: </span>
            {sensitivity > 65
              ? 'Higher sensitivity captures subtle acoustic/motion anomalies faster, but increases false-positive rates across quiet transit cohorts.'
              : sensitivity < 35
              ? 'Lower sensitivity reduces false alerts, but may delay escalation during borderline stress signals.'
              : 'Balanced threshold: Maintains optimal demographic parity ratio (0.95–0.99) across all commuter cohorts.'}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demographic Parity Metrics */}
        <Card
          title="Demographic Parity Metrics"
          subtitle="False-positive rate (FPR) and equal opportunity ratios by anonymized commuter cohort"
        >
          <div className="flex flex-col gap-4">
            {metrics.demographicParity.map((cohort) => (
              <div key={cohort.groupLabel} className="bg-stage p-4 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-primary">{cohort.groupLabel}</span>
                  <span className="text-xs font-mono text-accent font-bold">
                    FPR: {cohort.falsePositiveRate}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface overflow-hidden mb-2">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, cohort.falsePositiveRate * 20)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted font-mono">
                  <span>Sample: {cohort.sampleSize.toLocaleString()}</span>
                  <span>Parity Ratio: {cohort.parityRatio}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Calibration Curve Plot */}
        <Card
          title="Model Risk Calibration Curve"
          subtitle="Predicted risk probability vs seeded actual incident rate"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-muted pb-2 border-b border-border font-mono">
              <span>Risk Bin</span>
              <span>Predicted</span>
              <span>Actual Rate</span>
            </div>

            {metrics.calibrationPlot.map((point) => (
              <div key={point.predictedRiskBin} className="flex items-center justify-between text-xs font-mono py-1">
                <span className="text-text-primary font-medium w-36">{point.predictedRiskBin}</span>
                <span className="text-muted">{point.predictedMean}%</span>
                <span className="text-emerald-400 font-bold">{point.actualIncidentRate}%</span>
              </div>
            ))}

            <div className="mt-4 p-3 rounded-xl bg-stage border border-border text-xs text-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Calibration Mean Absolute Error: 0.8% (Optimal Alignment)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Model Version Changelog */}
      <Card
        title="Model Governance Changelog"
        subtitle="Version release history and fair-ML audit updates"
      >
        <div className="flex flex-col gap-3">
          {metrics.changelog.map((entry) => (
            <div key={entry.version} className="p-4 rounded-2xl bg-stage border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent">{entry.version}</span>
                  <span className="text-[10px] text-muted font-mono">{entry.releaseDate}</span>
                </div>
                <p className="text-xs text-muted mt-1">{entry.description}</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {entry.parityImprovement}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
