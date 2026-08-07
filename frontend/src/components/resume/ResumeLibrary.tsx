import { useState, useCallback, useMemo, useEffect } from 'react'
import type { ResumeFile, ViewMode, SortOption } from './types'
import { MOCK_RESUMES, AVAILABLE_TAGS } from './resumeData'
import { ResumeToolbar } from './ResumeToolbar'
import { ResumeCardGrid } from './ResumeCardGrid'
import { ResumeListView } from './ResumeListView'
import { ResumeEmptyState } from './ResumeEmptyState'
import { ResumeRenameModal } from './ResumeRenameModal'
import { ResumeGridSkeleton, ResumeListSkeleton } from './ResumeSkeleton'
import { listResumes } from '../../services/api'

function mapBackendResume(r: any): ResumeFile {
  const fileType = r.fileType === 'docx' ? 'docx' : 'pdf'
  return {
    id: String(r.id),
    name: r.originalFileName.replace(/\.[^/.]+$/, ''),
    originalName: r.originalFileName,
    fileSize: r.fileSize,
    fileType,
    uploadedAt: r.uploadDate,
    tags: [],
    isDefault: false,
  }
}

interface ResumeLibraryProps {
  refreshCounter?: number
  onSelectResume?: (resume: ResumeFile) => void
}

export function ResumeLibrary({ refreshCounter = 0, onSelectResume }: ResumeLibraryProps) {
  const [resumes, setResumes] = useState<ResumeFile[]>(MOCK_RESUMES)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [renaming, setRenaming] = useState<ResumeFile | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchResumes() {
      setLoading(true)
      try {
        const data = await listResumes(1)
        if (!cancelled) {
          setResumes(data.map(mapBackendResume))
        }
      } catch {
        if (!cancelled) {
          setResumes(MOCK_RESUMES)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResumes()
    return () => { cancelled = true }
  }, [refreshCounter])

  // Filter + search
  const filteredResumes = useMemo(() => {
    let list = [...resumes]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.originalName.toLowerCase().includes(q),
      )
    }

    // Tag filter
    if (activeTags.length > 0) {
      list = list.filter((r) =>
        activeTags.some((tagId) => r.tags.includes(tagId)),
      )
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        list.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        )
        break
      case 'oldest':
        list.sort(
          (a, b) =>
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
        )
        break
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return list
  }, [resumes, searchQuery, activeTags, sortOption])

  const handleSelectResume = useCallback((resume: ResumeFile) => {
    onSelectResume?.(resume)
  }, [onSelectResume])

  const handleToggleTag = useCallback((tagId: string) => {
    if (tagId === '__clear__') {
      setActiveTags([])
      return
    }
    setActiveTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    )
  }, [])

  const handleRename = useCallback((resume: ResumeFile) => {
    setRenaming(resume)
  }, [])

  const handleRenameSave = useCallback((newName: string) => {
    if (!renaming) return
    setResumes((prev) =>
      prev.map((r) =>
        r.id === renaming.id ? { ...r, name: newName } : r,
      ),
    )
    setRenaming(null)
  }, [renaming])

  const handleDelete = useCallback((resume: ResumeFile) => {
    setResumes((prev) => prev.filter((r) => r.id !== resume.id))
  }, [])

  const handleSetDefault = useCallback((resume: ResumeFile) => {
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        isDefault: r.id === resume.id ? !r.isDefault : false,
      })),
    )
  }, [])

  const handleUpload = useCallback(() => {
    // Scroll to upload zone — will be implemented when real upload is ready
    document
      .getElementById('resume-upload-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }, [])

return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ResumeToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortOption={sortOption}
        onSortChange={setSortOption}
        activeTags={activeTags}
        availableTags={AVAILABLE_TAGS}
        onToggleTag={handleToggleTag}
      />

      {/* Content */}
      {loading ? (
        viewMode === 'grid' ? (
          <ResumeGridSkeleton />
        ) : (
          <ResumeListSkeleton />
        )
      ) : filteredResumes.length === 0 ? (
        <ResumeEmptyState onUpload={handleUpload} />
      ) : viewMode === 'grid' ? (
        <ResumeCardGrid
          resumes={filteredResumes}
          onSelect={handleSelectResume}
          onRename={handleRename}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      ) : (
        <ResumeListView
          resumes={filteredResumes}
          onSelect={handleSelectResume}
          onRename={handleRename}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      )}

      {/* Results count */}
      {!loading && filteredResumes.length > 0 && (
        <p className="text-xs text-white/30 text-center sm:text-right">
          Showing {filteredResumes.length} of {resumes.length} resume
          {resumes.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Rename modal */}
      <ResumeRenameModal
        open={!!renaming}
        currentName={renaming?.name ?? ''}
        onClose={() => setRenaming(null)}
        onSave={handleRenameSave}
      />
    </div>
  )
}

