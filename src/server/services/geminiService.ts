import { GoogleGenerativeAI } from '@google/generative-ai';
import { ThreatAnalysisInput, ThreatAnalysisResult } from '../../shared/types/safety.types';
import { calculateRiskFusion } from './riskFusionService';

export async function analyzeThreatWithGemini(input: ThreatAnalysisInput): Promise<ThreatAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    // Deterministic offline fallback using riskFusionService
    return calculateRiskFusion(input);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptText = `
You are Suraksha AI's Multimodal Distress Analyzer. Analyze the following sensor features and return JSON only:
- Text: "${input.textSnippet || 'None'}"
- Audio Decibels: ${input.audioFeatures?.decibels ?? 'Unknown'}
- Audio Stress Probability: ${input.audioFeatures?.stressProbability ?? 'Unknown'}
- Motion Acceleration: ${input.motionFeatures?.accelerationMagnitude ?? 'Unknown'} g
- Freefall Detected: ${input.motionFeatures?.freefallDetected ? 'Yes' : 'No'}

Respond strictly with valid JSON conforming to this format:
{
  "riskScore": number (0-100),
  "riskLevel": "SAFE" | "CAUTION" | "CRITICAL",
  "explanation": "string",
  "recommendedAction": "string"
}
`;

    const result = await model.generateContent(promptText);
    const textResponse = result.response.text();

    const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    // Fuse with rule-based weighting calculation
    const baseFusion = calculateRiskFusion(input);

    return {
      riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : baseFusion.riskScore,
      riskLevel: ['SAFE', 'CAUTION', 'CRITICAL'].includes(parsed.riskLevel)
        ? parsed.riskLevel
        : baseFusion.riskLevel,
      breakdown: baseFusion.breakdown,
      explanation: parsed.explanation || baseFusion.explanation,
      recommendedAction: parsed.recommendedAction || baseFusion.recommendedAction,
      timestamp: new Date().toISOString(),
    };
  } catch {
    // Fallback gracefully on any API/network failure
    const fallback = calculateRiskFusion(input);
    return {
      ...fallback,
      explanation: `${fallback.explanation} (Analyzed via Guardian Offline Engine)`,
    };
  }
}
