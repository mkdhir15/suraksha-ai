import React, { useState } from 'react';
import { Clock, ShieldAlert, KeyRound, Check } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProgressRing } from './ui/ProgressRing';
import { useDeadManSwitch } from '../hooks/useDeadManSwitch';

interface DeadManSwitchProps {
  onSosTriggered: () => void;
}

export const DeadManSwitch: React.FC<DeadManSwitchProps> = ({ onSosTriggered }) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const {
    isActive,
    secondsLeft,
    formattedTime,
    hasExpired,
    durationMinutes,
    startSwitch,
    renewWithPin,
    stopSwitch,
  } = useDeadManSwitch({
    initialDurationMinutes: 15,
    pinCode: '9999',
    onExpire: onSosTriggered,
  });

  const progress = Math.max(0, (secondsLeft / (durationMinutes * 60)) * 100);

  const handleRenew = () => {
    const success = renewWithPin(pinInput, durationMinutes);
    if (success) {
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleStop = () => {
    const success = stopSwitch(pinInput);
    if (success) {
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <Card
      title="Dead-Man's Safety Check-In"
      subtitle="Periodic safety check-in timer. Expiration without PIN renewal dispatches silent emergency beacons."
      action={<Badge level={isActive ? 'ACTIVE' : 'STANDBY'} />}
    >
      <div className="flex flex-col md:flex-row items-center gap-8 py-2">
        {/* Ring & Timer */}
        <div className="flex flex-col items-center">
          <ProgressRing
            progress={progress}
            size={140}
            strokeWidth={10}
            color={hasExpired ? 'var(--critical)' : isActive ? 'var(--accent)' : 'var(--border)'}
            label={isActive ? 'REMAINING' : 'STANDBY'}
          />
          <div className="mt-3 text-2xl font-mono font-bold text-text-primary tracking-widest" aria-live="polite">
            {formattedTime}
          </div>
        </div>

        {/* Controls & PIN Input */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {!isActive ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted">Select Trip Duration:</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => startSwitch(5)}>
                  5 Min Trip
                </Button>
                <Button size="sm" onClick={() => startSwitch(15)}>
                  15 Min Trip
                </Button>
                <Button size="sm" onClick={() => startSwitch(30)}>
                  30 Min Trip
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-muted flex-shrink-0" />
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Enter 4-Digit PIN (9999)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="bg-stage border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent w-full font-mono"
                />
              </div>

              {pinError && (
                <span className="text-xs text-critical flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" /> Invalid PIN. Use 9999 or 1234.
                </span>
              )}

              <div className="flex gap-2 mt-1">
                <Button size="sm" onClick={handleRenew} className="flex-1">
                  <Check className="w-4 h-4 mr-1" /> Renew Timer
                </Button>
                <Button size="sm" variant="outline" onClick={handleStop} className="flex-1">
                  Cancel Switch
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted leading-relaxed border-t border-border pt-3">
            <Clock className="w-3.5 h-3.5 inline mr-1 text-accent" />
            Confidential PIN code (9999) required before 00:00. Automated SOS dispatches if timer runs out.
          </div>
        </div>
      </div>
    </Card>
  );
};
