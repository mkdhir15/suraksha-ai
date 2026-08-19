import { DriverVerificationInput, DriverVerificationResult } from '../../shared/types/safety.types';

// Seeded verified drivers & flagged plates database
const VERIFIED_REGISTRY: Record<string, { driverName: string; cabCompany: string; trustScore: number; lastInspectedDate: string }> = {
  'KA01AB1234': {
    driverName: 'Ramesh Kumar',
    cabCompany: 'Suraksha Shield Rides',
    trustScore: 98,
    lastInspectedDate: '2026-08-01',
  },
  'DL03XY9999': {
    driverName: 'Vikram Singh',
    cabCompany: 'Metro Express Cabs',
    trustScore: 94,
    lastInspectedDate: '2026-07-28',
  },
  'MH02CZ4321': {
    driverName: 'Suresh Patel',
    cabCompany: 'City Transit Safe',
    trustScore: 96,
    lastInspectedDate: '2026-08-10',
  },
};

const FLAGGED_PLATES = new Set(['FLAGGED999', 'SUSPICIOUS777', 'UNVERIFIED000']);

export function verifyDriverInfo(input: DriverVerificationInput): DriverVerificationResult {
  const sanitizedPlate = input.licensePlate.trim().toUpperCase().replace(/\s+/g, '');

  if (FLAGGED_PLATES.has(sanitizedPlate) || sanitizedPlate.includes('FLAG')) {
    return {
      licensePlate: sanitizedPlate,
      driverName: input.driverName || 'Unknown Driver',
      cabCompany: input.cabCompany || 'Unregulated Transit',
      isVerified: false,
      trustScore: 12,
      flaggedAnomalies: [
        'CRITICAL ANOMALY: Vehicle license plate linked to past route deviation alerts.',
        'Driver identity unverified with municipal transport database.',
        'Child-safety lock override detected or missing background badge.',
      ],
      lastInspectedDate: 'NEVER / UNVERIFIED',
    };
  }

  const match = VERIFIED_REGISTRY[sanitizedPlate];
  if (match) {
    return {
      licensePlate: sanitizedPlate,
      driverName: match.driverName,
      cabCompany: match.cabCompany,
      isVerified: true,
      trustScore: match.trustScore,
      flaggedAnomalies: [],
      lastInspectedDate: match.lastInspectedDate,
    };
  }

  // Standard clean unflagged driver fallback
  return {
    licensePlate: sanitizedPlate,
    driverName: input.driverName || 'Verified Independent Partner',
    cabCompany: input.cabCompany || 'City Registered Transit',
    isVerified: true,
    trustScore: 88,
    flaggedAnomalies: [],
    lastInspectedDate: '2026-08-15',
  };
}
