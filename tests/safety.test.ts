import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server/app';
import { calculateRiskFusion } from '../src/server/services/riskFusionService';
import { verifyDriverInfo } from '../src/server/services/driverVerificationService';
import { calculateSafeRoute } from '../src/server/services/safeRouteService';
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
    const cleanRes = await request(app)
      .post('/api/safety/verify-driver')
      .send({ licensePlate: 'KA01AB1234' });

    expect(cleanRes.status).toBe(200);
    expect(cleanRes.body.isVerified).toBe(true);
    expect(cleanRes.body.trustScore).toBeGreaterThanOrEqual(80);

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

  // 6. Route Telemetry Endpoint
  it('POST /api/safety/route-telemetry returns live scores comparing fastest vs safest route', async () => {
    const res = await request(app)
      .post('/api/safety/route-telemetry')
      .send({
        originAddress: 'Central Tech Station',
        destinationAddress: 'Koramangala Hub',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fastestRouteScore');
    expect(res.body).toHaveProperty('safestRouteScore');
    expect(res.body.safestRouteScore).toBeGreaterThan(res.body.fastestRouteScore);
    expect(res.body.metrics).toHaveProperty('lightingLux');
  });

  // 7. Route Deviation Endpoint
  it('POST /api/safety/route-deviation evaluates GPS corridor offset and triggers Level 2 alert if deviated', async () => {
    // Normal / On Track
    const onTrackRes = await request(app)
      .post('/api/safety/route-deviation')
      .send({ currentCoords: { latitude: 12.9716, longitude: 77.5946 } });

    expect(onTrackRes.status).toBe(200);
    expect(onTrackRes.body.status).toBe('ON_TRACK');
    expect(onTrackRes.body.level2AlertTriggered).toBe(false);

    // Deviated (>300m off route)
    const deviatedRes = await request(app)
      .post('/api/safety/route-deviation')
      .send({ currentCoords: { latitude: 12.9782, longitude: 77.6012 } });

    expect(deviatedRes.status).toBe(200);
    expect(deviatedRes.body.status).toBe('DEVIATED');
    expect(deviatedRes.body.level2AlertTriggered).toBe(true);
  });
});

describe('Pure Safety Services Unit & Integration Tests', () => {
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

  it('Dead-Man switch expiration seamlessly escalates EscalationLadder to Level 3 Active', () => {
    const state = createInitialEscalationState();
    const expiredState = escalateState(state, 3, "Dead-Man's Switch expired without PIN renewal");

    expect(expiredState.currentLevel).toBe(3);
    expect(expiredState.level3EmergencyDispatched).toBe(true);
    expect(expiredState.logs.some((l) => l.action.includes("Dead-Man's Switch expired"))).toBe(true);
  });

  it('calculateSafeRoute returns 4 distinct routes with non-identical DSI scores and recommends highest DSI', () => {
    const result = calculateSafeRoute({
      origin: { latitude: 12.9716, longitude: 77.5946 },
      destination: { latitude: 12.9352, longitude: 77.6245 },
    });

    expect(result.allRoutes.length).toBe(4);

    const dsiScores = result.allRoutes.map((r) => r.overallSafetyIndex);
    const uniqueScores = new Set(dsiScores);

    expect(uniqueScores.size).toBe(4);

    const highestDSI = Math.max(...dsiScores);
    const recommended = result.allRoutes.find((r) => r.isRecommended);

    expect(recommended).toBeDefined();
    expect(recommended?.overallSafetyIndex).toBe(highestDSI);
  });
});
