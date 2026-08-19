import { ThreatAnalysisInput, ThreatAnalysisResult, RiskLevel } from '../../shared/types/safety.types';
import { HIGH_THREAT_KEYWORDS } from '../../shared/constants/escalation.constants';

export function calculateRiskFusion(input: ThreatAnalysisInput): ThreatAnalysisResult {
  // 1. Text Modality Score (0 - 100)
  let textScore = 0;
  if (input.textSnippet) {
    const lower = input.textSnippet.toLowerCase();
    const keywordMatches = HIGH_THREAT_KEYWORDS.filter((kw) => lower.includes(kw)).length;
    textScore = Math.min(100, keywordMatches * 30 + (input.textSnippet.length > 50 ? 10 : 0));
  }

  // 2. Acoustic Modality Score (0 - 100)
  let acousticScore = 0;
  if (input.audioFeatures) {
    const { decibels, pitchHz, stressProbability } = input.audioFeatures;
    const dbFactor = Math.max(0, Math.min(1, (decibels - 60) / 40)); // 60dB normal, 100dB shout
    const pitchFactor = Math.max(0, Math.min(1, (pitchHz - 150) / 350));
    acousticScore = Math.round((dbFactor * 0.4 + pitchFactor * 0.2 + stressProbability * 0.4) * 100);
  }

  // 3. Motion Modality Score (0 - 100)
  let motionScore = 0;
  if (input.motionFeatures) {
    const { accelerationMagnitude, isRapidMovement, freefallDetected } = input.motionFeatures;
    let score = Math.min(100, (accelerationMagnitude / 3.0) * 50);
    if (isRapidMovement) score += 30;
    if (freefallDetected) score += 50;
    motionScore = Math.min(100, Math.round(score));
  }

  // 4. Contextual Time/Location Score (0 - 100)
  let contextScore = 15; // baseline urban risk
  const currentHour = new Date().getHours();
  if (currentHour >= 22 || currentHour <= 5) {
    contextScore += 35; // Night hour risk elevation
  }

  // Weighted Modality Fusion Weights
  const wAcoustic = 0.35;
  const wMotion = 0.30;
  const wText = 0.25;
  const wContext = 0.10;

  const rawScore =
    acousticScore * wAcoustic +
    motionScore * wMotion +
    textScore * wText +
    contextScore * wContext;

  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let riskLevel: RiskLevel = 'SAFE';
  if (riskScore >= 71) {
    riskLevel = 'CRITICAL';
  } else if (riskScore >= 31) {
    riskLevel = 'CAUTION';
  }

  let explanation = 'All monitored acoustic, kinetic, and textual parameters remain within normal parameters.';
  let recommendedAction = 'No action required. Guardian active in background.';

  if (riskLevel === 'CRITICAL') {
    explanation = 'CRITICAL THREAT: Elevated acoustic stress, sudden kinetic impact, or explicit distress signals detected.';
    recommendedAction = 'Triggering emergency priority ladder. Dispatching silent guardian alert.';
  } else if (riskLevel === 'CAUTION') {
    explanation = 'MODERATE ELEVATION: Environmental noise, rapid motion, or elevated voice pitch detected.';
    recommendedAction = 'Escalating check-in monitor frequency. Preparing covert contact beacon.';
  }

  return {
    riskScore,
    riskLevel,
    breakdown: {
      acousticWeight: Math.round(acousticScore * wAcoustic),
      motionWeight: Math.round(motionScore * wMotion),
      textWeight: Math.round(textScore * wText),
      contextualWeight: Math.round(contextScore * wContext),
    },
    explanation,
    recommendedAction,
    timestamp: new Date().toISOString(),
  };
}
