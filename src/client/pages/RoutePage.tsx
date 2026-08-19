import React from 'react';
import { JourneyGuardianDashboard } from '../components/JourneyGuardianDashboard';
import { SafeRouteMap } from '../components/SafeRouteMap';
import { DriverVerificationCard } from '../components/DriverVerificationCard';
import { EscortMatcher } from '../components/EscortMatcher';

export const RoutePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <JourneyGuardianDashboard />
      <SafeRouteMap />
      <DriverVerificationCard />
      <EscortMatcher />
    </div>
  );
};
