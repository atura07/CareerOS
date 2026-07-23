export interface ResumeFile {
  id: string
  name: string
  originalName: string
  fileSize: number
  fileType: 'pdf' | 'docx'
  uploadedAt: string // ISO date string
  tags: string[]
  isDefault: boolean
}

export interface ResumeTag {
  id: string
  label: string
  color: string // tailwind color class
}

export type ViewMode = 'grid' | 'list'
export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

