import React, { useState } from 'react';
import { Navigation, Sun, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { calculateSafeRoute, RouteOption } from '../../server/services/safeRouteService';

export const SafeRouteMap: React.FC = () => {
  const [routeResult] = useState(() =>
    calculateSafeRoute({
      origin: { latitude: 12.9716, longitude: 77.5946, address: 'Central Tech Station' },
      destination: { latitude: 12.9352, longitude: 77.6245, address: 'Koramangala Hub' },
    })
  );

  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    routeResult.allRoutes.find((r) => r.isRecommended)?.id || routeResult.allRoutes[0].id
  );

  const activeRoute: RouteOption =
    routeResult.allRoutes.find((r) => r.id === selectedRouteId) || routeResult.allRoutes[0];

  return (
    <Card
      title="Predictive Safe-Route Engine"
      subtitle="Dynamic Safety Index (DSI) computed via municipal lumen sensors, crowd density, and incident telemetry."
      action={
        <Badge
          level={activeRoute.overallSafetyIndex >= 85 ? 'SAFE' : activeRoute.overallSafetyIndex >= 75 ? 'CAUTION' : 'CRITICAL'}
          text={`DSI Index ${activeRoute.overallSafetyIndex}/100`}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {/* Route Selector Chips */}
        <div className="flex flex-wrap gap-2.5">
          {routeResult.allRoutes.map((route) => {
            const isSelected = route.id === activeRoute.id;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-md'
                    : 'bg-stage text-text-primary border-border hover:border-muted'
                }`}
              >
                <span>{route.name}</span>
                <span
                  className={`font-mono px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    route.overallSafetyIndex >= 85
                      ? isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-400'
                      : route.overallSafetyIndex >= 75
                      ? isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400'
                      : isSelected ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  DSI {route.overallSafetyIndex}
                </span>

                {route.isRecommended && (
                  <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-300 bg-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Visual Map Canvas / Path Render */}
        <div className="relative w-full h-52 rounded-2xl bg-stage border border-border overflow-hidden flex flex-col justify-between p-5">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Header Banner inside map */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <span className="font-bold text-text-primary flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-accent" /> {activeRoute.name}
            </span>
            <span className="font-mono text-muted">Est. Transit: {activeRoute.travelTimeMinutes} mins</span>
          </div>

          {/* Waypoint Nodes with Distinct DSI Scores */}
          <div className="relative z-10 flex items-center justify-between my-auto px-4">
            {activeRoute.waypoints.map((wp) => (
              <div key={wp.streetName} className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-md ${
                    wp.safetyIndex >= 85
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : wp.safetyIndex >= 75
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : wp.safetyIndex >= 65
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-critical text-white'
                  }`}
                >
                  {wp.safetyIndex}
                </div>
                <span className="text-[11px] text-text-primary font-medium max-w-[100px] truncate">
                  {wp.streetName}
                </span>
              </div>
            ))}
          </div>

          {/* Route Risk Summary Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-muted border-t border-border pt-2.5 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sun className="w-3.5 h-3.5" /> High Municipal Lumen Corridor
            </span>
            <span>Overall Safety Rating: {activeRoute.overallSafetyIndex}/100</span>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="flex flex-col gap-2">
          {activeRoute.riskFactors.map((factor) => (
            <div
              key={factor}
              className="flex items-center gap-2.5 text-xs text-muted bg-stage px-4 py-2.5 rounded-xl border border-border"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
