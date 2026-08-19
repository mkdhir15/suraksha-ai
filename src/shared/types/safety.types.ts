export type RiskLevel = 'SAFE' | 'CAUTION' | 'CRITICAL';

export interface ThreatAnalysisInput {
  textSnippet?: string;
  audioFeatures?: {
    decibels: number;
    pitchHz: number;
    stressProbability: number;
  };
  motionFeatures?: {
    accelerationMagnitude: number;
    isRapidMovement: boolean;
    freefallDetected: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ThreatAnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  breakdown: {
    acousticWeight: number;
    motionWeight: number;
    textWeight: number;
    contextualWeight: number;
  };
  explanation: string;
  recommendedAction: string;
  timestamp: string;
}

export interface DriverVerificationInput {
  licensePlate: string;
  driverName?: string;
  cabCompany?: string;
}

export interface DriverVerificationResult {
  licensePlate: string;
  driverName: string;
  cabCompany: string;
  isVerified: boolean;
  trustScore: number; // 0 to 100
  flaggedAnomalies: string[];
  lastInspectedDate: string;
}

export interface SafeRouteInput {
  origin: { latitude: number; longitude: number; address?: string };
  destination: { latitude: number; longitude: number; address?: string };
  travelMode?: 'walking' | 'driving' | 'transit';
}

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  streetName: string;
  lightingScore: number; // 0-100
  crowdDensityScore: number; // 0-100
  incidentHistoryScore: number; // 0-100
  safetyIndex: number; // 0-100
}

export interface SafeRouteResult {
  routeId: string;
  overallSafetyIndex: number;
  recommendedRoute: RouteWaypoint[];
  alternateRoute?: RouteWaypoint[];
  riskFactors: string[];
  travelTimeMinutes: number;
}

export interface RouteTelemetryInput {
  originAddress: string;
  destinationAddress: string;
  currentCoords?: { latitude: number; longitude: number };
}

export interface RouteTelemetryResult {
  fastestRouteScore: number;
  safestRouteScore: number;
  metrics: {
    lightingLux: number; // 0-100
    incidentScore: number; // 0-100
    crowdDensity: number; // 0-100
    policeProximityKm: number; // in km
  };
  recommendation: string;
  timestamp: string;
}

export interface RouteDeviationInput {
  routeId?: string;
  currentCoords: { latitude: number; longitude: number };
  expectedCorridor?: Array<{ latitude: number; longitude: number }>;
  isStalled?: boolean;
}

export interface RouteDeviationResult {
  deviationMeters: number;
  deviationPercent: number;
  status: 'ON_TRACK' | 'DEVIATED' | 'EXTENDED_STALL';
  level2AlertTriggered: boolean;
  alertMessage: string;
  currentCoords: { latitude: number; longitude: number };
  timestamp: string;
}

export interface EscortCompanion {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  tripsCompleted: number;
  distanceKm: number;
  estimatedArrivalMin: number;
  isVerifiedBadge: boolean;
  contactNumber: string;
}

export type EscalationLevel = 1 | 2 | 3;

export interface EscalationState {
  currentLevel: EscalationLevel;
  level1WarningSent: boolean;
  level2SilentContactTriggered: boolean;
  level3EmergencyDispatched: boolean;
  activeTimers: string[];
  logs: Array<{ timestamp: string; action: string; level: EscalationLevel }>;
}

export interface OfflineAction {
  id: string;
  type: 'SOS_TRIGGER' | 'CHECK_IN' | 'LOCATION_PING';
  payload: Record<string, unknown>;
  timestamp: number;
}
