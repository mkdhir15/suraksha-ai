import React from 'react';
import { SafeRouteMap } from '../components/SafeRouteMap';
import { DriverVerificationCard } from '../components/DriverVerificationCard';
import { EscortMatcher } from '../components/EscortMatcher';

export const RoutePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="p-6 rounded-3xl bg-surface border border-border">
        <h1 className="text-xl font-bold text-text-primary">Safe Transit & Route Navigation</h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Predictive dynamic safety index, cab anomaly verification, and verified escort matching for solo commuters.
        </p>
      </div>

      <SafeRouteMap />
      <DriverVerificationCard />
      <EscortMatcher />
    </div>
  );
};
