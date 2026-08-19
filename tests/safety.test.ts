import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server/app';
import { calculateRiskFusion } from '../src/server/services/riskFusionService';
import { verifyDriverInfo } from '../src/server/services/driverVerificationService';
import {
  createInitialEscalationState,
  escalateState,
} from '../src/server/services/escalationService';

const app = createApp();

describe('Suraksha AI Backend & Safety API', () => {
  // 1. Healthz check
  it('GET /healthz returns 200 with status ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Suraksha AI');
  });

  // 2. Threat Analysis Endpoint (Valid Input)
  it('POST /api/safety/analyze-threat returns 200 and schema-valid response', async () => {
    const payload = {
      textSnippet: 'Emergency help needed',
      audioFeatures: { decibels: 85, pitchHz: 300, stressProbability: 0.8 },
      motionFeatures: { accelerationMagnitude: 2.2, isRapidMovement: true, freefallDetected: false },
    };

    const res = await request(app).post('/api/safety/analyze-threat').send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('riskScore');
    expect(res.body).toHaveProperty('riskLevel');
    expect(res.body).toHaveProperty('breakdown');
    expect(res.body.breakdown).toHaveProperty('acousticWeight');
  });

  // 3. Threat Analysis Validation Failure
  it('POST /api/safety/analyze-threat returns 400 on Zod schema invalid data', async () => {
    const payload = {
      audioFeatures: { decibels: 'INVALID_STRING_INSTEAD_OF_NUMBER' },
    };

    const res = await request(app).post('/api/safety/analyze-threat').send(payload);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid Request Data');
  });

  // 4. Driver Verification (Clean vs Flagged)
  it('POST /api/safety/verify-driver checks clean and flagged plates', async () => {
    // Clean Plate
    const cleanRes = await request(app)
      .post('/api/safety/verify-driver')
      .send({ licensePlate: 'KA01AB1234' });

    expect(cleanRes.status).toBe(200);
    expect(cleanRes.body.isVerified).toBe(true);
    expect(cleanRes.body.trustScore).toBeGreaterThanOrEqual(80);

    // Flagged Plate
    const flaggedRes = await request(app)
      .post('/api/safety/verify-driver')
      .send({ licensePlate: 'FLAGGED999' });

    expect(flaggedRes.status).toBe(200);
    expect(flaggedRes.body.isVerified).toBe(false);
    expect(flaggedRes.body.flaggedAnomalies.length).toBeGreaterThan(0);
  });

  // 5. Safe Route Engine Endpoint
  it('POST /api/safety/safe-route returns recommended waypoints and DSI index', async () => {
    const res = await request(app)
      .post('/api/safety/safe-route')
      .send({
        origin: { latitude: 12.9716, longitude: 77.5946 },
        destination: { latitude: 12.9352, longitude: 77.6245 },
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('overallSafetyIndex');
    expect(res.body.recommendedRoute.length).toBe(4);
  });
});

describe('Pure Safety Services Unit Tests', () => {
  it('calculateRiskFusion computes correct score and risk level for critical input', () => {
    const result = calculateRiskFusion({
      textSnippet: 'SOS attack help gun',
      audioFeatures: { decibels: 95, pitchHz: 450, stressProbability: 0.95 },
      motionFeatures: { accelerationMagnitude: 4.5, isRapidMovement: true, freefallDetected: true },
    });

    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.riskScore).toBeGreaterThanOrEqual(71);
  });

  it('verifyDriverInfo flags suspicious license plates', () => {
    const result = verifyDriverInfo({ licensePlate: 'FLAGGED777' });
    expect(result.isVerified).toBe(false);
    expect(result.trustScore).toBeLessThan(30);
  });

  it('escalationService transitions through levels correctly', () => {
    const initial = createInitialEscalationState();
    expect(initial.currentLevel).toBe(1);

    const level2 = escalateState(initial, 2, 'Silent beacon activated');
    expect(level2.currentLevel).toBe(2);
    expect(level2.level2SilentContactTriggered).toBe(true);

    const level3 = escalateState(level2, 3, 'High danger panic button');
    expect(level3.currentLevel).toBe(3);
    expect(level3.level3EmergencyDispatched).toBe(true);
  });
});
