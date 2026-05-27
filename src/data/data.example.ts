import type { CertificationEntry, EducationEntry, ExperienceEntry, Profile, ProjectEntry, SkillEntry } from '../types/cv';

export const profile: Profile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 555 123 4567',
  location: 'San Francisco, USA',
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe/' },
  github: { label: 'GitHub', url: 'https://github.com/johndoe' },
  portfolio: { label: 'Portfolio', url: 'https://johndoe.dev' }
};

export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Software Engineer',
    company: 'Tech Corporation',
    location: 'San Francisco, USA',
    start_date: '2023-01',
    end_date: null,
    type: 'full_time',
    domain: ['saas', 'cloud computing', 'enterprise software'],
    business_context: ['high-scale systems', 'microservices', 'infrastructure'],
    responsibilities: [
      { type: 'backend', description: 'Led backend architecture redesign for 10x scalability using Node.js and Kubernetes.' },
      { type: 'fullstack', description: 'Developed end-to-end features with React and Express for core product offerings.' },
      { type: 'devops', description: 'Implemented CI/CD pipelines and container orchestration for 30+ microservices.' }
    ],
    technologies: ['Node.js', 'React', 'Express', 'Kubernetes', 'PostgreSQL', 'Docker', 'AWS'],
    achievements: [{ metric: '10x', description: 'System scalability improvement' }]
  },
  {
    role: 'Full Stack Developer',
    company: 'StartUp Inc.',
    location: 'Austin, USA',
    start_date: '2021-06',
    end_date: '2022-12',
    type: 'full_time',
    domain: ['fintech', 'payments', 'mobile'],
    business_context: ['rapid scaling', 'payment processing', 'user growth'],
    responsibilities: [
      { type: 'fullstack', description: 'Built payment processing platform with React Native and Python backend.' },
      { type: 'backend', description: 'Designed API architecture handling 100k+ daily transactions.' }
    ],
    technologies: ['React Native', 'Python', 'FastAPI', 'MongoDB', 'Stripe API'],
    achievements: [{ metric: '100k+', description: 'Daily transactions processed' }]
  }
];

export const projects: ProjectEntry[] = [
  { name: 'CloudSync Platform', description: 'Real-time file synchronization service with end-to-end encryption using WebSockets and Node.js.', period: 'Jan. 2024 – Present', technologies: ['Node.js', 'React', 'WebSockets', 'Encryption'], domain: ['cloud storage', 'security'], type: 'saas' },
  { name: 'Analytics Dashboard', description: 'Interactive business intelligence dashboard with real-time metrics and custom reports.', period: 'Jun. 2023 – Nov. 2023', technologies: ['React', 'D3.js', 'Express', 'PostgreSQL'], domain: ['analytics', 'reporting'], type: 'saas' },
  { name: 'Mobile Payment App', description: 'iOS/Android payment app with biometric authentication and transaction history.', period: 'Mar. 2022 – Aug. 2022', technologies: ['React Native', 'TypeScript', 'Firebase'], domain: ['fintech', 'mobile'], type: 'mobile' }
];

export const skills: SkillEntry[] = [
  { technology: 'JavaScript', level: 'advanced', category: 'frontend' },
  { technology: 'TypeScript', level: 'advanced', category: 'frontend' },
  { technology: 'React', level: 'advanced', category: 'frontend' },
  { technology: 'React Native', level: 'intermediate', category: 'frontend' },
  { technology: 'Node.js', level: 'advanced', category: 'backend' },
  { technology: 'Express', level: 'advanced', category: 'backend' },
  { technology: 'Python', level: 'intermediate', category: 'backend' },
  { technology: 'FastAPI', level: 'intermediate', category: 'backend' },
  { technology: 'PostgreSQL', level: 'advanced', category: 'database' },
  { technology: 'MongoDB', level: 'intermediate', category: 'database' },
  { technology: 'Docker', level: 'intermediate', category: 'devops' },
  { technology: 'Kubernetes', level: 'intermediate', category: 'devops' },
  { technology: 'AWS', level: 'intermediate', category: 'cloud' },
  { technology: 'Git', level: 'advanced', category: 'tools' }
];

export const education: EducationEntry[] = [
  { degree: 'Bachelor of Science in Computer Science', institution: 'State University', period: '2017 – 2021', location: 'Austin, USA' },
  { degree: 'AWS Certified Solutions Architect', institution: 'Amazon Web Services', period: 'Jun. 2023', location: 'Online' }
];

export const certifications: CertificationEntry[] = [
  { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', relevance: ['aws', 'cloud', 'architecture'] },
  { name: 'Kubernetes Administrator', issuer: 'Linux Foundation', relevance: ['kubernetes', 'devops', 'containers'] },
  { name: 'React Advanced Patterns', issuer: 'Frontend Masters', relevance: ['react', 'javascript', 'frontend'] }
];
