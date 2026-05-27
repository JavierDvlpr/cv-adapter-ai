import type { AiProviderId } from '../types/cv';

export interface AiProviderDefinition {
  id: AiProviderId;
  label: string;
  endpoint: string;
  supportsSystemPrompt: boolean;
  defaultModel: string;
  authHeader: 'Authorization' | 'x-api-key';
}

export const aiProviders: AiProviderDefinition[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    supportsSystemPrompt: true,
    defaultModel: 'gpt-4o',
    authHeader: 'Authorization'
  },
  {
    id: 'anthropic',
    label: 'Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    supportsSystemPrompt: true,
    defaultModel: 'claude-3-5-sonnet-latest',
    authHeader: 'x-api-key'
  },
  {
    id: 'xai',
    label: 'Grok',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    supportsSystemPrompt: true,
    defaultModel: 'grok-2-latest',
    authHeader: 'Authorization'
  },
  {
    id: 'gemini',
    label: 'Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    supportsSystemPrompt: false,
    defaultModel: 'gemini-2.0-flash',
    authHeader: 'x-api-key'
  },
  {
    id: 'mistral',
    label: 'Mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    supportsSystemPrompt: true,
    defaultModel: 'mistral-small-latest',
    authHeader: 'Authorization'
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    supportsSystemPrompt: true,
    defaultModel: 'deepseek-chat',
    authHeader: 'Authorization'
  },
  {
    id: 'groq',
    label: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    supportsSystemPrompt: true,
    defaultModel: 'llama-3.1-70b-versatile',
    authHeader: 'Authorization'
  }
];

export function getAiProvider(providerId: AiProviderId): AiProviderDefinition {
  const provider = aiProviders.find((item) => item.id === providerId);
  if (!provider) {
    return aiProviders[0];
  }

  return provider;
}
