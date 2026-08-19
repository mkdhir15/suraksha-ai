import React, { useState } from 'react';
import { Navigation, Sun, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { SafeRouteResult } from '../../shared/types/safety.types';
import { calculateSafeRoute } from '../../server/services/safeRouteService';

export const SafeRouteMap: React.FC = () => {
  const [routeResult] = useState<SafeRouteResult>(() =>
    calculateSafeRoute({
      origin: { latitude: 12.9716, longitude: 77.5946, address: 'Central Tech Station' },
      destination: { latitude: 12.9352, longitude: 77.6245, address: 'Koramangala Hub' },
    })
  );

  const [activeTab, setActiveTab] = useState<'recommended' | 'alternate'>('recommended');

  const activeWaypoints =
    activeTab === 'recommended'
      ? routeResult.recommendedRoute
      : routeResult.alternateRoute || [];

  return (
    <Card
      title="Predictive Safe-Route Engine"
      subtitle="Dynamic Safety Index computed via municipal lumen sensors, crowd telemetry, and incident history."
      action={<Badge level="SAFE" text={`DSI Index ${routeResult.overallSafetyIndex}/100`} />}
    >
      <div className="flex flex-col gap-5">
        {/* Route Selector Tabs */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={activeTab === 'recommended' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended Safe Route (DSI {routeResult.overallSafetyIndex})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'alternate' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('alternate')}
          >
            Alternate Quick Path
          </Button>
        </div>

        {/* Visual Map Canvas / Path Render */}
        <div className="relative w-full h-48 rounded-2xl bg-stage border border-border overflow-hidden flex flex-col justify-between p-5">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Waypoint Nodes */}
          <div className="relative z-10 flex items-center justify-between my-auto px-6">
            {activeWaypoints.map((wp) => (
              <div key={wp.streetName} className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-md ${
                    wp.safetyIndex >= 75
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : wp.safetyIndex >= 50
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-critical text-white'
                  }`}
                >
                  {wp.safetyIndex}
                </div>
                <span className="text-[11px] text-text-primary font-medium max-w-[90px] truncate">
                  {wp.streetName}
                </span>
              </div>
            ))}
          </div>

          {/* Route Risk Summary Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-muted border-t border-border pt-2.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 text-accent" /> Est. Transit: {routeResult.travelTimeMinutes} mins
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sun className="w-3.5 h-3.5" /> High Municipal Lumen Lighting
            </span>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="flex flex-col gap-2">
          {routeResult.riskFactors.map((factor) => (
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
