import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileSearch } from 'lucide-react'
import {
  ATSScoreCards,
  ResumeUpload,
  ResumePreview,
  SectionWiseScore,
  KeywordMatch,
  MissingKeywords,
  ImprovementSuggestions,
  ResumeVersionHistory,
  BeforeAfterComparison,
  RecruiterPreview,
  IndustryProfiles,
  EmptyState,
} from '../components/ats'
import { useAts } from '../hooks'

export function ATSPage() {
  const [hasResume, setHasResume] = useState(false)
  const { data, isAnalyzing, analyze, loadMock } = useAts()

  const handleUploaded = (file: File) => {
    setHasResume(true)
    void analyze(file)
  }

  const handleEmptyUpload = () => {
    setHasResume(true)
    loadMock()
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          <FileSearch className="h-7 w-7 text-blue-400" />
          ATS Resume Analyzer
        </div>
        <p className="mt-1 text-sm text-white/50">
          Score your resume against ATS parsers and get actionable improvements.
        </p>
      </motion.div>

      {!hasResume || !data ? (
        <EmptyState onUpload={handleEmptyUpload} />
      ) : (
        <>
          {/* Score cards */}
          <div className="mb-6">
            <ATSScoreCards scores={data.scores} />
          </div>

          {/* Upload + Preview */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <ResumeUpload onUploaded={handleUploaded} isUploading={isAnalyzing} />
            <ResumePreview resume={data.parsedResume} />
          </div>

          {/* Section-wise + Keyword analysis */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <SectionWiseScore sections={data.sections} />
            <KeywordMatch keywords={data.keywords} />
          </div>

          {/* Missing keywords */}
          <div className="mb-6">
            <MissingKeywords keywords={data.suggestedKeywords} />
          </div>

          {/* Improvements + Recruiter preview */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <ImprovementSuggestions improvements={data.improvements} />
            <RecruiterPreview preview={data.recruiterPreview} />
          </div>

          {/* Version history + Before/After */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <ResumeVersionHistory versions={data.versions} />
            <BeforeAfterComparison metrics={data.beforeAfter} />
          </div>

          {/* Industry profiles */}
          <div>
            <IndustryProfiles profiles={data.profiles} />
          </div>
        </>
      )}
    </div>
  )
}
