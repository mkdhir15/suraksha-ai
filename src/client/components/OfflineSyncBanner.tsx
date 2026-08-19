import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOfflineQueue } from '../hooks/useOfflineQueue';

export const OfflineSyncBanner: React.FC = () => {
  const { isOnline, pendingCount, drainQueue } = useOfflineQueue();

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      className={`w-full px-6 py-3 border-b flex items-center justify-between text-xs font-medium backdrop-blur-md transition-all z-30 ${
        !isOnline
          ? 'bg-amber-950/80 border-amber-500/30 text-amber-200'
          : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
      }`}
    >
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              OFFLINE SURVIVAL MODE ACTIVE — Emergency triggers queued locally ({pendingCount} pending).
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Network connection restored. Syncing {pendingCount} offline safety logs...</span>
          </>
        )}
      </div>

      {pendingCount > 0 && isOnline && (
        <button
          onClick={() => drainQueue()}
          className="px-3 py-1 rounded-full bg-emerald-500 text-black font-bold flex items-center gap-1 hover:bg-emerald-400 transition-colors"
        >
          <RefreshCw className="w-3 h-3 animate-spin" /> Sync Now
        </button>
      )}
    </div>
  );
};
