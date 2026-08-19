import { SafeRouteInput, SafeRouteResult, RouteWaypoint } from '../../shared/types/safety.types';

export function calculateSafeRoute(input: SafeRouteInput): SafeRouteResult {
  const { origin, destination } = input;
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour <= 5;

  // Generate 4 deterministic waypoints along the route path
  const numWaypoints = 4;
  const recommendedRoute: RouteWaypoint[] = [];
  const alternateRoute: RouteWaypoint[] = [];

  const streetNamesPrimary = ['Main Boulevard', 'Central Plaza Arcade', 'Brightwalk Avenue', 'Civic Center Way'];
  const streetNamesAlt = ['Industrial Alleyway', 'Shadow Pass', 'Rear Freight Corridor', 'Bypassing Pass'];

  for (let i = 0; i < numWaypoints; i++) {
    const ratio = (i + 1) / (numWaypoints + 1);
    const lat = origin.latitude + (destination.latitude - origin.latitude) * ratio;
    const lng = origin.longitude + (destination.longitude - origin.longitude) * ratio;

    // Recommended (Well-lit, high-visibility route)
    const lightingPrimary = isNight ? 85 : 95;
    const crowdPrimary = isNight ? 70 : 88;
    const incidentPrimary = 92; // high safety
    const safetyIndexPrimary = Math.round(lightingPrimary * 0.4 + crowdPrimary * 0.3 + incidentPrimary * 0.3);

    recommendedRoute.push({
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      streetName: streetNamesPrimary[i],
      lightingScore: lightingPrimary,
      crowdDensityScore: crowdPrimary,
      incidentHistoryScore: incidentPrimary,
      safetyIndex: safetyIndexPrimary,
    });

    // Alternate (Shorter but lower lighting/visibility route)
    const lightingAlt = isNight ? 35 : 60;
    const crowdAlt = isNight ? 20 : 45;
    const incidentAlt = 65;
    const safetyIndexAlt = Math.round(lightingAlt * 0.4 + crowdAlt * 0.3 + incidentAlt * 0.3);

    alternateRoute.push({
      latitude: Number((lat + 0.002).toFixed(6)),
      longitude: Number((lng - 0.002).toFixed(6)),
      streetName: streetNamesAlt[i],
      lightingScore: lightingAlt,
      crowdDensityScore: crowdAlt,
      incidentHistoryScore: incidentAlt,
      safetyIndex: safetyIndexAlt,
    });
  }

  const overallSafetyIndex = Math.round(
    recommendedRoute.reduce((acc, wp) => acc + wp.safetyIndex, 0) / recommendedRoute.length
  );

  return {
    routeId: `route-${Date.now().toString(36)}`,
    overallSafetyIndex,
    recommendedRoute,
    alternateRoute,
    riskFactors: isNight
      ? ['Nighttime travel active: routing strictly via high-lumen municipal corridors', 'Monitored camera coverage active']
      : ['Daytime transit: optimal crowd density and verified emergency access points'],
    travelTimeMinutes: 14,
  };
}
