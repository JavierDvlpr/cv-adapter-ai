import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import type { CvAdaptationResult, EducationEntry, Language, LinkState, Profile } from '../types/cv';

interface HarvardProps {
  cv: CvAdaptationResult;
  profile: Profile;
  education: EducationEntry[];
  links: LinkState;
  renderLanguage: Language;
  sectionCase: 'uppercase' | 'capitalize';
  onEditJobTitle?: (value: string) => void;
  onEditProfile?: (value: string) => void;
  onEditExperienceBullet?: (experienceIndex: number, bulletIndex: number, value: string) => void;
  onEditProjectField?: (projectIndex: number, field: 'name' | 'desc' | 'tech' | 'period', value: string) => void;
  onEditSkill?: (category: string, value: string) => void;
  onEditCertification?: (index: number, value: string) => void;
  onEditEducation?: (index: number, field: 'degree' | 'institution' | 'period' | 'location', value: string) => void;
}

function EditableText({ value, onCommit, className, style }: { value: string; onCommit: (v: string) => void; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onCommit(e.currentTarget.innerText)}
    >
      {value}
    </div>
  );
}

const L = {
  es: {
    profile: 'Perfil profesional',
    experience: 'Experiencia profesional',
    education: 'Educación',
    skills: 'Habilidades técnicas',
    certifications: 'Certificaciones',
    internship: 'Prácticas'
  },
  en: {
    profile: 'Professional Profile',
    experience: 'Professional Experience',
    education: 'Education',
    skills: 'Technical Skills',
    certifications: 'Certifications',
    internship: 'Internship'
  }
};

