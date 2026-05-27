export type Language = 'es' | 'en';
export type AppLanguageId = 'en' | 'es';
export type LinkKey = 'linkedin' | 'github' | 'portfolio' | 'email' | 'phone';
export type AiProviderId = 'openai' | 'anthropic' | 'xai' | 'gemini' | 'mistral' | 'deepseek' | 'groq';
export type CvFontId = 'serif' | 'sans' | 'ats';
export type CvFormatId = 'harvard';
export type SectionCaseId = 'uppercase' | 'capitalize';

export interface ProfileLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: ProfileLink;
  github: ProfileLink;
  portfolio: ProfileLink;
}

export interface Responsibility {
  type: string;
  description: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  type: string;
  domain: string[];
  business_context: string[];
  responsibilities: Responsibility[];
  technologies: string[];
  achievements: Array<{ metric: string; description: string }>;
}

export interface ProjectEntry {
  name: string;
  description: string;
  period: string;
  technologies: string[];
  domain: string[];
  type: string;
}

export interface SkillEntry {
  technology: string;
  level: 'advanced' | 'intermediate' | 'basic';
  category: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  relevance: string[];
}

export interface CvAdaptationResult {
  jobTitle: string;
  profile: string;
  fileName?: string;
  outputLanguage?: Language;
  templateId?: CvFormatId;
  fontId?: CvFontId;
  sectionCase?: SectionCaseId;
  providerId?: AiProviderId;
  matchScore?: number;
  matchAllowed?: boolean;
  matchReason?: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    location: string;
    isPracticas: boolean;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    desc: string;
    period: string;
    tech: string;
  }>;
  skills: Record<string, string>;
  certifications: string[];
  educationOrder: number[];
}

export interface LinkState {
  linkedin: boolean;
  github: boolean;
  portfolio: boolean;
  email: boolean;
  phone: boolean;
}

export interface ProviderCredentials {
  providerId: AiProviderId;
  apiKey: string;
  model: string;
}

export interface AppSettings {
  providerId: AiProviderId;
  apiKeys: Record<AiProviderId, string>;
  models: Record<AiProviderId, string>;
  fontId: CvFontId;
  formatId: CvFormatId;
  appLanguage: AppLanguageId;
  outputLanguage: Language;
  sectionCase: SectionCaseId;
  autoFileName: boolean;
}
