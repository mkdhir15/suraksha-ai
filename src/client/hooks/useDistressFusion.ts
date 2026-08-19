import { useState, useCallback } from 'react';
import { ThreatAnalysisInput, ThreatAnalysisResult } from '../../shared/types/safety.types';
import { calculateRiskFusion } from '../../server/services/riskFusionService';

export function useDistressFusion() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeThreat = useCallback(async (input: ThreatAnalysisInput) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/safety/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const data: ThreatAnalysisResult = await response.json();
      setAnalysisResult(data);
      return data;
    } catch {
      // Local client fallback if server or network unreachable
      const fallback = calculateRiskFusion(input);
      setAnalysisResult(fallback);
      return fallback;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring((prev) => !prev);
  }, []);

  return {
    isMonitoring,
    isAnalyzing,
    analysisResult,
    analyzeThreat,
    toggleMonitoring,
  };
}
