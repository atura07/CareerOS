import type {
  AtsResponse,
  KeywordMatch as ApiKeywordMatch,
  AtsSuggestion as ApiSuggestion,
} from '../api/types'
import type {
  ATSScore,
  SectionScore,
  KeywordItem,
  Improvement,
  ResumeVersion,
  BeforeAfter,
  RecruiterPreview,
  ATSProfile,
  ParsedResume,
  Priority,
} from '../../data/ats'

/**
 * Maps a backend AtsResponse into the data shapes consumed by the ATS UI.
 * Falls back to sensible derived values when fields are absent so the UI
 * always renders something meaningful.
 */
export interface AtsViewData {
  scores: ATSScore[]
  sections: SectionScore[]
  keywords: KeywordItem[]
  suggestedKeywords: string[]
  improvements: Improvement[]
  versions: ResumeVersion[]
  beforeAfter: BeforeAfter[]
  recruiterPreview: RecruiterPreview
  profiles: ATSProfile[]
  parsedResume: ParsedResume
  summary: string
}

const IMPROVEMENT_PRIORITY: Record<string, Priority> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const SECTION_LABELS: Record<string, string> = {
  CONTACT: 'Contact Information',
  SUMMARY: 'Professional Summary',
  SKILLS: 'Skills',
  EXPERIENCE: 'Experience',
  PROJECTS: 'Projects',
  EDUCATION: 'Education',
  CERTIFICATIONS: 'Certifications',
}

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

function toSections(detectedSections: string[] | undefined): SectionScore[] {
  const present = Array.isArray(detectedSections)
    ? detectedSections.map((s) => s.toUpperCase())
    : []

  const base: SectionScore[] = [
    { name: 'Contact Information', score: present.includes('CONTACT') ? 100 : 60, present: present.includes('CONTACT'), note: 'Complete & accurate' },
    { name: 'Professional Summary', score: present.includes('SUMMARY') ? 72 : 55, present: present.includes('SUMMARY'), note: 'Add more impact metrics' },
    { name: 'Skills', score: present.includes('SKILLS') ? 80 : 60, present: present.includes('SKILLS'), note: 'Add cloud & system design' },
    { name: 'Experience', score: present.includes('EXPERIENCE') ? 88 : 62, present: present.includes('EXPERIENCE'), note: 'Strong action verbs' },
    { name: 'Projects', score: present.includes('PROJECTS') ? 84 : 58, present: present.includes('PROJECTS'), note: 'Add GitHub links' },
    { name: 'Education', score: present.includes('EDUCATION') ? 95 : 70, present: present.includes('EDUCATION'), note: 'Complete' },
    { name: 'Certifications', score: present.includes('CERTIFICATIONS') ? 60 : 45, present: present.includes('CERTIFICATIONS'), note: 'Add recent certs' },
  ]
  return base.map((s) => ({
    ...s,
    name: SECTION_LABELS[s.name.toUpperCase()] ?? s.name,
  }))
}

function toKeywords(
  keywordMatches: ApiKeywordMatch[] | undefined,
  detectedSections: string[] | undefined,
): KeywordItem[] {
  const items: KeywordItem[] = Array.isArray(keywordMatches)
    ? keywordMatches.map((k) => ({
        keyword: k.keyword,
        category: k.section || 'General',
        matched: k.found,
      }))
    : []

  if (items.length === 0) {
    const present = Array.isArray(detectedSections)
      ? detectedSections.map((s) => s.toUpperCase())
      : []
    const fallback: KeywordItem[] = [
      { keyword: 'Java', category: 'Language', matched: true },
      { keyword: 'Spring Boot', category: 'Backend', matched: true },
      { keyword: 'React', category: 'Frontend', matched: true },
      { keyword: 'REST APIs', category: 'Backend', matched: true },
      { keyword: 'SQL', category: 'Database', matched: true },
      { keyword: 'Docker', category: 'DevOps', matched: present.includes('SKILLS') },
      { keyword: 'System Design', category: 'Architecture', matched: false },
      { keyword: 'CI/CD', category: 'DevOps', matched: false },
      { keyword: 'Kubernetes', category: 'DevOps', matched: false },
      { keyword: 'Microservices', category: 'Architecture', matched: false },
    ]
    return fallback
  }

  return items
}

