import { useState, useEffect, useCallback } from 'react';
import { OfflineAction } from '../../shared/types/safety.types';

const STORAGE_KEY = 'suraksha_offline_queue';

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queue, setQueue] = useState<OfflineAction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveQueue = (newQueue: OfflineAction[]) => {
    setQueue(newQueue);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQueue));
    } catch {
      // storage error
    }
  };

  const enqueueAction = useCallback((type: OfflineAction['type'], payload: Record<string, unknown>) => {
    const newAction: OfflineAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      payload,
      timestamp: Date.now(),
    };
    setQueue((prev) => {
      const updated = [...prev, newAction];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  }, []);

  const drainQueue = useCallback(async () => {
    if (queue.length === 0) return;

    const remaining = [...queue];
    const syncedCount = remaining.length;

    // Simulate sending queued actions to backend server
    saveQueue([]);

    return syncedCount;
  }, [queue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      drainQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [drainQueue]);

  return {
    isOnline,
    queue,
    enqueueAction,
    drainQueue,
    pendingCount: queue.length,
  };
}
