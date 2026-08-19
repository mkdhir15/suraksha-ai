import React, { useState, useEffect } from 'react';
import { Navigation, ShieldCheck, AlertTriangle, Share2, MapPin, Sun, Activity, PhoneCall, Check, ExternalLink, Clock, ShieldAlert } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { RouteTelemetryResult, RouteDeviationResult } from '../../shared/types/safety.types';

interface SafeHaven {
  id: string;
  name: string;
  category: 'Fuel Station' | 'Hospital' | 'Police Checkpoint';
  distanceKm: number;
  openHours: string;
  address: string;
}

export const JourneyGuardianDashboard: React.FC = () => {
  const [origin, setOrigin] = useState('Central Tech Station');
  const [destination, setDestination] = useState('Koramangala Hub');
  const [isSimulating, setIsSimulating] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState(840); // 14 mins
  const [shareCopied, setShareCopied] = useState(false);
  const [activeReroute, setActiveReroute] = useState<string | null>(null);

  // Live telemetry state
  const [telemetry, setTelemetry] = useState<RouteTelemetryResult>({
    fastestRouteScore: 64,
    safestRouteScore: 92,
    metrics: {
      lightingLux: 88,
      incidentScore: 94,
      crowdDensity: 78,
      policeProximityKm: 0.4,
    },
    recommendation: 'Routing via High-Lumen Municipal Corridor for +28% higher DSI safety index.',
    timestamp: new Date().toISOString(),
  });

  // Live deviation state
  const [deviation, setDeviation] = useState<RouteDeviationResult>({
    deviationMeters: 45,
    deviationPercent: 4,
    status: 'ON_TRACK',
    level2AlertTriggered: false,
    alertMessage: 'Journey progressing normally along safe corridor.',
    currentCoords: { latitude: 12.9716, longitude: 77.5946 },
    timestamp: new Date().toISOString(),
  });

  const safeHavens: SafeHaven[] = [
    {
      id: 'sh-1',
      name: '24/7 Shell Fuel Station & Mart',
      category: 'Fuel Station',
      distanceKm: 0.3,
      openHours: '24/7 Open',
      address: 'Main Boulevard, Lane 4',
    },
    {
      id: 'sh-[#2]',
      name: 'Apollo Emergency Care Center',
      category: 'Hospital',
      distanceKm: 0.7,
      openHours: '24/7 Emergency Ward',
      address: 'Civic Center Terminal Rd',
    },
    {
      id: 'sh-3',
      name: 'Central Police Checkpoint #4',
      category: 'Police Checkpoint',
      distanceKm: 0.4,
      openHours: 'Manned 24/7 Patrol',
      address: 'Brightwalk Avenue Crossing',
    },
  ];

  // ETA countdown effect during active simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && etaSeconds > 0) {
      interval = setInterval(() => {
        setEtaSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, etaSeconds]);

  const handleFetchTelemetry = async () => {
    try {
      const res = await fetch('/api/safety/route-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originAddress: origin, destinationAddress: destination }),
      });
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch {
      // Fallback state retained
    }
  };

  const handleSimulateDeviation = async () => {
    setIsSimulating(true);
    // Simulate deviation coordinates (>350m off route)
    const offRouteCoords = { latitude: 12.9758, longitude: 77.5992 };
    try {
      const res = await fetch('/api/safety/route-deviation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCoords: offRouteCoords }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeviation(data);
      } else {
        setDeviation({
          deviationMeters: 420,
          deviationPercent: 42,
          status: 'DEVIATED',
          level2AlertTriggered: true,
          alertMessage: 'ALERT: Route deviation of 420m (42%) detected! Level 2 Silent Beacon triggered with coordinates (12.9758, 77.5992).',
          currentCoords: offRouteCoords,
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      setDeviation({
        deviationMeters: 420,
        deviationPercent: 42,
        status: 'DEVIATED',
        level2AlertTriggered: true,
        alertMessage: 'ALERT: Route deviation of 420m (42%) detected! Level 2 Silent Beacon triggered with coordinates (12.9758, 77.5992).',
        currentCoords: offRouteCoords,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSimulateStall = async () => {
    setIsSimulating(true);
    setDeviation({
      deviationMeters: 120,
      deviationPercent: 12,
      status: 'EXTENDED_STALL',
      level2AlertTriggered: true,
      alertMessage: 'WARNING: Extended stall (>5m) detected in low-lit transit zone. Escalating telemetry monitor.',
      currentCoords: { latitude: 12.9716, longitude: 77.5946 },
      timestamp: new Date().toISOString(),
    });
  };

  const handleResetTrack = () => {
    setIsSimulating(false);
    setEtaSeconds(840);
    setDeviation({
      deviationMeters: 45,
      deviationPercent: 4,
      status: 'ON_TRACK',
      level2AlertTriggered: false,
      alertMessage: 'Journey progressing normally along safe corridor.',
      currentCoords: { latitude: 12.9716, longitude: 77.5946 },
      timestamp: new Date().toISOString(),
    });
  };

  const handleShareTelemetry = () => {
    const link = `https://suraksha.ai/track/g-${Math.random().toString(36).substring(2, 8)}?token=secure`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  const handleReroute = (haven: SafeHaven) => {
    setActiveReroute(haven.name);
    setDeviation((prev) => ({
      ...prev,
      status: 'ON_TRACK',
      alertMessage: `Emergency Reroute active: Diverted to ${haven.name} (${haven.distanceKm} km).`,
    }));
  };

  const formattedEta = `${Math.floor(etaSeconds / 60)}m ${(etaSeconds % 60).toString().padStart(2, '0')}s`;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">Journey Guardian & Safe Route Live Dashboard</h1>
              <Badge level={deviation.status === 'DEVIATED' || deviation.status === 'EXTENDED_STALL' ? 'CAUTION' : 'SAFE'} />
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Real-time route safety index, geo-fencing anomaly detection, and trusted guardian telemetry broadcast.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleShareTelemetry}>
            {shareCopied ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Share2 className="w-4 h-4 mr-1" />}
            {shareCopied ? 'Telemetry Link Copied!' : 'Share Live Telemetry'}
          </Button>
        </div>
      </div>

      {/* Grid: Route Input & Live Safety Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Tracker Controls & Risk Score Comparison */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Origin / Destination Input Form */}
          <Card title="Active Route Corridor Configuration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Origin Point:</label>
                <div className="flex items-center gap-2 bg-stage px-3 py-2 rounded-xl border border-border">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="bg-transparent text-xs text-text-primary focus:outline-none w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Destination Target:</label>
                <div className="flex items-center gap-2 bg-stage px-3 py-2 rounded-xl border border-border">
                  <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent text-xs text-text-primary focus:outline-none w-full font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <Button size="sm" variant="outline" onClick={handleFetchTelemetry}>
                Recalculate Telemetry Scores
              </Button>

              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={handleSimulateDeviation}>
                  Simulate Route Deviation ({'>'}300m)
                </Button>
                <Button size="sm" variant="outline" onClick={handleSimulateStall}>
                  Simulate Extended Stall
                </Button>
                <Button size="sm" variant="secondary" onClick={handleResetTrack}>
                  Reset Corridor
                </Button>
              </div>
            </div>
          </Card>

          {/* Route Safety Index (0-100 Gauge & Comparison) */}
          <Card title="Route Safety Index & Telemetry Comparison">
            <div className="flex flex-col gap-6">
              {/* Comparison Bars: Fastest vs Safest */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stage border border-border flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted">Fastest Route (Direct Path)</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{telemetry.fastestRouteScore}/100 DSI</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface border border-border overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${telemetry.fastestRouteScore}%` }} />
                  </div>
                  <span className="text-[11px] text-muted font-mono">11 mins | Unlit alleys & lower crowd density</span>
                </div>

                <div className="p-4 rounded-2xl bg-stage border border-emerald-500/40 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">Safest Route (High-Lumen Corridor)</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{telemetry.safestRouteScore}/100 DSI</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface border border-border overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${telemetry.safestRouteScore}%` }} />
                  </div>
                  <span className="text-[11px] text-emerald-300 font-mono">14 mins | 98% Lumen coverage & CCTV grid</span>
                </div>
              </div>

              {/* 4 Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-surface p-3.5 rounded-xl border border-border flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-mono font-semibold flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Street Lighting
                  </span>
                  <span className="text-sm font-bold text-text-primary font-mono">{telemetry.metrics.lightingLux} Lux</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Optimal Coverage</span>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-border flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-mono font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Incident History
                  </span>
                  <span className="text-sm font-bold text-text-primary font-mono">{telemetry.metrics.incidentScore}/100</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Clean Zone</span>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-border flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-mono font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" /> Crowd Density
                  </span>
                  <span className="text-sm font-bold text-text-primary font-mono">{telemetry.metrics.crowdDensity}%</span>
                  <span className="text-[10px] text-muted font-mono">Active Foot Traffic</span>
                </div>

                <div className="bg-surface p-3.5 rounded-xl border border-border flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-mono font-semibold flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-sky-400" /> Police Proximity
                  </span>
                  <span className="text-sm font-bold text-text-primary font-mono">{telemetry.metrics.policeProximityKm} km</span>
                  <span className="text-[10px] text-sky-400 font-mono font-bold">Checkpoint Nearby</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Live Status Monitor & Safe Havens */}
        <div className="flex flex-col gap-8">
          {/* Real-Time Tracker & Anomaly Monitor Status */}
          <Card title="Real-Time Journey Monitor">
            <div className="flex flex-col gap-4">
              {/* Status Indicator */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  deviation.status === 'DEVIATED'
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : deviation.status === 'EXTENDED_STALL'
                    ? 'bg-critical/20 border-critical text-white'
                    : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {deviation.status === 'ON_TRACK' ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 animate-pulse" />
                  )}
                  <div>
                    <span className="text-xs font-bold block">
                      {deviation.status === 'ON_TRACK'
                        ? 'ON SAFE TRACK'
                        : deviation.status === 'DEVIATED'
                        ? 'ROUTE DEVIATION DETECTED (>300M)'
                        : 'EXTENDED STALL DETECTED (>5M)'}
                    </span>
                    <span className="text-[11px] text-muted font-mono">{deviation.alertMessage}</span>
                  </div>
                </div>
              </div>

              {/* ETA Countdown & Deviation metrics */}
              <div className="bg-stage p-4 rounded-2xl border border-border flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <div>
                    <span className="text-[10px] text-muted block uppercase">Estimated ETA</span>
                    <span className="font-bold text-text-primary text-sm">{formattedEta}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted block uppercase">Corridor Offset</span>
                  <span className="font-bold text-accent">{deviation.deviationMeters}m ({deviation.deviationPercent}%)</span>
                </div>
              </div>

              {/* Auto Alert Indicator */}
              {deviation.level2AlertTriggered && (
                <div className="p-3 rounded-xl bg-critical/20 border border-critical text-white text-xs flex items-center gap-2 font-bold animate-bounce">
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>Level 2 Silent Alert Triggered with GPS Coords!</span>
                </div>
              )}
            </div>
          </Card>

          {/* Safe Havens Along Route */}
          <Card title="Nearby Safe Havens Along Route">
            <div className="flex flex-col gap-3">
              {safeHavens.map((haven) => {
                const isRerouted = activeReroute === haven.name;
                return (
                  <div
                    key={haven.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isRerouted ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-stage border-border'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">{haven.name}</span>
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                          {haven.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted block mt-0.5 font-mono">
                        {haven.address} ({haven.distanceKm} km) • {haven.openHours}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant={isRerouted ? 'primary' : 'outline'}
                      onClick={() => handleReroute(haven)}
                      className="text-xs px-2.5 py-1"
                    >
                      {isRerouted ? (
                        <>
                          <Check className="w-3 h-3 mr-1" /> Rerouted
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3 h-3 mr-1" /> 1-Tap Reroute
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
