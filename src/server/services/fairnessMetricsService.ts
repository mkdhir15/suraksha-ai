export interface DemographicMetric {
  groupLabel: string;
  sampleSize: number;
  falsePositiveRate: number; // percentage
  falseNegativeRate: number; // percentage
  parityRatio: number;
}

export interface CalibrationPoint {
  predictedRiskBin: string; // e.g. "0-20%", "20-40%"
  predictedMean: number;
  actualIncidentRate: number;
}

export interface ModelChangelogEntry {
  version: string;
  releaseDate: string;
  description: string;
  parityImprovement: string;
}

export function getFairnessMetrics(sensitivityThreshold = 50) {
  // Base false positive rates at standard sensitivity (50)
  // Higher sensitivity (e.g. 80) -> slightly higher false positive rate
  const factor = sensitivityThreshold / 50;

  const demographicParity: DemographicMetric[] = [
    {
      groupLabel: 'Urban Commuter Cohort A',
      sampleSize: 14200,
      falsePositiveRate: Number((2.1 * factor).toFixed(1)),
      falseNegativeRate: 0.4,
      parityRatio: 0.98,
    },
    {
      groupLabel: 'Suburban Transit Cohort B',
      sampleSize: 11800,
      falsePositiveRate: Number((2.3 * factor).toFixed(1)),
      falseNegativeRate: 0.5,
      parityRatio: 0.96,
    },
    {
      groupLabel: 'Hostel Student Cohort C',
      sampleSize: 9500,
      falsePositiveRate: Number((2.0 * factor).toFixed(1)),
      falseNegativeRate: 0.3,
      parityRatio: 0.99,
    },
    {
      groupLabel: 'Night Shift Worker Cohort D',
      sampleSize: 8100,
      falsePositiveRate: Number((2.4 * factor).toFixed(1)),
      falseNegativeRate: 0.6,
      parityRatio: 0.95,
    },
  ];

  const calibrationPlot: CalibrationPoint[] = [
    { predictedRiskBin: '0–20% (Low)', predictedMean: 10, actualIncidentRate: 9.8 },
    { predictedRiskBin: '20–40% (Mild)', predictedMean: 30, actualIncidentRate: 29.2 },
    { predictedRiskBin: '40–60% (Moderate)', predictedMean: 50, actualIncidentRate: 51.1 },
    { predictedRiskBin: '60–80% (High)', predictedMean: 70, actualIncidentRate: 69.5 },
    { predictedRiskBin: '80–100% (Critical)', predictedMean: 90, actualIncidentRate: 91.0 },
  ];

  const changelog: ModelChangelogEntry[] = [
    {
      version: 'v2.4.0-guardian',
      releaseDate: '2026-08-01',
      description: 'Acoustic decibel normalizer re-calibrated across low-power micro-array microphones.',
      parityImprovement: '+3.2% Parity Equalization',
    },
    {
      version: 'v2.3.1-fusion',
      releaseDate: '2026-06-15',
      description: 'Kinetic acceleration thresholds adjusted for rapid transit deceleration false alarms.',
      parityImprovement: '-1.8% False Positives',
    },
    {
      version: 'v2.2.0-baseline',
      releaseDate: '2026-04-10',
      description: 'Initial multi-modal risk weighting audit across demographic transit cohorts.',
      parityImprovement: 'Baseline Audit Established',
    },
  ];

  return {
    sensitivityThreshold,
    demographicParity,
    calibrationPlot,
    changelog,
  };
}
