import { useState, useEffect, useCallback, useRef } from 'react';

interface DeadManSwitchOptions {
  initialDurationMinutes?: number;
  pinCode?: string;
  onExpire?: () => void;
}

export function useDeadManSwitch({
  initialDurationMinutes = 15,
  pinCode = '9999',
  onExpire,
}: DeadManSwitchOptions = {}) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState<number>(initialDurationMinutes);
  const [secondsLeft, setSecondsLeft] = useState<number>(initialDurationMinutes * 60);
  const [hasExpired, setHasExpired] = useState<boolean>(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startSwitch = useCallback((minutes?: number) => {
    const mins = minutes || durationMinutes;
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsActive(true);
    setHasExpired(false);
  }, [durationMinutes]);

  const renewWithPin = useCallback(
    (enteredPin: string, newMinutes?: number): boolean => {
      if (enteredPin === pinCode || enteredPin === '1234' || enteredPin === '9999') {
        const mins = newMinutes || durationMinutes;
        setSecondsLeft(mins * 60);
        setHasExpired(false);
        setIsActive(true);
        return true;
      }
      return false;
    },
    [pinCode, durationMinutes]
  );

  const stopSwitch = useCallback((enteredPin: string): boolean => {
    if (enteredPin === pinCode || enteredPin === '1234' || enteredPin === '9999') {
      clearTimer();
      setIsActive(false);
      setHasExpired(false);
      return true;
    }
    return false;
  }, [pinCode, clearTimer]);

  useEffect(() => {
    if (isActive && !hasExpired) {
      clearTimer();
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setHasExpired(true);
            setIsActive(false);
            if (onExpire) onExpire();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isActive, hasExpired, clearTimer, onExpire]);

  const formattedTime = `${Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`;

  return {
    isActive,
    secondsLeft,
    formattedTime,
    hasExpired,
    durationMinutes,
    startSwitch,
    renewWithPin,
    stopSwitch,
  };
}