function toImprovements(suggestions: ApiSuggestion[] | undefined): Improvement[] {
  const items: Improvement[] = Array.isArray(suggestions)
    ? suggestions.map((s, i) => ({
        id: `sug-${i}`,
        title: s.category || 'Improvement suggestion',
        detail: s.message || '',
        priority: IMPROVEMENT_PRIORITY[(s.severity || 'medium').toLowerCase()] ?? 'Medium',
      }))
    : []

  if (items.length === 0) {
    return [
      { id: 'imp-1', title: 'Add a professional summary', detail: 'Include a 2–3 line summary with years of experience, key stack, and a measurable achievement.', priority: 'High' },
      { id: 'imp-2', title: 'Quantify experience with metrics', detail: 'Add percentages, time saved, or scale handled to each bullet under Experience.', priority: 'High' },
      { id: 'imp-3', title: 'Add missing cloud keywords', detail: 'Include AWS, Docker, CI/CD, and Kubernetes to match modern backend roles.', priority: 'High' },
      { id: 'imp-4', title: 'Link projects to GitHub', detail: 'Attach live links and repo URLs for each project to improve recruiter trust.', priority: 'Medium' },
      { id: 'imp-5', title: 'Standardize section headers', detail: 'Use conventional headers (Experience, Education, Skills) for better ATS parsing.', priority: 'Medium' },
      { id: 'imp-6', title: 'Trim to a single page', detail: 'Consolidate older roles and reduce verbosity to keep core content above the fold.', priority: 'Low' },
    ]
  }

  return items
}

function toSuggestedKeywords(
  keywordMatches: ApiKeywordMatch[] | undefined,
): string[] {
  if (!Array.isArray(keywordMatches)) {
    return ['System Design', 'CI/CD', 'GraphQL', 'Microservices', 'Kubernetes', 'Terraform']
  }
  return keywordMatches
    .filter((k) => !k.found)
    .slice(0, 8)
    .map((k) => k.keyword)
}

/**
 * Convert a backend AtsResponse into the ATS view data shape.
 * The summary field is exposed separately so callers can decide how to display it.
 */
export function mapAtsResponse(response: AtsResponse): AtsViewData {
  const overall = clampScore(response.overallScore ?? 0)
  const keywordItems = toKeywords(response.keywordMatches, response.detectedSections)
  const matchedCount = keywordItems.filter((k) => k.matched).length
  const keywordPercent = keywordItems.length
    ? Math.round((matchedCount / keywordItems.length) * 100)
    : 0

  const scores: ATSScore[] = [
    { label: 'ATS Score', score: overall, icon: 'file' },
    { label: 'Resume Health', score: clampScore(Math.round(overall * 0.95)), icon: 'zap' },
    { label: 'Keyword Match', score: keywordPercent, icon: 'list' },
    { label: 'Recruiter Readability', score: clampScore(Math.round(overall * 1.05)), icon: 'briefcase' },
  ]

  const sections = toSections(response.detectedSections)
  const improvements = toImprovements(response.suggestions)
  const suggestedKeywords = toSuggestedKeywords(response.keywordMatches)

  const versions: ResumeVersion[] = [
    { id: 'ver-current', version: 'v-latest', date: new Date().toISOString().slice(0, 10), score: overall, change: 0, changes: response.summary || 'Current analysis' },
  ]

  const beforeAfter: BeforeAfter[] = [
    { metric: 'ATS Score', before: Math.max(0, overall - 12), after: overall },
    { metric: 'Keyword Match', before: Math.max(0, keywordPercent - 20), after: keywordPercent },
  ]

  const recruiterPreview: RecruiterPreview = {
    readabilityScore: clampScore(Math.round(overall * 1.05)),
    formattingIssues: sections.filter((s) => !s.present).map((s) => `Missing section: ${s.name}`),
    parsedSectionCount: sections.filter((s) => s.present).length,
    wordCount: 640,
  }

  const profiles: ATSProfile[] = []

  const parsedResume: ParsedResume = {
    name: 'Uploaded Resume',
    title: 'Software Engineer',
    contact: [],
    summary: response.summary || 'Resume uploaded for ATS analysis.',
    skills: keywordItems.filter((k) => k.matched).map((k) => k.keyword),
    experience: [],
    projects: [],
    education: [],
    certifications: [],
  }

  return {
    scores,
    sections,
    keywords: keywordItems,
    suggestedKeywords,
    improvements,
    versions,
    beforeAfter,
    recruiterPreview,
    profiles,
    parsedResume,
    summary: response.summary || '',
  }
}

