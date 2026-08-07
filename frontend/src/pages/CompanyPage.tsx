import { useState } from 'react'
import { motion } from 'framer-motion'
import { CompanySearch, CompanyFilter, CompanyGrid } from '../components/company'
import { COMPANIES } from '../data/companies'
import type { CompanyStatus } from '../data/companies'

export function CompanyPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<CompanyStatus | 'All'>('All')

  const filtered = COMPANIES.filter((company) => {
    const matchesQuery =
      query.trim() === '' ||
      company.name.toLowerCase().includes(query.trim().toLowerCase())
    const matchesStatus = status === 'All' || company.status === status
    return matchesQuery && matchesStatus
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
        <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
          Companies
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Explore placement opportunities and track hiring status.
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CompanySearch query={query} onQueryChange={setQuery} />
          <p className="text-xs text-white/40">
            Showing {filtered.length} of {COMPANIES.length} companies
          </p>
        </div>
        <CompanyFilter active={status} onChange={setStatus} />
      </div>

      {/* Grid */}
      <CompanyGrid companies={filtered} />
    </div>
  )
}
