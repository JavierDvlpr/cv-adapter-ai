import { forwardRef } from 'react';
import type { CvAdaptationResult, CvFontId, EducationEntry, Language, LinkState, Profile } from '../types/cv';
import Harvard from '../templates/Harvard';

interface CvPreviewProps {
  cv: CvAdaptationResult | null;
  renderLanguage: Language;
  fontId: CvFontId;
  sectionCase: 'uppercase' | 'capitalize';
  links: LinkState;
  profile: Profile;
  education: EducationEntry[];
  isLoading: boolean;
  onEditJobTitle: (value: string) => void;
  onEditProfile: (value: string) => void;
  onEditExperienceBullet: (experienceIndex: number, bulletIndex: number, value: string) => void;
  onEditProjectField: (projectIndex: number, field: 'name' | 'desc' | 'tech' | 'period', value: string) => void;
  onEditSkill: (category: string, value: string) => void;
  onEditCertification: (index: number, value: string) => void;
  onEditEducation: (index: number, field: 'degree' | 'institution' | 'period' | 'location', value: string) => void;
}

export const CvPreview = forwardRef<HTMLDivElement, CvPreviewProps>(function CvPreview({
  cv,
  renderLanguage,
  fontId,
  sectionCase,
  links,
  profile,
  education,
  isLoading,
  onEditJobTitle,
  onEditProfile,
  onEditExperienceBullet,
  onEditProjectField,
  onEditSkill,
  onEditCertification,
  onEditEducation
}, ref) {
  if (isLoading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <div className="loading-msg">Analyzing content...</div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="empty-state">
        <div className="empty-icon">CV / AI</div>
        <h3>Paste a job description to start</h3>
        <p>The CV adapts automatically from the job context.</p>
      </div>
    );
  }

  return (
    <div className="preview-wrap" ref={ref} data-font={fontId} data-section-case={sectionCase}>
      <Harvard
        cv={cv}
        profile={profile}
        education={education}
        links={links}
        renderLanguage={renderLanguage}
        sectionCase={sectionCase}
        onEditJobTitle={onEditJobTitle}
        onEditProfile={onEditProfile}
        onEditExperienceBullet={onEditExperienceBullet}
        onEditProjectField={onEditProjectField}
        onEditSkill={onEditSkill}
        onEditCertification={onEditCertification}
        onEditEducation={onEditEducation}
      />
    </div>
  );
});

CvPreview.displayName = 'CvPreview';
