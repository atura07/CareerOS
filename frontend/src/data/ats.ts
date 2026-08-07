export type Priority = 'High' | 'Medium' | 'Low'

export interface ATSScore {
  label: string
  score: number
  icon: 'file' | 'zap' | 'list' | 'briefcase'
}

export interface SectionScore {
  name: string
  score: number
  present: boolean
  note: string
}

export interface KeywordItem {
  keyword: string
  category: string
  matched: boolean
}

export interface Improvement {
  id: string
  title: string
  detail: string
  priority: Priority
}

export interface ResumeVersion {
  id: string
  version: string
  date: string
  score: number
  change: number
  changes: string
}

export interface BeforeAfter {
  metric: string
  before: number
  after: number
}

export interface RecruiterPreview {
  readabilityScore: number
  formattingIssues: string[]
  parsedSectionCount: number
  wordCount: number
}

export interface ATSProfile {
  id: string
  role: string
  icon: 'code' | 'layout' | 'server' | 'layers' | 'chart' | 'bot'
  score: number
  matchedKeywords: number
  totalKeywords: number
  strengths: string[]
  gaps: string[]
}

export interface ParsedResume {
  name: string
  title: string
  contact: string[]
  summary: string
  skills: string[]
  experience: string[]
  projects: string[]
  education: string[]
  certifications: string[]
}

export const ATS_SCORES: ATSScore[] = [
  { label: 'ATS Score', score: 82, icon: 'file' },
  { label: 'Resume Health', score: 78, icon: 'zap' },
  { label: 'Keyword Match', score: 76, icon: 'list' },
  { label: 'Recruiter Readability', score: 86, icon: 'briefcase' },
]

export const SECTION_SCORES: SectionScore[] = [
  { name: 'Contact Information', score: 100, present: true, note: 'Complete & accurate' },
  { name: 'Professional Summary', score: 72, present: true, note: 'Add more impact metrics' },
  { name: 'Skills', score: 80, present: true, note: 'Add cloud & system design' },
  { name: 'Experience', score: 88, present: true, note: 'Strong action verbs' },
  { name: 'Projects', score: 84, present: true, note: 'Add GitHub links' },
  { name: 'Education', score: 95, present: true, note: 'Complete' },
  { name: 'Certifications', score: 60, present: true, note: 'Add recent certs' },
]

export const KEYWORDS: KeywordItem[] = [
  { keyword: 'React', category: 'Frontend', matched: true },
  { keyword: 'TypeScript', category: 'Language', matched: true },
  { keyword: 'Node.js', category: 'Backend', matched: true },
  { keyword: 'REST APIs', category: 'Backend', matched: true },
  { keyword: 'AWS', category: 'Cloud', matched: true },
  { keyword: 'Docker', category: 'DevOps', matched: true },
  { keyword: 'System Design', category: 'Architecture', matched: false },
  { keyword: 'CI/CD', category: 'DevOps', matched: false },
  { keyword: 'GraphQL', category: 'Backend', matched: false },
  { keyword: 'Microservices', category: 'Architecture', matched: false },
  { keyword: 'Kubernetes', category: 'DevOps', matched: false },
  { keyword: 'Terraform', category: 'DevOps', matched: false },
]

export const SUGGESTED_KEYWORDS: string[] = [
  'System Design',
  'CI/CD',
  'GraphQL',
  'Microservices',
  'Kubernetes',
  'Terraform',
  'Performance Optimization',
  'Agile / Scrum',
]

export const IMPROVEMENTS: Improvement[] = [
  {
    id: 'imp-1',
    title: 'Add a professional summary',
    detail: 'Include a 2–3 line summary with years of experience, key stack, and a measurable achievement.',
    priority: 'High',
  },
  {
    id: 'imp-2',
    title: 'Quantify experience with metrics',
    detail: 'Add percentages, time saved, or scale handled to each bullet under Experience.',
    priority: 'High',
  },
  {
    id: 'imp-3',
    title: 'Add missing cloud keywords',
    detail: 'Include AWS, Docker, CI/CD, and Kubernetes to match modern backend roles.',
    priority: 'High',
  },
  {
    id: 'imp-4',
    title: 'Link projects to GitHub',
    detail: 'Attach live links and repo URLs for each project to improve recruiter trust.',
    priority: 'Medium',
  },
  {
    id: 'imp-5',
    title: 'Standardize section headers',
    detail: 'Use conventional headers (Experience, Education, Skills) for better ATS parsing.',
    priority: 'Medium',
  },
  {
    id: 'imp-6',
    title: 'Trim to a single page',
    detail: 'Consolidate older roles and reduce verbosity to keep core content above the fold.',
    priority: 'Low',
  },
]

