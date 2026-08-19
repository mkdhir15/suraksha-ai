import React, { useState, useEffect } from 'react';
import { UserCheck, Star, MapPin, PhoneCall, ShieldCheck } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { EscortCompanion } from '../../shared/types/safety.types';

export const EscortMatcher: React.FC = () => {
  const [companions, setCompanions] = useState<EscortCompanion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscort, setSelectedEscort] = useState<EscortCompanion | null>(null);

  useEffect(() => {
    fetch('/api/safety/escort-matcher?latitude=12.9716&longitude=77.5946')
      .then((res) => res.json())
      .then((data) => {
        setCompanions(data.companions || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Card
      title="Smart Escort Matcher"
      subtitle="Ranked companion match via proximity & community trust index"
    >
      {loading ? (
        <div className="py-8 text-center text-sm text-muted animate-pulse">
          Searching nearby verified safety guardians...
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companions.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedEscort?.id === c.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-stage hover:border-muted'
                }`}
                onClick={() => setSelectedEscort(c)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm text-text-primary">{c.name}</span>
                      {c.isVerifiedBadge && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5 font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{c.rating}</span>
                      <span className="text-muted">({c.tripsCompleted} trips)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-border">
                  <span className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-accent" /> {c.distanceKm} km away
                  </span>
                  <span className="font-medium text-text-primary">{c.estimatedArrivalMin} min ETA</span>
                </div>
              </div>
            ))}
          </div>

          {selectedEscort && (
            <div className="mt-2 p-4 rounded-2xl bg-surface border border-accent/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted block">Selected Safety Companion</span>
                <span className="text-base font-bold text-text-primary">{selectedEscort.name}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => alert(`Calling ${selectedEscort.name} at ${selectedEscort.contactNumber}`)}>
                  <PhoneCall className="w-4 h-4 mr-1.5" /> Call Direct
                </Button>
                <Button size="sm" variant="outline" onClick={() => alert(`Escort request dispatched to ${selectedEscort.name}!`)}>
                  <UserCheck className="w-4 h-4 mr-1.5" /> Request Companion
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
