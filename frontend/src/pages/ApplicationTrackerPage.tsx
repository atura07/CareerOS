import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Plus, Grid3x3, List, X } from 'lucide-react'
import {
  ApplicationCard,
  ApplicationTable,
  StatusTimeline,
  StatusBadge,
  SearchBar,
  FilterBar,
  StatisticsCards,
  AddApplicationModal,
  EmptyState,
} from '../components/applications'
import type { FilterValue } from '../components/applications'
import { APPLICATIONS } from '../data/applications'
import type { Application } from '../data/applications'
import { listApplications, createApplication } from '../services/api'
import type { ApplicationDto } from '../services/api/types'

type ViewMode = 'table' | 'grid'

const ACTIVE_STATUSES = [
  'Applied',
  'OA Scheduled',
  'OA Cleared',
  'Technical Interview',
  'HR Interview',
] as const

const INTERVIEW_STATUSES = ['Technical Interview', 'HR Interview'] as const

const USER_ID = 1

/** Convert a backend ApplicationDto into the view Application shape. */
function toView(dto: ApplicationDto): Application {
  return {
    id: String(dto.id),
    companyName: dto.companyName,
    companyLogo: dto.companyLogo || dto.companyName.charAt(0).toUpperCase(),
    role: dto.role,
    package: dto.packageValue || '—',
    location: dto.location || '—',
    appliedDate: dto.appliedDate || '',
    lastUpdated: dto.lastUpdated || '',
    status: (dto.status as Application['status']) || 'Applied',
    nextRound: dto.nextRound || '—',
    notes: dto.notes || '',
    recruiter: dto.recruiter || '',
    recruiterEmail: dto.recruiterEmail || '',
    applicationLink: dto.applicationLink || '',
    deadline: dto.deadline || '',
    priority: (dto.priority as Application['priority']) || 'Medium',
  }
}

/** Convert a view Application into the backend DTO payload. */
function toDto(app: Application): Partial<ApplicationDto> {
  return {
    companyName: app.companyName,
    companyLogo: app.companyLogo,
    role: app.role,
    packageValue: app.package,
    location: app.location,
    appliedDate: app.appliedDate,
    lastUpdated: app.lastUpdated,
    status: app.status,
    nextRound: app.nextRound,
    notes: app.notes,
    recruiter: app.recruiter,
    recruiterEmail: app.recruiterEmail,
    applicationLink: app.applicationLink,
    deadline: app.deadline,
    priority: app.priority,
  }
}

export function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('All')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Application | null>(null)

  // Fetch applications from the backend on mount; fall back to mock data if unavailable.
  useEffect(() => {
    let active = true
    listApplications(USER_ID)
      .then((dtos) => {
        if (!active) return
        if (Array.isArray(dtos) && dtos.length > 0) {
          setApplications(dtos.map(toView))
        }
      })
      .catch(() => {
        // Backend unavailable — keep the mock data (fallback).
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = applications.filter((app) => {
    const matchesQuery =
      query.trim() === '' ||
      app.companyName.toLowerCase().includes(query.trim().toLowerCase()) ||
      app.role.toLowerCase().includes(query.trim().toLowerCase()) ||
      app.location.toLowerCase().includes(query.trim().toLowerCase())
    const matchesFilter = filter === 'All' || app.status === filter
    return matchesQuery && matchesFilter
  })

  const stats = {
    total: applications.length,
    active: applications.filter((app) =>
      (ACTIVE_STATUSES as readonly string[]).includes(app.status),
    ).length,
    offers: applications.filter((app) => app.status === 'Offer').length,
    rejected: applications.filter((app) => app.status === 'Rejected').length,
    upcomingInterviews: applications.filter((app) =>
      (INTERVIEW_STATUSES as readonly string[]).includes(app.status),
    ).length,
  }

  const handleAdd = (application: Application) => {
    // Optimistically add to the UI.
    setApplications((prev) => [application, ...prev])
    // Persist via the backend; fall back to local state only if the request fails.
    createApplication(toDto(application), USER_ID)
      .then((created) => {
        setApplications((prev) => [
          toView(created),
          ...prev.filter((a) => a.id !== String(created.id) && a.id !== application.id),
        ])
      })
      .catch(() => {
        // Backend unavailable — keep the optimistic entry (mock fallback).
      })
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
            <Briefcase className="h-7 w-7 text-blue-400" />
            Application Tracker
          </div>
          <p className="mt-1 text-sm text-white/50">
            Track your job applications, interviews, and offers in one place.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </motion.div>

      {/* Statistics */}
      <div className="mb-6">
        <StatisticsCards stats={stats} />
      </div>

      {/* Search + view toggle */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar query={query} onQueryChange={setQuery} />
        <div className="flex items-center gap-2">
          <p className="text-xs text-white/40">
            Showing {filtered.length} of {applications.length} applications
          </p>
          <div className="flex overflow-hidden rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60 ${
                viewMode === 'table'
                  ? 'bg-blue-500/14 text-blue-400'
                  : 'bg-white/[0.03] text-white/40 hover:text-white/60'
              }`}
              aria-label="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60 ${
                viewMode === 'grid'
                  ? 'bg-blue-500/14 text-blue-400'
                  : 'bg-white/[0.03] text-white/40 hover:text-white/60'
              }`}
              aria-label="Card view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* Content + timeline */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Applications list */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : viewMode === 'table' ? (
            <ApplicationTable applications={filtered} onViewDetails={setSelected} />
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {filtered.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={setSelected}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Status timeline */}
        <div className="lg:col-span-2">
          <StatusTimeline
            status={selected ? selected.status : stats.active > 0 ? 'Applied' : 'Wishlist'}
          />
        </div>
      </div>

      {/* Add modal */}
      <AddApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />

      {/* Details modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#0a0d14] p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 text-lg font-bold text-blue-400 ring-1 ring-blue-500/20">
                      {selected.companyLogo}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white/90">
                        {selected.companyName}
                      </h3>
                      <p className="text-sm text-white/50">{selected.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <StatusBadge status={selected.status} />
                  <span className="text-sm font-medium text-emerald-400">
                    {selected.package}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wide text-white/40">Location</dt>
                    <dd className="mt-0.5 text-white/80">{selected.location}</dd>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wide text-white/40">Applied Date</dt>
                    <dd className="mt-0.5 text-white/80">{selected.appliedDate}</dd>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wide text-white/40">Deadline</dt>
                    <dd className="mt-0.5 text-white/80">{selected.deadline}</dd>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wide text-white/40">Next Round</dt>
                    <dd className="mt-0.5 text-white/80">{selected.nextRound}</dd>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wide text-white/40">Priority</dt>
                    <dd className="mt-0.5 text-white/80">{selected.priority}</dd>
                  </div>
                  {selected.recruiter && (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                      <dt className="text-[10px] uppercase tracking-wide text-white/40">Recruiter</dt>
                      <dd className="mt-0.5 truncate text-white/80">{selected.recruiter}</dd>
                    </div>
                  )}
                </dl>

                {selected.notes && (
                  <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <dt className="mb-1 text-[10px] uppercase tracking-wide text-white/40">Notes</dt>
                    <dd className="text-sm text-white/70">{selected.notes}</dd>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  {selected.applicationLink && (
                    <a
                      href={selected.applicationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                    >
                      Open Application
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
