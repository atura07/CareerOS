import { useState } from 'react'
import { motion } from 'framer-motion'
import { ResumeUploader, ResumeLibrary, ResumePreview, JobDescriptionAnalyzer } from '../components/resume'
import type { ResumeFile } from '../components/resume'

export function ResumePage() {
  const [selectedResume, setSelectedResume] = useState<ResumeFile | null>(null)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshCounter((c) => c + 1)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 min-w-0">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          Resume Library & ATS Intelligence
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Upload, manage, and analyze your resumes with universal and role-specific ATS intelligence.
        </p>
      </motion.div>

      {/* Upload section */}
      <div id="resume-upload-section" className="w-full min-w-0">
        <ResumeUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Library and Resume Preview Row */}
      <div className="grid w-full gap-6 lg:grid-cols-3 min-w-0">
        {/* Left 2 columns — Resume Library */}
        <div className="min-w-0 lg:col-span-2">
          <ResumeLibrary
            refreshCounter={refreshCounter}
            onSelectResume={setSelectedResume}
          />
        </div>

        {/* Right 1 column — Selected Resume Metadata & Preview */}
        <div className="min-w-0 lg:col-span-1">
          <ResumePreview resume={selectedResume} />
        </div>
      </div>

      {/* Full-Width Workspace — Resume Intelligence & ATS Analyzer */}
      <div className="w-full min-w-0">
        <JobDescriptionAnalyzer resume={selectedResume} />
      </div>
    </div>
  )
}
