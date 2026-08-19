import React, { useState } from 'react';
import { EyeOff, ShieldCheck, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { runStalkerwareScan, StalkerwareScanResult } from '../../../server/services/stalkerwareScanService';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';

export const StalkerwarePage: React.FC = () => {
  const [scanResult, setScanResult] = useState<StalkerwareScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [panicActive, setPanicActive] = useState(false);

  const { enqueueAction } = useOfflineQueue();

  const handleRunScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      const result = runStalkerwareScan();
      setScanResult(result);
      setIsScanning(false);
    }, 2500);
  };

  const handleTriggerPanicMode = () => {
    setPanicActive(true);
    enqueueAction('SOS_TRIGGER', {
      source: 'STALKERWARE_PANIC_MODE',
      action: 'GPS Broadcast Disabled, Telemetry Evidence Queued Locally',
      timestamp: Date.now(),
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">Stalkerware & Covert Surveillance Detector</h1>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Simulated Detection Engine — Seeded Demo Data
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Inspects background device admin profiles, unauthorized telemetry channels, and hidden mic/camera hooks.
            </p>
          </div>
        </div>

        <Button variant="primary" onClick={handleRunScan} disabled={isScanning}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning Telemetry...' : 'Run Passive Scan'}
        </Button>
      </div>

      {/* Scanning Progress State */}
      {isScanning && (
        <Card title="Executing Heuristic System Audit...">
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-full max-w-md h-3 rounded-full bg-stage border border-border overflow-hidden">
              <div className="h-full bg-accent animate-pulse w-3/4 rounded-full" />
            </div>
            <span className="text-xs font-mono text-muted">Analyzing device admin profiles & socket connections (3s)...</span>
          </div>
        </Card>
      )}

      {/* Results Panel */}
      {scanResult && !isScanning && (
        <div className="flex flex-col gap-6">
          <Card
            title="Surveillance Indicator Audit Verdict"
            subtitle={`Scanned ${scanResult.indicatorsScanned} system parameters on ${new Date(scanResult.timestamp).toLocaleTimeString()}`}
            action={
              <Badge
                level={scanResult.verdict === 'INDICATORS_FOUND' ? 'CAUTION' : 'SAFE'}
                text={scanResult.verdict === 'INDICATORS_FOUND' ? '2 INDICATORS FLAGGED' : 'SYSTEM CLEAN'}
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanResult.indicators.map((indicator) => {
                const isExpanded = expandedId === indicator.id;
                const isFlagged = indicator.status === 'FLAGGED';

                return (
                  <div
                    key={indicator.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFlagged ? 'bg-amber-950/20 border-amber-500/40' : 'bg-stage border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isFlagged ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        )}
                        <span className="text-xs font-bold text-text-primary">{indicator.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isFlagged ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {indicator.status}
                      </span>
                    </div>

                    <p className="text-xs text-muted leading-relaxed mb-3">{indicator.details}</p>

                    {isFlagged && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : indicator.id)}
                        className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {isExpanded ? 'Hide Remediation Steps' : 'View Step-by-Step Remediation'}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {isExpanded && isFlagged && (
                      <div className="mt-3 pt-3 border-t border-border/80 flex flex-col gap-2 bg-surface p-3 rounded-xl">
                        <span className="text-xs font-bold text-text-primary">{indicator.remediationStep.title}</span>
                        <p className="text-xs text-muted leading-relaxed">{indicator.remediationStep.instructions}</p>
                        <Button size="sm" variant="outline" className="mt-1 text-xs self-start">
                          {indicator.remediationStep.linkAction}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Panic Mode Section */}
          <Card
            title="Surveillance Defense Panic Mode"
            subtitle="Instantly terminates GPS broadcasting and locks telemetry evidence locally in offline queue."
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="text-xs text-muted leading-relaxed max-w-xl">
                <Lock className="w-4 h-4 inline mr-1 text-accent" />
                Clicking Panic Mode silently disables outgoing location broadcasts and queues encrypted diagnostic logs to your local storage queue.
              </div>
              <Button
                variant={panicActive ? 'critical' : 'primary'}
                onClick={handleTriggerPanicMode}
              >
                {panicActive ? 'Panic Mode Active (GPS Locked)' : 'Activate Panic Mode'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
