import { useCallback, useRef, useState } from 'react'
import type { AtsViewData } from '../services/ats/atsMapper'
import { mapAtsResponse } from '../services/ats/atsMapper'
import { uploadResume } from '../services/api/resumeService'
import { analyzeResumeById } from '../services/api/atsService'
import {
  ATS_SCORES,
  SECTION_SCORES,
  KEYWORDS,
  SUGGESTED_KEYWORDS,
  IMPROVEMENTS,
  RESUME_VERSIONS,
  BEFORE_AFTER,
  RECRUITER_PREVIEW,
  ATS_PROFILES,
  PARSED_RESUME,
} from '../data/ats'

export interface UseAtsReturn {
  data: AtsViewData | null
  isAnalyzing: boolean
  isFromMock: boolean
  fileName: string | null
  analyze: (file: File) => Promise<void>
  loadMock: () => void
  reset: () => void
}

/**
 * Builds the mock fallback ATS view data from the existing mock data file.
 * Used only when the backend is unavailable or the request fails.
 */
function mockAtsViewData(): AtsViewData {
  return {
    scores: ATS_SCORES,
    sections: SECTION_SCORES,
    keywords: KEYWORDS,
    suggestedKeywords: SUGGESTED_KEYWORDS,
    improvements: IMPROVEMENTS,
    versions: RESUME_VERSIONS,
    beforeAfter: BEFORE_AFTER,
    recruiterPreview: RECRUITER_PREVIEW,
    profiles: ATS_PROFILES,
    parsedResume: PARSED_RESUME,
    summary: '',
  }
}

/**
 * React hook for ATS resume analysis backed by the real Spring Boot API.
 * Falls back to mock data if the backend request fails or is unavailable.
 */
export function useAts(): UseAtsReturn {
  const [data, setData] = useState<AtsViewData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isFromMock, setIsFromMock] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const analyzingRef = useRef(false)

  const analyze = useCallback(async (file: File) => {
    if (analyzingRef.current) return
    analyzingRef.current = true
    setIsAnalyzing(true)
    setFileName(file.name)

    try {
      // 1. Upload the resume to the backend.
      const uploaded = await uploadResume(file)

      // 2. Run ATS analysis on the uploaded resume.
      const response = await analyzeResumeById(uploaded.id)

      // 3. Map the backend response into the UI data shape.
      setData(mapAtsResponse(response))
      setIsFromMock(false)
    } catch {
      // Backend unavailable or request failed — fall back to mock data.
      setData(mockAtsViewData())
      setIsFromMock(true)
    } finally {
      setIsAnalyzing(false)
      analyzingRef.current = false
    }
  }, [])

  const loadMock = useCallback(() => {
    setData(mockAtsViewData())
    setIsFromMock(true)
    setIsAnalyzing(false)
    analyzingRef.current = false
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setIsAnalyzing(false)
    setIsFromMock(false)
    setFileName(null)
    analyzingRef.current = false
  }, [])

  return {
    data,
    isAnalyzing,
    isFromMock,
    fileName,
    analyze,
    loadMock,
    reset,
  }
}
