import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Loader2, Sparkles } from 'lucide-react'
import { CompanySearch, CompanyFilter, CompanyGrid } from '../components/company'
import { getCompanies, type CompanySummary } from '../services/api'

export function CompanyPage() {
  const [companies, setCompanies] = useState<CompanySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('All')

  useEffect(() => {
    let isMounted = true
    const fetchCompanies = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getCompanies()
        if (isMounted) {
          setCompanies(data)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load companies')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCompanies()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = companies.filter((company) => {
    const matchesQuery =
      query.trim() === '' ||
      company.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(query.trim().toLowerCase())) ||
      (company.location && company.location.toLowerCase().includes(query.trim().toLowerCase()))

    const matchesDifficulty =
      difficulty === 'All' ||
      (company.difficulty && company.difficulty.toLowerCase() === difficulty.toLowerCase())

    return matchesQuery && matchesDifficulty
  })

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
                Companies Preparation
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                <Sparkles className="h-3 w-3" /> Production Tracks
              </span>
            </div>
            <p className="mt-1 text-sm text-white/50">
              Targeted preparation tracks, hiring workflows, role requirements, and technical topics.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CompanySearch query={query} onQueryChange={setQuery} />
          <p className="text-xs text-white/40">
            Showing {filtered.length} of {companies.length} companies
          </p>
        </div>
        <CompanyFilter active={difficulty} onChange={setDifficulty} />
      </div>

      {/* Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="mt-3 text-sm font-medium text-white/70">Loading companies preparation data...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/05 p-8 text-center">
          <Building2 className="h-8 w-8 text-rose-400" />
          <p className="mt-2 text-sm font-semibold text-rose-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
          >
            Retry
          </button>
        </div>
      ) : (
        <CompanyGrid companies={filtered} />
      )}
    </div>
  )
}
