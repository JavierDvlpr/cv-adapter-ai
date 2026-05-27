import { useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { CvPreview } from './components/CvPreview';
import { ToastStack } from './components/ToastStack';
import { certifications, education as baseEducation, experience, profile, projects, skills } from './data';
import { aiProviders } from './config/aiProviders';
import { buildPrompt } from './utils/buildPrompt';
import { downloadCvDocx } from './services/exportDocx';
import { downloadCvPdf } from './services/exportPdf';
import { requestCvAdaptation } from './services/openai';
import {
  useAppSettings,
  useNotifications,
  useFileHandling,
  buildAutoFileName,
  estimateCandidateExperienceYears,
  extractMinimumExperienceYears,
  buildExperienceBlockMessage
} from './hooks';
import type {
  CvAdaptationResult,
  EducationEntry,
  LinkKey,
  LinkState
} from './types/cv';

const defaultLinks: LinkState = {
  linkedin: true,
  github: true,
  portfolio: false,
  email: true,
  phone: true
};

export function App() {
  const { settings, updateProvider, updateApiKey, updateModel, updateFont, updateFormat, updateOutputLanguage, updateSectionCase, updateAutoFileName } = useAppSettings();
  const { toasts, notify } = useNotifications();
  const fallbackVacancyLabel = 'Vacancy';
  const { fileName, setFileName, buildAutoFileName: buildFileName } = useFileHandling(buildAutoFileName(profile.name, fallbackVacancyLabel));

  const [jobDesc, setJobDesc] = useState('');
  const [links, setLinks] = useState<LinkState>(defaultLinks);
  const [currentCv, setCurrentCv] = useState<CvAdaptationResult | null>(null);
  const [educationDraft, setEducationDraft] = useState<EducationEntry[]>(baseEducation.map((item) => ({ ...item })));
  const [isLoading, setIsLoading] = useState(false);
  const [statusState, setStatusState] = useState<'idle' | 'ok' | 'busy' | 'error'>('idle');
  const previewRef = useRef<HTMLDivElement>(null);

  const currentProvider = aiProviders.find((provider) => provider.id === settings.providerId) ?? aiProviders[0];
  const currentApiKey = settings.apiKeys[settings.providerId] ?? '';
  const currentModel = settings.models[settings.providerId] || currentProvider.defaultModel;
  const renderedLanguage = currentCv?.outputLanguage ?? settings.outputLanguage;
  const currentSectionCase = currentCv?.sectionCase ?? settings.sectionCase;
  const currentFileName = settings.autoFileName && currentCv?.fileName ? currentCv.fileName : fileName;

  const updateCurrentCv = (updater: (cv: CvAdaptationResult) => CvAdaptationResult) => {
    setCurrentCv((current) => (current ? updater(current) : current));
  };

  const handleEditJobTitle = (value: string) => updateCurrentCv((current) => ({ ...current, jobTitle: value }));
  const handleEditProfile = (value: string) => updateCurrentCv((current) => ({ ...current, profile: value }));

  const handleEditExperienceBullet = (experienceIndex: number, bulletIndex: number, value: string) => {
    updateCurrentCv((current) => ({
      ...current,
      experience: current.experience.map((item, currentIndex) => (
        currentIndex === experienceIndex
          ? { ...item, bullets: item.bullets.map((bullet, currentBulletIndex) => (currentBulletIndex === bulletIndex ? value : bullet)) }
          : item
      ))
    }));
  };

  const handleEditProjectField = (projectIndex: number, field: 'name' | 'desc' | 'tech' | 'period', value: string) => {
    updateCurrentCv((current) => ({
      ...current,
      projects: current.projects.map((project, currentIndex) => (currentIndex === projectIndex ? { ...project, [field]: value } : project))
    }));
  };

  const handleEditSkill = (category: string, value: string) => {
    updateCurrentCv((current) => ({
      ...current,
      skills: { ...current.skills, [category]: value }
    }));
  };

  const handleEditCertification = (index: number, value: string) => {
    updateCurrentCv((current) => ({
      ...current,
      certifications: current.certifications.map((item, currentIndex) => (currentIndex === index ? value : item))
    }));
  };

  const handleEditEducation = (index: number, field: 'degree' | 'institution' | 'period' | 'location', value: string) => {
    setEducationDraft((current) => current.map((item, currentIndex) => (currentIndex === index ? { ...item, [field]: value } : item)));
  };

  const handleToggleLink = (key: LinkKey) => {
    setLinks((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleClearJobDesc = () => {
    setJobDesc('');
  };

  const handleAdapt = async () => {
    const trimmedApiKey = currentApiKey.trim();
    const trimmedJobDesc = jobDesc.trim();
    const requiredYears = extractMinimumExperienceYears(trimmedJobDesc);
    const availableYears = estimateCandidateExperienceYears(experience);

    if (!trimmedApiKey) {
      notify('Enter your API key', 'err');
      return;
    }

    if (!trimmedJobDesc) {
      notify('Paste the job description', 'err');
      return;
    }

    if (requiredYears !== null && availableYears + 0.05 < requiredYears) {
      notify(buildExperienceBlockMessage(requiredYears, availableYears), 'warn');
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setStatusState('busy');

    try {
      const prompt = buildPrompt({
        jobDesc: trimmedJobDesc,
        lang: settings.outputLanguage,
        profile,
        experience,
        projects,
        skills,
        education: educationDraft,
        certifications
      });

      const result = await requestCvAdaptation({
        providerId: settings.providerId,
        apiKey: trimmedApiKey,
        model: currentModel,
        prompt
      });

      const matchScore = typeof result.matchScore === 'number' ? result.matchScore : null;
      if (matchScore !== null && matchScore < 60) {
        const reason = result.matchReason?.trim();
        setCurrentCv(null);
        setStatusState('error');
        notify(
          reason
            ? `This job does not match your profile. ${reason}`
            : 'This job does not match your profile. Add more relevant skills to your data.',
          'err'
        );
        return;
      }

      const suggestedFileName = buildFileName(profile.name, result.jobTitle || fallbackVacancyLabel) || result.fileName || result.jobTitle || 'cv_adaptado';

      setCurrentCv({
        ...result,
        fileName: suggestedFileName,
        outputLanguage: settings.outputLanguage,
        templateId: settings.formatId,
        fontId: settings.fontId,
        providerId: settings.providerId
      });
      if (settings.autoFileName) {
        setFileName(suggestedFileName);
      }
      setStatusState('ok');
      notify('CV adapted', 'ok');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setStatusState('error');
      notify(`Error: ${message}`, 'err');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    const content = previewRef.current?.innerText;
    if (!content) {
      return;
    }

    await navigator.clipboard.writeText(content);
    notify('Text copied', 'ok');
  };

  const handleDownloadDocx = async () => {
    if (!currentCv) {
      return;
    }

    try {
      await downloadCvDocx({
        cv: currentCv,
        fileName: currentFileName.trim(),
        lang: currentCv.outputLanguage ?? settings.outputLanguage,
        fontId: settings.fontId,
        sectionCase: currentSectionCase,
        profile,
        education: educationDraft,
        links
      });
      notify(
        `Downloaded: ${(currentFileName.trim() || buildFileName(profile.name, currentCv.jobTitle || fallbackVacancyLabel))}.docx`,
        'ok'
      );
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      notify('Error downloading DOCX', 'err');
    }
  };

  const handleDownloadPdf = () => {
    if (!currentCv) {
      return;
    }

    const html = previewRef.current?.innerHTML;
    if (!html) {
      notify('There is no content to export', 'err');
      return;
    }

    downloadCvPdf({ html, title: currentFileName.trim() || buildFileName(profile.name, currentCv.jobTitle || fallbackVacancyLabel), fontId: settings.fontId, sectionCase: currentSectionCase });
    notify('PDF ready', 'ok');
  };

  return (
    <div className="shell">
      <Sidebar
        providerId={settings.providerId}
        apiKey={currentApiKey}
        model={currentModel}
        fontId={settings.fontId}
        formatId={settings.formatId}
        outputLanguage={settings.outputLanguage}
        sectionCase={settings.sectionCase}
        autoFileName={settings.autoFileName}
        jobDesc={jobDesc}
        links={links}
        fileName={currentFileName}
        isLoading={isLoading}
        canExport={Boolean(currentCv)}
        onProviderChange={updateProvider}
        onApiKeyChange={updateApiKey}
        onModelChange={updateModel}
        onFontChange={updateFont}
        onFormatChange={updateFormat}
        onOutputLanguageChange={updateOutputLanguage}
        onSectionCaseChange={updateSectionCase}
        onAutoFileNameChange={updateAutoFileName}
        onJobDescChange={setJobDesc}
        onClearJobDesc={handleClearJobDesc}
        onToggleLink={handleToggleLink}
        onFileNameChange={setFileName}
        onAdapt={handleAdapt}
        onDownloadDocx={handleDownloadDocx}
        onDownloadPdf={handleDownloadPdf}
      />

      <main className="main">
        <Topbar
          status={statusState}
          state={statusState}
          canCopy={Boolean(currentCv)}
          onCopy={handleCopy}
        />
        <div className="content">
          <CvPreview
            ref={previewRef}
            cv={currentCv}
            renderLanguage={renderedLanguage}
            fontId={settings.fontId}
            sectionCase={currentSectionCase}
            links={links}
            profile={profile}
            education={educationDraft}
            isLoading={isLoading}
            onEditJobTitle={handleEditJobTitle}
            onEditProfile={handleEditProfile}
            onEditExperienceBullet={handleEditExperienceBullet}
            onEditProjectField={handleEditProjectField}
            onEditSkill={handleEditSkill}
            onEditCertification={handleEditCertification}
            onEditEducation={handleEditEducation}
          />
        </div>
      </main>

      <ToastStack toasts={toasts} />
    </div>
  );
}
