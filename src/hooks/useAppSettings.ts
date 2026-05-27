import { useEffect, useState } from 'react';
import { readLocalStorage, writeLocalStorage } from '../utils/storage';
import type { AppSettings, AppLanguageId, AiProviderId, CvFontId, CvFormatId, Language, SectionCaseId } from '../types/cv';

const STORAGE_KEY = 'cv-adapter.settings.v1';

const defaultSettings: AppSettings = {
  providerId: 'openai',
  apiKeys: { openai: '', anthropic: '', xai: '', gemini: '', mistral: '', deepseek: '', groq: '' },
  models: {
    openai: 'gpt-4o',
    anthropic: 'claude-3-5-sonnet-latest',
    xai: 'grok-2-latest',
    gemini: 'gemini-2.0-flash',
    mistral: 'mistral-small-latest',
    deepseek: 'deepseek-chat',
    groq: 'llama-3.1-70b-versatile'
  },
  fontId: 'sans',
  formatId: 'harvard',
  appLanguage: 'en',
  outputLanguage: 'es',
  sectionCase: 'capitalize',
  autoFileName: false
};

function mergeSettings(stored: Partial<AppSettings> | null | undefined): AppSettings {
  return {
    ...defaultSettings,
    ...stored,
    apiKeys: { ...defaultSettings.apiKeys, ...(stored?.apiKeys || {}) },
    models: { ...defaultSettings.models, ...(stored?.models || {}) },
    fontId: stored?.fontId ?? defaultSettings.fontId,
    formatId: stored?.formatId ?? defaultSettings.formatId,
    appLanguage: stored?.appLanguage ?? defaultSettings.appLanguage,
    outputLanguage: stored?.outputLanguage ?? defaultSettings.outputLanguage,
    sectionCase: stored?.sectionCase ?? defaultSettings.sectionCase,
    autoFileName: stored?.autoFileName ?? defaultSettings.autoFileName
  };
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() =>
    mergeSettings(readLocalStorage<Partial<AppSettings>>(STORAGE_KEY, {}))
  );

  useEffect(() => {
    writeLocalStorage(STORAGE_KEY, settings);
  }, [settings]);

  return {
    settings,
    updateProvider: (providerId: AiProviderId) =>
      setSettings((current) => ({ ...current, providerId })),
    updateApiKey: (value: string) =>
      setSettings((current) => ({
        ...current,
        apiKeys: { ...current.apiKeys, [current.providerId]: value }
      })),
    updateModel: (value: string) =>
      setSettings((current) => ({
        ...current,
        models: { ...current.models, [current.providerId]: value }
      })),
    updateFont: (fontId: CvFontId) =>
      setSettings((current) => ({ ...current, fontId })),
    updateFormat: (formatId: CvFormatId) =>
      setSettings((current) => ({ ...current, formatId })),
    updateAppLanguage: (appLanguage: AppLanguageId) =>
      setSettings((current) => ({ ...current, appLanguage })),
    updateOutputLanguage: (outputLanguage: Language) =>
      setSettings((current) => ({ ...current, outputLanguage })),
    updateSectionCase: (sectionCase: SectionCaseId) =>
      setSettings((current) => ({ ...current, sectionCase })),
    updateAutoFileName: (autoFileName: boolean) =>
      setSettings((current) => ({ ...current, autoFileName }))
  };
}
