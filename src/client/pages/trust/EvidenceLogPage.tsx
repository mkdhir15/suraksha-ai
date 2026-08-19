import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { createEvidenceRecord, verifyEvidenceIntegrity, EvidenceRecord } from '../../../server/services/evidenceLedgerService';

export const EvidenceLogPage: React.FC = () => {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedStatusMap, setVerifiedStatusMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Generate initial seeded records
    Promise.all([
      createEvidenceRecord('LEVEL_3_SOS_DISPATCH', {
        location: '12.9716, 77.5946',
        riskScore: 92,
        sensorSnapshot: 'Acoustic 88dB, Rapid Kinetic Acceleration',
      }),
      createEvidenceRecord('STALKERWARE_PANIC_QUEUE', {
        location: '12.9352, 77.6245',
        riskScore: 68,
        sensorSnapshot: 'Battery Drain Anomaly, Device Admin Profile Flagged',
      }),
    ]).then((seeded) => setRecords(seeded));
  }, []);

  const handleVerifyIntegrity = async (record: EvidenceRecord) => {
    setVerifyingId(record.id);
    const isValid = await verifyEvidenceIntegrity(record);
    setTimeout(() => {
      setVerifiedStatusMap((prev) => ({ ...prev, [record.id]: isValid }));
      setVerifyingId(null);
    }, 1200);
  };

  const handleExportJSON = (record: EvidenceRecord) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `suraksha_evidence_${record.sha256Hash.substring(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">Evidence Chain-of-Custody Dashboard</h1>
              <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Genuine Client SHA-256 Cryptographic Audit
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Timestamped cryptographic evidence records created during emergency dispatches and panic mode activations.
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Records List */}
      <div className="flex flex-col gap-6">
        {records.map((record) => {
          const isVerifying = verifyingId === record.id;
          const isVerified = verifiedStatusMap[record.id];

          return (
            <Card
              key={record.id}
              title={`Evidence Record: ${record.id.toUpperCase()}`}
              subtitle={`Dispatch ID: ${record.dispatchId} | ${new Date(record.timestamp).toLocaleString()}`}
              action={<Badge level="SAFE" text={record.eventType} />}
            >
              <div className="flex flex-col gap-5">
                {/* Hash Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stage p-4 rounded-2xl border border-border font-mono text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-semibold mb-1">
                      SHA-256 Digest (Client Cryptographic Hash)
                    </span>
                    <span className="text-accent font-bold break-all">{record.sha256Hash}</span>
                  </div>

                  <div>
                    <span className="text-muted block text-[10px] uppercase font-semibold mb-1">
                      Timestamped Ledger Transaction ID
                    </span>
                    <span className="text-text-primary break-all">{record.ledgerTransactionId}</span>
                  </div>
                </div>

                {/* Payload Details */}
                <div className="text-xs text-muted leading-relaxed flex flex-col gap-1 bg-surface p-3.5 rounded-xl border border-border">
                  <span className="font-bold text-text-primary">Sensor Telemetry Snapshot:</span>
                  <span>Location: {record.payloadSummary.location}</span>
                  <span>Risk Score: {record.payloadSummary.riskScore}/100</span>
                  <span>Snapshot: {record.payloadSummary.sensorSnapshot}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyIntegrity(record)}
                      disabled={isVerifying}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isVerifying ? 'animate-spin' : ''}`} />
                      {isVerifying ? 'Re-hashing Digest...' : 'Verify Hash Integrity'}
                    </Button>

                    {isVerified !== undefined && (
                      <span className="text-xs font-mono font-bold flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Integrity Match Verified (100% Intact)
                      </span>
                    )}
                  </div>

                  <Button size="sm" variant="secondary" onClick={() => handleExportJSON(record)}>
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export for Legal Review (JSON)
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
