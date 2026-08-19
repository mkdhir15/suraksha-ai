import { EscalationState, EscalationLevel } from '../../shared/types/safety.types';

export function createInitialEscalationState(): EscalationState {
  return {
    currentLevel: 1,
    level1WarningSent: false,
    level2SilentContactTriggered: false,
    level3EmergencyDispatched: false,
    activeTimers: [],
    logs: [
      {
        timestamp: new Date().toISOString(),
        action: 'Escalation Ladder initialized at Level 1 (Standby).',
        level: 1,
      },
    ],
  };
}

export function escalateState(
  state: EscalationState,
  targetLevel: EscalationLevel,
  reason: string
): EscalationState {
  if (targetLevel <= state.currentLevel) {
    return state; // No de-escalation via simple trigger or already at level
  }

  const newLogs = [
    ...state.logs,
    {
      timestamp: new Date().toISOString(),
      action: `Escalated to Level ${targetLevel}: ${reason}`,
      level: targetLevel,
    },
  ];

  return {
    currentLevel: targetLevel,
    level1WarningSent: targetLevel >= 1 ? true : state.level1WarningSent,
    level2SilentContactTriggered: targetLevel >= 2 ? true : state.level2SilentContactTriggered,
    level3EmergencyDispatched: targetLevel >= 3 ? true : state.level3EmergencyDispatched,
    activeTimers: targetLevel === 3 ? [] : state.activeTimers,
    logs: newLogs,
  };
}

export function resetEscalationState(): EscalationState {
  return createInitialEscalationState();
}
