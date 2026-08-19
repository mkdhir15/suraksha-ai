import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CrisisClassificationResult {
  isCrisisDetected: boolean;
  confidenceScore: number; // 0-100
  detectedCategory: 'ANXIETY_PANIC' | 'SELF_HARM_RISK' | 'GENERAL_DISTRESS' | 'NONE';
  supportiveResponse: string;
  groundingExerciseRecommended: boolean;
  hotlineRecommended: boolean;
}

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'die',
  'end it all',
  'can\'t go on',
  'hopeless',
  'panic attack',
  'self harm',
  'overwhelmed',
  'cut myself',
];

export async function classifyCrisisSignal(text: string): Promise<CrisisClassificationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return deterministicCrisisFallback(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptText = `
Classify the following text for emotional crisis/self-harm risk. Respond strictly with valid JSON:
Text: "${text}"

JSON schema:
{
  "isCrisisDetected": boolean,
  "confidenceScore": number (0-100),
  "detectedCategory": "ANXIETY_PANIC" | "SELF_HARM_RISK" | "GENERAL_DISTRESS" | "NONE",
  "supportiveResponse": "string",
  "groundingExerciseRecommended": boolean,
  "hotlineRecommended": boolean
}
`;

    const result = await model.generateContent(promptText);
    const textResponse = result.response.text();
    const cleaned = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      isCrisisDetected: !!parsed.isCrisisDetected,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 75,
      detectedCategory: parsed.detectedCategory || 'GENERAL_DISTRESS',
      supportiveResponse: parsed.supportiveResponse || 'I am listening. Take a deep breath — you are safe here.',
      groundingExerciseRecommended: !!parsed.groundingExerciseRecommended,
      hotlineRecommended: !!parsed.hotlineRecommended,
    };
  } catch {
    return deterministicCrisisFallback(text);
  }
}

export function deterministicCrisisFallback(text: string): CrisisClassificationResult {
  const lower = text.toLowerCase();
  const matched = CRISIS_KEYWORDS.filter((kw) => lower.includes(kw));

  if (matched.length > 0) {
    return {
      isCrisisDetected: true,
      confidenceScore: Math.min(95, 60 + matched.length * 20),
      detectedCategory: lower.includes('panic') || lower.includes('overwhelmed') ? 'ANXIETY_PANIC' : 'SELF_HARM_RISK',
      supportiveResponse: 'I hear how heavy things feel right now. You don\'t have to carry this alone. Would you like to try a calming 5-4-3-2-1 grounding exercise or connect with a confidential listener?',
      groundingExerciseRecommended: true,
      hotlineRecommended: true,
    };
  }

  return {
    isCrisisDetected: false,
    confidenceScore: 10,
    detectedCategory: 'NONE',
    supportiveResponse: 'Thank you for sharing. I am here to support you whenever you need space to reflect.',
    groundingExerciseRecommended: false,
    hotlineRecommended: false,
  };
}
