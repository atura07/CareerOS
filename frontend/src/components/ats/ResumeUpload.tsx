import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

interface ResumeUploadProps {
  onUploaded: (file: File) => void
  isUploading?: boolean
}

export function ResumeUpload({ onUploaded, isUploading = false }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      setError('Only PDF and DOCX files are accepted.')
      return
    }
    setError(null)
    setFileName(file.name)
    onUploaded(file)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleBrowse = () => inputRef.current?.click()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur sm:p-6">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-white/70">Upload Resume</h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleBrowse()
        }}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
          dragOver
            ? 'border-blue-400/50 bg-blue-500/8'
            : 'border-white/[0.10] hover:border-white/[0.20] hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="hidden"
          aria-hidden
        />
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200 ${
            dragOver ? 'scale-110 bg-blue-500/20' : 'bg-white/[0.04]'
          }`}
        >
          {dragOver ? (
            <Upload className="h-6 w-6 text-blue-400" />
          ) : (
            <FileText className="h-6 w-6 text-white/40" />
          )}
        </div>
        <p className="text-sm font-medium text-white/70">
          <span className="text-blue-400">Click to browse</span> or drag and drop
        </p>
        <p className="mt-1 text-xs text-white/40">PDF or DOCX &middot; Max 5 MB</p>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/8 p-3 text-xs text-red-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {fileName && !error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{fileName} ready for analysis</span>
        </div>
      )}

      {isUploading && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-white/50">
            <span>Analyzing resume...</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
          </div>
        </div>
      )}
    </div>
  )
}
