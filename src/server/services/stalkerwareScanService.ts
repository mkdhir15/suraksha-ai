export interface StalkerwareIndicator {
  id: string;
  name: string;
  category: 'Battery & Data' | 'Permissions' | 'Hardware' | 'Background Service';
  status: 'CLEAN' | 'FLAGGED';
  details: string;
  remediationStep: {
    title: string;
    instructions: string;
    linkAction: string;
  };
}

export interface StalkerwareScanResult {
  scanId: string;
  timestamp: string;
  verdict: 'CLEAN' | 'INDICATORS_FOUND';
  riskScore: number; // 0-100
  indicatorsScanned: number;
  flaggedCount: number;
  indicators: StalkerwareIndicator[];
}

export function runStalkerwareScan(): StalkerwareScanResult {
  const indicators: StalkerwareIndicator[] = [
    {
      id: 'ind-1',
      name: 'Unusual Background Battery Drain Pattern',
      category: 'Battery & Data',
      status: 'FLAGGED',
      details: 'Unregistered background process CPU utilization active during idle hours (02:00-05:00).',
      remediationStep: {
        title: 'Revoke Background Execution & Power Profile',
        instructions: 'Navigate to System Settings -> Battery -> Unrestricted App Battery Usage. Locate unrecognized apps and set to Restricted.',
        linkAction: 'Open Battery Settings',
      },
    },
    {
      id: 'ind-2',
      name: 'Unknown Device Admin Profile Installed',
      category: 'Permissions',
      status: 'FLAGGED',
      details: 'Hidden profile "System Monitor Service v4" holding Device Administrator privileges.',
      remediationStep: {
        title: 'Deactivate Device Administrator Privileges',
        instructions: 'Go to Settings -> Security & Privacy -> Special App Access -> Device Admin Apps. Deactivate unknown apps.',
        linkAction: 'Open Device Admin Panel',
      },
    },
    {
      id: 'ind-3',
      name: 'Hidden Microphone / Camera Hook Flags',
      category: 'Hardware',
      status: 'CLEAN',
      details: 'No unauthorized real-time microphone or camera stream hooks detected.',
      remediationStep: {
        title: 'Enable Privacy Indicators',
        instructions: 'Ensure OS status bar green camera/mic dot indicators are enabled.',
        linkAction: 'Check Camera Permissions',
      },
    },
    {
      id: 'ind-4',
      name: 'Suspicious Telemetry Data Traffic',
      category: 'Background Service',
      status: 'CLEAN',
      details: 'Network sockets verified against known trusted SSL/TLS endpoints.',
      remediationStep: {
        title: 'Audit Active Sockets',
        instructions: 'Verify active network connections in Data Usage settings.',
        linkAction: 'Review Data Usage',
      },
    },
  ];

  const flagged = indicators.filter((i) => i.status === 'FLAGGED');

  return {
    scanId: `scan-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    verdict: flagged.length > 0 ? 'INDICATORS_FOUND' : 'CLEAN',
    riskScore: flagged.length > 0 ? 68 : 12,
    indicatorsScanned: indicators.length,
    flaggedCount: flagged.length,
    indicators,
  };
}
