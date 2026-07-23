import type { ResumeFile, ResumeTag } from './types'

export const RESUME_TAGS: ResumeTag[] = [
  { id: 'general', label: 'General', color: 'blue' },
  { id: 'software', label: 'Software', color: 'emerald' },
  { id: 'product', label: 'Product', color: 'purple' },
  { id: 'data', label: 'Data Science', color: 'amber' },
  { id: 'design', label: 'Design', color: 'pink' },
  { id: 'finance', label: 'Finance', color: 'cyan' },
  { id: 'consulting', label: 'Consulting', color: 'orange' },
  { id: 'academia', label: 'Academia', color: 'rose' },
]

export const AVAILABLE_TAGS = RESUME_TAGS

export const MOCK_RESUMES: ResumeFile[] = [
  {
    id: 'res-1',
    name: 'SDE Resume',
    originalName: 'SDE_Resume_Amazon.pdf',
    fileSize: 1_240_000,
    fileType: 'pdf',
    uploadedAt: '2026-07-20T10:30:00Z',
    tags: ['software'],
    isDefault: true,
  },
  {
    id: 'res-2',
    name: 'Product Resume',
    originalName: 'Product_Manager_Resume.docx',
    fileSize: 890_000,
    fileType: 'docx',
    uploadedAt: '2026-07-18T14:15:00Z',
    tags: ['product'],
    isDefault: false,
  },
  {
    id: 'res-3',
    name: 'Data Science',
    originalName: 'Data_Scientist_Resume.pdf',
    fileSize: 1_100_000,
    fileType: 'pdf',
    uploadedAt: '2026-07-15T09:00:00Z',
    tags: ['data'],
    isDefault: false,
  },
  {
    id: 'res-4',
    name: 'General Resume',
    originalName: 'General_Resume.pdf',
    fileSize: 720_000,
    fileType: 'pdf',
    uploadedAt: '2026-07-10T16:45:00Z',
    tags: ['general'],
    isDefault: false,
  },
]

