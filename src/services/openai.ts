import type { AiProviderId, CvAdaptationResult } from '../types/cv';
import { getAiProvider } from '../config/aiProviders';
import { safeParseJson } from '../utils/json';

interface RequestCvAdaptationParams {
  providerId: AiProviderId;
  apiKey: string;
  prompt: string;
  model?: string;
}

interface OpenAiCompatibleResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

interface AnthropicResponse {
  content?: Array<{ text?: string }>;
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

function buildHeaders(providerId: AiProviderId, apiKey: string): HeadersInit {
  if (providerId === 'anthropic') {
    return {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    };
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`
  };
}

function isGemini(providerId: AiProviderId): boolean {
  return providerId === 'gemini';
}

function buildBody(providerId: AiProviderId, prompt: string, model: string) {
  if (providerId === 'gemini') {
    return {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.25 }
    };
  }

  if (providerId === 'anthropic') {
    return {
      model,
      max_tokens: 3000,
      temperature: 0.25,
      system: 'You are a professional CV adaptation expert. Always respond with valid JSON only.',
      messages: [{ role: 'user', content: prompt }]
    };
  }

  return {
    model,
    temperature: 0.25,
    messages: [
      { role: 'system', content: 'You are a professional CV adaptation expert. Always respond with valid JSON only.' },
      { role: 'user', content: prompt }
    ]
  };
}

function extractContent(providerId: AiProviderId, responseBody: OpenAiCompatibleResponse | AnthropicResponse): string {
  if (providerId === 'gemini') {
    const geminiResponse = responseBody as GeminiResponse;
    return geminiResponse.candidates?.[0]?.content?.parts?.map((item: { text?: string }) => item.text ?? '').join('') ?? '';
  }

  if (providerId === 'anthropic') {
    const anthropicResponse = responseBody as AnthropicResponse;
    return anthropicResponse.content?.map((item: { text?: string }) => item.text ?? '').join('') ?? '';
  }

  const openAiResponse = responseBody as OpenAiCompatibleResponse;
  return openAiResponse.choices?.[0]?.message?.content ?? '';
}

export async function requestCvAdaptation({ providerId, apiKey, prompt, model }: RequestCvAdaptationParams): Promise<CvAdaptationResult> {
  const provider = getAiProvider(providerId);
  const selectedModel = model || provider.defaultModel;
  const requestUrl = isGemini(providerId)
    ? `${provider.endpoint}/${encodeURIComponent(selectedModel)}:generateContent?key=${encodeURIComponent(apiKey)}`
    : provider.endpoint;
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: isGemini(providerId) ? { 'Content-Type': 'application/json' } : buildHeaders(providerId, apiKey),
    body: JSON.stringify(buildBody(providerId, prompt, selectedModel))
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => ({}));
    const message = typeof errorBody === 'object' && errorBody && 'error' in errorBody
      ? String((errorBody as { error?: { message?: string } }).error?.message || 'API error')
      : 'API error';
    throw new Error(message);
  }

  const data = await response.json() as OpenAiCompatibleResponse | AnthropicResponse;
  const content = extractContent(providerId, data);

  if (!content) {
    throw new Error(`Respuesta vacía de ${provider.label}`);
  }

  return safeParseJson<CvAdaptationResult>(content);
}
