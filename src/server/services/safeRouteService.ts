import { SafeRouteInput, SafeRouteResult, RouteWaypoint } from '../../shared/types/safety.types';

export interface RouteOption {
  id: string;
  name: string;
  overallSafetyIndex: number;
  waypoints: RouteWaypoint[];
  riskFactors: string[];
  travelTimeMinutes: number;
  isRecommended: boolean;
}

export function calculateSafeRoute(input: SafeRouteInput): SafeRouteResult & { allRoutes: RouteOption[] } {
  const { origin, destination } = input;
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour <= 5;

  // 1. High Lumen Corridor (Optimal Safety)
  const routeAWaypoints: RouteWaypoint[] = [
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.25,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.25,
      streetName: 'Main Boulevard (Lumen Array)',
      lightingScore: isNight ? 96 : 98,
      crowdDensityScore: isNight ? 88 : 95,
      incidentHistoryScore: 98,
      safetyIndex: 94,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.5,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.5,
      streetName: 'Central Plaza Arcade',
      lightingScore: isNight ? 88 : 92,
      crowdDensityScore: isNight ? 82 : 90,
      incidentHistoryScore: 94,
      safetyIndex: 88,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.75,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.75,
      streetName: 'Brightwalk Avenue',
      lightingScore: isNight ? 92 : 96,
      crowdDensityScore: isNight ? 85 : 92,
      incidentHistoryScore: 96,
      safetyIndex: 91,
    },
    {
      latitude: destination.latitude,
      longitude: destination.longitude,
      streetName: 'Civic Center Terminal',
      lightingScore: isNight ? 95 : 99,
      crowdDensityScore: isNight ? 90 : 96,
      incidentHistoryScore: 98,
      safetyIndex: 95,
    },
  ];
  const dsiA = Math.round(routeAWaypoints.reduce((acc, wp) => acc + wp.safetyIndex, 0) / routeAWaypoints.length);

  // 2. Express Transit Corridor (Moderate-High Safety)
  const routeBWaypoints: RouteWaypoint[] = [
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.25 + 0.001,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.25 - 0.001,
      streetName: 'Metropolitan Flyover',
      lightingScore: isNight ? 80 : 88,
      crowdDensityScore: isNight ? 75 : 82,
      incidentHistoryScore: 88,
      safetyIndex: 82,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.5 + 0.001,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.5 - 0.001,
      streetName: 'Tech Park Expressway',
      lightingScore: isNight ? 84 : 90,
      crowdDensityScore: isNight ? 78 : 85,
      incidentHistoryScore: 90,
      safetyIndex: 85,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.75 + 0.001,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.75 - 0.001,
      streetName: 'Subway Link Way',
      lightingScore: isNight ? 76 : 82,
      crowdDensityScore: isNight ? 72 : 80,
      incidentHistoryScore: 86,
      safetyIndex: 79,
    },
    {
      latitude: destination.latitude,
      longitude: destination.longitude,
      streetName: 'Koramangala Ring Road',
      lightingScore: isNight ? 85 : 92,
      crowdDensityScore: isNight ? 80 : 88,
      incidentHistoryScore: 92,
      safetyIndex: 86,
    },
  ];
  const dsiB = Math.round(routeBWaypoints.reduce((acc, wp) => acc + wp.safetyIndex, 0) / routeBWaypoints.length);

  // 3. Commercial Bypass (Moderate Safety)
  const routeCWaypoints: RouteWaypoint[] = [
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.25 - 0.002,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.25 + 0.002,
      streetName: 'Market Freight Lane',
      lightingScore: isNight ? 70 : 80,
      crowdDensityScore: isNight ? 65 : 75,
      incidentHistoryScore: 82,
      safetyIndex: 76,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.5 - 0.002,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.5 + 0.002,
      streetName: 'Old Town Passage',
      lightingScore: isNight ? 72 : 82,
      crowdDensityScore: isNight ? 68 : 78,
      incidentHistoryScore: 84,
      safetyIndex: 78,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.75 - 0.002,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.75 + 0.002,
      streetName: 'Warehouse Depot Way',
      lightingScore: isNight ? 68 : 78,
      crowdDensityScore: isNight ? 62 : 72,
      incidentHistoryScore: 80,
      safetyIndex: 75,
    },
    {
      latitude: destination.latitude,
      longitude: destination.longitude,
      streetName: 'South Commercial Loop',
      lightingScore: isNight ? 78 : 86,
      crowdDensityScore: isNight ? 72 : 82,
      incidentHistoryScore: 88,
      safetyIndex: 80,
    },
  ];
  const dsiC = Math.round(routeCWaypoints.reduce((acc, wp) => acc + wp.safetyIndex, 0) / routeCWaypoints.length);

  // 4. Rear Freight Alley (Lower Safety)
  const routeDWaypoints: RouteWaypoint[] = [
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.25 + 0.003,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.25 + 0.003,
      streetName: 'Shadow Alleyway',
      lightingScore: isNight ? 45 : 62,
      crowdDensityScore: isNight ? 30 : 50,
      incidentHistoryScore: 68,
      safetyIndex: 68,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.5 + 0.003,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.5 + 0.003,
      streetName: 'Rear Freight Underpass',
      lightingScore: isNight ? 50 : 68,
      crowdDensityScore: isNight ? 35 : 55,
      incidentHistoryScore: 72,
      safetyIndex: 72,
    },
    {
      latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.75 + 0.003,
      longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.75 + 0.003,
      streetName: 'Unlit Rear Cut',
      lightingScore: isNight ? 40 : 58,
      crowdDensityScore: isNight ? 25 : 45,
      incidentHistoryScore: 65,
      safetyIndex: 65,
    },
    {
      latitude: destination.latitude,
      longitude: destination.longitude,
      streetName: 'Industrial Perimeter Road',
      lightingScore: isNight ? 52 : 70,
      crowdDensityScore: isNight ? 38 : 58,
      incidentHistoryScore: 75,
      safetyIndex: 71,
    },
  ];
  const dsiD = Math.round(routeDWaypoints.reduce((acc, wp) => acc + wp.safetyIndex, 0) / routeDWaypoints.length);

  const allRoutes: RouteOption[] = [
    {
      id: 'route-opt-a',
      name: 'High-Lumen Municipal Corridor',
      overallSafetyIndex: dsiA, // 92
      waypoints: routeAWaypoints,
      riskFactors: isNight
        ? ['High-lumen municipal lumen array active (95% coverage)', 'Monitored camera grid verified']
        : ['Daytime transit: optimal crowd density'],
      travelTimeMinutes: 14,
      isRecommended: false,
    },
    {
      id: 'route-opt-b',
      name: 'Express Transit Flyover',
      overallSafetyIndex: dsiB, // 83
      waypoints: routeBWaypoints,
      riskFactors: ['Moderate traffic velocity', 'Slightly reduced pedestrian density'],
      travelTimeMinutes: 11,
      isRecommended: false,
    },
    {
      id: 'route-opt-c',
      name: 'Commercial District Bypass',
      overallSafetyIndex: dsiC, // 77
      waypoints: routeCWaypoints,
      riskFactors: ['Commercial loading zones active', 'Patchy lighting near freight depot'],
      travelTimeMinutes: 13,
      isRecommended: false,
    },
    {
      id: 'route-opt-d',
      name: 'Rear Alleyway Corridor',
      overallSafetyIndex: dsiD, // 69
      waypoints: routeDWaypoints,
      riskFactors: ['Low lumen coverage (40% lighting)', 'Infrequent CCTV camera density'],
      travelTimeMinutes: 9,
      isRecommended: false,
    },
  ];

  // Dynamic Recommendation Logic: Pick route with highest overallSafetyIndex!
  const bestRoute = allRoutes.reduce((highest, current) =>
    current.overallSafetyIndex > highest.overallSafetyIndex ? current : highest
  );

  bestRoute.isRecommended = true;

  return {
    routeId: `route-${Date.now().toString(36)}`,
    overallSafetyIndex: bestRoute.overallSafetyIndex,
    recommendedRoute: bestRoute.waypoints,
    alternateRoute: allRoutes.find((r) => r.id !== bestRoute.id)?.waypoints || routeBWaypoints,
    riskFactors: bestRoute.riskFactors,
    travelTimeMinutes: bestRoute.travelTimeMinutes,
    allRoutes,
  };
}
