import type { CertificationEntry, EducationEntry, ExperienceEntry, Language, Profile, ProjectEntry, SkillEntry } from '../types/cv';

interface BuildPromptParams {
  jobDesc: string;
  lang: Language;
  profile: Profile;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
}

export function buildPrompt({ jobDesc, lang, profile, experience, projects, skills, education, certifications }: BuildPromptParams): string {
  const langInstr = lang === 'en'
    ? 'IMPORTANT: Generate the ENTIRE output in ENGLISH. All bullets, profile, section names, everything must be in English.'
    : 'Genera todo el contenido en ESPAÑOL.';

  return `You are a senior HR consultant and professional CV writer with 15+ years of experience. Your task: adapt a structured semantic CV to a specific job posting with maximum relevance and precision. DO NOT invent information.

${langInstr}

ATS CONSTRAINTS:
- Use standard section headings only.
- Avoid tables, columns, text boxes, icons, emojis, decorative separators, or visual gimmicks.
- Keep the structure linear, simple, and parseable by ATS systems.
- Prefer concise, factual phrasing with conventional job titles and skill names.

## STRUCTURED CV DATA

### PERSONAL PROFILE
${JSON.stringify(profile, null, 2)}

### EXPERIENCE (semantic structure)
${JSON.stringify(experience, null, 2)}

### PROJECTS
${JSON.stringify(projects, null, 2)}

### SKILLS (with levels)
${JSON.stringify(skills, null, 2)}

### EDUCATION
${JSON.stringify(education, null, 2)}

### CERTIFICATIONS
${JSON.stringify(certifications, null, 2)}

## JOB POSTING
${jobDesc}

## ADAPTATION RULES

### MATCH GATE
- First estimate the semantic fit of the vacancy against the candidate profile.
- Return a matchScore from 0 to 100 based on role fit, skills, domain, experience level, education, and certifications.
- Use matchAllowed: true only when the fit is at least 60.
- If the fit is below 60, set matchAllowed: false, explain the main gap in matchReason, and do not force an adaptation.
- Do not block by years alone; consider transferable skills and adjacent experience.

### PROFESSIONAL PROFILE
- Maximum 5 lines of flowing text, no bullets
- Explicitly mention technologies/competencies from the job posting that the candidate ACTUALLY HAS
- Direct, professional tone
- Highlight the strongest differentiator for THIS specific job
- Do NOT start with "I am" or "Soy"

### JOB TITLE
- Exact title matching what the company seeks (4-5 words max)

### EXPERIENCE SELECTION
- Choose 3-4 most relevant roles based on domain, technologies, and responsibility types
- Per role: select 3-5 most aligned bullets from responsibilities array
- Use responsibility descriptions directly, reformulating slightly for fit
- Internships: mark isPracticas = true
- Current roles (end_date null): use present tense; finished roles: past tense
- Reorder roles by relevance to this job (not necessarily chronological)

### PROJECTS
- Select 2-3 most relevant projects based on domain and technologies
- Match project type to job requirements

### SKILLS OUTPUT
- Group into meaningful categories for THIS job
- Prioritize categories most relevant to the role
- Use only skills from the SKILLS array
- Format each category value as: "Skill1 · Skill2 · Skill3"

### CERTIFICATIONS
- Order by relevance field matching job requirements
- Include 3-4 most relevant

### EDUCATION ORDER
- educationOrder: [0,1] or [1,0] based on relevance

### FILE NAME
- If the system asks for a file name, return the applicant's first name, first surname, the adapted job title, and CV.
- Use snake_case, no accents, no extra qualifiers.
- Example: Javier_Castillo_Frontend_Developer_CV.

## RESPONSE FORMAT
Respond ONLY with valid JSON, no markdown, no extra text:

{
  "fileName": "cv-adaptado",
  "matchScore": 100,
  "matchAllowed": true,
  "matchReason": "",
  "jobTitle": "...",
  "profile": "...",
  "experience": [
    {
      "title": "...",
      "company": "...",
      "period": "...",
      "location": "...",
      "isPracticas": false,
      "bullets": ["...", "..."]
    }
  ],
  "projects": [
    { "name": "...", "desc": "...", "period": "...", "tech": "..." }
  ],
  "skills": {
    "Category": "Skill1 · Skill2"
  },
  "certifications": ["cert – issuer"],
  "educationOrder": [0, 1]
}`;
}