export const Harvard = forwardRef<HTMLDivElement, HarvardProps>(function Harvard({
  cv,
  profile,
  education,
  links,
  renderLanguage,
  sectionCase: _sectionCase,
  onEditJobTitle,
  onEditProfile,
  onEditExperienceBullet,
  onEditProjectField,
  onEditSkill,
  onEditCertification,
  onEditEducation
}, ref) {
  const t = L[renderLanguage];

  const toVisibleUrl = (url: string) =>
    url
      .replace(/^https?:\/\//i, '')
      .replace(/\/$/, '');

  const contactItems: ReactNode[] = [
    links.email && (
      <a key="email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
    ),
    links.phone && (
      <a key="phone" href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
        {profile.phone}
      </a>
    ),
    <span key="location">{profile.location}</span>,
    links.linkedin && (
      <a key="linkedin" href={profile.linkedin.url} target="_blank" rel="noreferrer noopener">
        {toVisibleUrl(profile.linkedin.url)}
      </a>
    ),
    links.github && (
      <a key="github" href={profile.github.url} target="_blank" rel="noreferrer noopener">
        {toVisibleUrl(profile.github.url)}
      </a>
    ),
    links.portfolio && (
      <a key="portfolio" href={profile.portfolio.url} target="_blank" rel="noreferrer noopener">
        {toVisibleUrl(profile.portfolio.url)}
      </a>
    )
  ].filter(Boolean) as ReactNode[];

  return (
    <div ref={ref} className="cv-page">
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div className="cv-name">
          {profile.name}
        </div>
        <EditableText
          value={cv.jobTitle}
          onCommit={onEditJobTitle || (() => {})}
          className="cv-subtitle editable-inline"
        />
      </div>

      <div className="cv-contact">
        {contactItems.map((item, index) => (
          <span key={index}>
            {index > 0 ? ' · ' : ''}
            {item}
          </span>
        ))}
      </div>

      <hr className="cv-hr" />

      <div className="cv-block">
        <div className="cv-section">
          {t.profile}
        </div>
        <EditableText
          value={cv.profile}
          onCommit={onEditProfile || (() => {})}
          className="cv-profile editable-block"
        />
      </div>

      {cv.experience && cv.experience.length > 0 && (
        <div className="cv-block">
          <div className="cv-section">
            {t.experience}
          </div>
          {cv.experience.map((job, i) => (
            <div key={i} className="cv-block">
              <div className="cv-job-row">
                <div className="cv-job-title">
                  {job.title}
                  {job.isPracticas && <span className="cv-job-co"> ({t.internship})</span>}
                </div>
                <div className="cv-job-date">{job.period}</div>
              </div>
              <div className="cv-job-loc">
                {job.company} — {job.location}
              </div>
              <ul className="cv-bullets">
                {job.bullets.map((bullet, j) => (
                  <li key={j}>
                    <EditableText
                      value={bullet}
                      onCommit={(value) => (onEditExperienceBullet ? onEditExperienceBullet(i, j, value) : undefined)}
                      className="editable-line"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <div className="cv-block">
          <div className="cv-section">
            {renderLanguage === 'es' ? 'Proyectos destacados' : 'Key Projects'}
          </div>
          {cv.projects.map((project, i) => (
            <div key={i} className="cv-block">
              <div className="cv-proj-row">
                <EditableText
                  value={project.name}
                  onCommit={(value) => (onEditProjectField ? onEditProjectField(i, 'name', value) : undefined)}
                  className="cv-proj-name editable-inline"
                />
                <EditableText
                  value={project.period}
                  onCommit={(value) => (onEditProjectField ? onEditProjectField(i, 'period', value) : undefined)}
                  className="cv-job-date editable-inline"
                />
              </div>
              <EditableText
                value={project.tech}
                onCommit={(value) => (onEditProjectField ? onEditProjectField(i, 'tech', value) : undefined)}
                className="cv-proj-tech editable-inline"
              />
              <EditableText
                value={project.desc}
                onCommit={(value) => (onEditProjectField ? onEditProjectField(i, 'desc', value) : undefined)}
                className="cv-proj-desc editable-block"
              />
            </div>
          ))}
        </div>
      )}

      {cv.skills && Object.keys(cv.skills).length > 0 && (
        <div className="cv-block">
          <div className="cv-section">
            {t.skills}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.entries(cv.skills).map(([category, value]) => (
              <div key={category} className="cv-skill-row">
                <span style={{ fontWeight: 700 }}>{category}:</span>{' '}
                <EditableText
                  value={value}
                  onCommit={(next) => (onEditSkill ? onEditSkill(category, next) : undefined)}
                  className="editable-inline"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="cv-block">
          <div className="cv-section">
            {t.education}
          </div>
          {(cv.educationOrder || [0, 1]).map((idx) => {
            const edu = education[idx];
            if (!edu) return null;
            return (
              <div key={idx} className="cv-edu-copy">
                <EditableText
                  value={edu.degree}
                  onCommit={(value) => (onEditEducation ? onEditEducation(idx, 'degree', value) : undefined)}
                  className="cv-edu-name editable-inline"
                />
                <div className="cv-edu-inst">
                  <EditableText
                    value={edu.institution}
                    onCommit={(value) => (onEditEducation ? onEditEducation(idx, 'institution', value) : undefined)}
                    className="editable-inline"
                  />
                  {' · '}
                  <EditableText
                    value={edu.period}
                    onCommit={(value) => (onEditEducation ? onEditEducation(idx, 'period', value) : undefined)}
                    className="editable-inline"
                  />
                  {' · '}
                  <EditableText
                    value={edu.location}
                    onCommit={(value) => (onEditEducation ? onEditEducation(idx, 'location', value) : undefined)}
                    className="editable-inline"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cv.certifications && cv.certifications.length > 0 && (
        <div>
          <div className="cv-section">
            {t.certifications}
          </div>
          <ul className="cv-cert">
            {cv.certifications.slice(0, 4).map((cert, i) => (
              <li key={i}>
                <EditableText
                  value={cert}
                  onCommit={(value) => (onEditCertification ? onEditCertification(i, value) : undefined)}
                  className="editable-line"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

Harvard.displayName = 'Harvard';
export default Harvard;