export const RESUME_VERSIONS: ResumeVersion[] = [
  { id: 'ver-3', version: 'v3', date: '2026-07-20', score: 82, change: 6, changes: 'Added metrics & cloud keywords' },
  { id: 'ver-2', version: 'v2', date: '2026-06-28', score: 76, change: 9, changes: 'Restructured sections & summary' },
  { id: 'ver-1', version: 'v1', date: '2026-05-15', score: 67, change: 0, changes: 'Initial template' },
]

export const BEFORE_AFTER: BeforeAfter[] = [
  { metric: 'ATS Score', before: 67, after: 82 },
  { metric: 'Keyword Match', before: 52, after: 76 },
  { metric: 'Resume Health', before: 61, after: 78 },
  { metric: 'Recruiter Readability', before: 71, after: 86 },
]

export const RECRUITER_PREVIEW: RecruiterPreview = {
  readabilityScore: 86,
  formattingIssues: [
    'Inconsistent bullet indentation',
    'Overly long summary paragraph',
    'Missing section for certifications',
    'Two-column layout may confuse parsing',
  ],
  parsedSectionCount: 7,
  wordCount: 640,
}

export const ATS_PROFILES: ATSProfile[] = [
  {
    id: 'software-ed',
    role: 'Software Engineer',
    icon: 'code',
    score: 84,
    matchedKeywords: 18,
    totalKeywords: 24,
    strengths: ['Strong DSA fundamentals', 'Clean code practices'],
    gaps: ['Add distributed systems terminology'],
  },
  {
    id: 'frontend',
    role: 'Frontend Developer',
    icon: 'layout',
    score: 88,
    matchedKeywords: 20,
    totalKeywords: 24,
    strengths: ['Deep React & TypeScript', 'Strong UI/UX awareness'],
    gaps: ['Add accessibility and testing keywords'],
  },
  {
    id: 'backend',
    role: 'Backend Developer',
    icon: 'server',
    score: 79,
    matchedKeywords: 17,
    totalKeywords: 24,
    strengths: ['REST API & Node.js experience'],
    gaps: ['Add database tuning and caching'],
  },
  {
    id: 'fullstack',
    role: 'Full Stack Developer',
    icon: 'layers',
    score: 81,
    matchedKeywords: 19,
    totalKeywords: 24,
    strengths: ['Broad full-stack coverage'],
    gaps: ['Add deployment and scaling keywords'],
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst',
    icon: 'chart',
    score: 74,
    matchedKeywords: 15,
    totalKeywords: 24,
    strengths: ['SQL & data visualization basics'],
    gaps: ['Add Python, Pandas, and BI tools'],
  },
  {
    id: 'ml-engineer',
    role: 'ML Engineer',
    icon: 'bot',
    score: 71,
    matchedKeywords: 14,
    totalKeywords: 24,
    strengths: ['Python & basic ML concepts'],
    gaps: ['Add TensorFlow, PyTorch, MLOps'],
  },
]

export const PARSED_RESUME: ParsedResume = {
  name: 'Aarav Sharma',
  title: 'Software Engineer',
  contact: ['aarav.sharma@email.com', '+91 98765 43210', 'Bengaluru, India', 'github.com/aaravsharma'],
  summary:
    'Full-stack engineer with 3+ years building scalable web applications using React, TypeScript, and Node.js. Passionate about clean architecture and performance optimization.',
  skills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'AWS', 'Docker', 'PostgreSQL', 'Git'],
  experience: [
    'Backend Engineer — TechCorp (2023–Present): Built REST APIs handling 10k+ requests/min using Node.js and PostgreSQL.',
    'Frontend Developer — StartupX (2021–2023): Shipped React features improving conversion by 18%.',
  ],
  projects: [
    'CareerOS — Full-stack placement platform (React, Node, PostgreSQL).',
    'E-commerce Dashboard — Real-time analytics dashboard (React, WebSockets).',
  ],
  education: ['B.Tech in Computer Science — NIT Hyderabad (2021), CGPA 8.6'],
  certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Developer'],
}
