import React, { useState } from 'react';
import { Shield, Bell, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { EscalationState, EscalationLevel } from '../../shared/types/safety.types';
import {
  createInitialEscalationState,
  escalateState,
  resetEscalationState,
} from '../../server/services/escalationService';
import { ESCALATION_LEVELS } from '../../shared/constants/escalation.constants';

interface EscalationLadderProps {
  onLevel3Triggered?: () => void;
  escalationState?: EscalationState;
  onEscalate?: (targetLevel: EscalationLevel, reason: string) => void;
  onReset?: () => void;
}

export const EscalationLadder: React.FC<EscalationLadderProps> = ({
  onLevel3Triggered,
  escalationState: externalState,
  onEscalate: externalEscalate,
  onReset: externalReset,
}) => {
  const [internalState, setInternalState] = useState<EscalationState>(createInitialEscalationState());

  const escalation = externalState || internalState;

  const handleEscalate = (targetLevel: EscalationLevel, reason: string) => {
    if (externalEscalate) {
      externalEscalate(targetLevel, reason);
    } else {
      const nextState = escalateState(internalState, targetLevel, reason);
      setInternalState(nextState);
    }

    if (targetLevel === 3 && onLevel3Triggered) {
      onLevel3Triggered();
    }
  };

  const handleReset = () => {
    if (externalReset) {
      externalReset();
    } else {
      setInternalState(resetEscalationState());
    }
  };

  return (
    <Card
      title="Priority Escalation Ladder"
      subtitle="Deterministic multi-tier emergency response state machine"
      action={
        <Badge
          level={escalation.currentLevel === 3 ? 'CRITICAL' : escalation.currentLevel === 2 ? 'CAUTION' : 'SAFE'}
          text={`LEVEL ${escalation.currentLevel} ACTIVE`}
        />
      }
    >
      <div className="flex flex-col gap-6">
        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 1 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              escalation.currentLevel >= 1
                ? 'bg-surface border-border'
                : 'bg-stage border-border/50 opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-xs text-text-primary">Level 1: Warning</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {ESCALATION_LEVELS.LEVEL_1.description}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEscalate(1, 'Manual level 1 warning test')}
              className="w-full text-xs py-1.5"
            >
              Simulate Warning
            </Button>
          </div>

          {/* Level 2 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              escalation.currentLevel >= 2
                ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                : 'bg-stage border-border/50 opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-xs text-text-primary">Level 2: Silent Beacon</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {ESCALATION_LEVELS.LEVEL_2.description}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEscalate(2, 'Silent contact beacon triggered')}
              className="w-full text-xs py-1.5"
            >
              Trigger Level 2
            </Button>
          </div>

          {/* Level 3 */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              escalation.currentLevel >= 3
                ? 'bg-critical/20 border-critical text-white shadow-xl shadow-red-900/40'
                : 'bg-stage border-border/50 opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-critical animate-bounce" />
              <span className="font-semibold text-xs text-white">Level 3: Emergency SOS</span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {ESCALATION_LEVELS.LEVEL_3.description}
            </p>
            <Button
              size="sm"
              variant="critical"
              onClick={() => handleEscalate(3, 'High-threat emergency SOS dispatched')}
              className="w-full text-xs py-1.5"
            >
              Dispatch SOS (L3)
            </Button>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-stage rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" /> Escalation Audit Trail
            </span>
            {escalation.currentLevel > 1 && (
              <button
                onClick={handleReset}
                className="text-[11px] text-muted hover:text-text-primary underline cursor-pointer"
              >
                Reset to Standby
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5 font-mono text-[11px] max-h-32 overflow-y-auto">
            {escalation.logs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 text-muted">
                <span className="text-muted/60">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <ArrowRight className="w-3 h-3 text-accent flex-shrink-0" />
                <span className={log.level === 3 ? 'text-critical font-bold' : 'text-text-primary'}>
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
