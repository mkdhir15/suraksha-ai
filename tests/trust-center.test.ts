import { describe, it, expect } from 'vitest';
import { runStalkerwareScan } from '../src/server/services/stalkerwareScanService';
import { simulateDeepfakeVerification } from '../src/server/services/deepfakeVerificationService';
import { deterministicCrisisFallback } from '../src/server/services/crisisClassifierService';
import { createEvidenceRecord, verifyEvidenceIntegrity } from '../src/server/services/evidenceLedgerService';
import { getFairnessMetrics } from '../src/server/services/fairnessMetricsService';

describe('SurakshaAI Trust Center Services Unit Tests', () => {
  // 1. Stalkerware Scan
  it('runStalkerwareScan returns consistent indicators and flagged count', () => {
    const result = runStalkerwareScan();
    expect(result.indicatorsScanned).toBe(4);
    expect(result.flaggedCount).toBe(2);
    expect(result.verdict).toBe('INDICATORS_FOUND');
    expect(result.indicators[0].remediationStep.title).toBeDefined();
  });

  // 2. Deepfake Verification
  it('simulateDeepfakeVerification calculates confidence breakdown', () => {
    const result = simulateDeepfakeVerification('Test Contact');
    expect(result.callerName).toBe('Test Contact');
    expect(result.overallConfidence).toBeLessThan(75);
    expect(result.verdict).toBe('SUSPICIOUS');
    expect(result.requiresCallbackVerification).toBe(true);
  });

  // 3. Crisis Signal Classifier
  it('deterministicCrisisFallback identifies panic keywords and returns structured grounding offer', () => {
    const crisisResult = deterministicCrisisFallback('I am having a panic attack and feel overwhelmed');
    expect(crisisResult.isCrisisDetected).toBe(true);
    expect(crisisResult.detectedCategory).toBe('ANXIETY_PANIC');
    expect(crisisResult.groundingExerciseRecommended).toBe(true);

    const normalResult = deterministicCrisisFallback('Just checking in on the evening schedule');
    expect(normalResult.isCrisisDetected).toBe(false);
  });

  // 4. Evidence Cryptographic Hashing
  it('createEvidenceRecord generates genuine SHA-256 hash and passes integrity verification', async () => {
    const record = await createEvidenceRecord('LEVEL_3_SOS_DISPATCH', {
      location: '12.9716, 77.5946',
      riskScore: 95,
      sensorSnapshot: 'Acoustic 90dB, Kinetic Freefall',
    });

    expect(record.sha256Hash).toBeDefined();
    expect(record.sha256Hash.length).toBeGreaterThan(16);

    const isVerified = await verifyEvidenceIntegrity(record);
    expect(isVerified).toBe(true);
  });

  // 5. AI Fairness Metrics & Slider
  it('getFairnessMetrics dynamically updates false positive rates based on sensitivity threshold', () => {
    const standard = getFairnessMetrics(50);
    const highSensitivity = getFairnessMetrics(80);

    expect(highSensitivity.demographicParity[0].falsePositiveRate).toBeGreaterThan(
      standard.demographicParity[0].falsePositiveRate
    );
  });
});
