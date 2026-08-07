import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Map } from 'lucide-react'
import {
  RoadmapForm,
  GoalCard,
  ProgressTracker,
  SkillChecklist,
  ResourceCard,
  Timeline,
  EmptyState,
} from '../components/roadmap'
import type {
  TargetCompany,
  TargetRole,
  Duration,
  SkillName,
  Roadmap,
  WeekPlan,
} from '../data/roadmap'
import { buildMockRoadmap } from '../data/roadmap'
import { listRoadmaps, createRoadmap } from '../services/api'
import type { RoadmapDto } from '../services/api/types'
import { parseJsonArray } from '../services/json'

const USER_ID = 1

/** Round-trip conversion helpers for roadmap DTO ↔ view type. */
function toView(dto: RoadmapDto): Roadmap {
  const currentSkills = parseJsonArray(dto.currentSkills) as SkillName[]
  const focusAreas = parseJsonArray(dto.focusAreas)
  let weeklyPlans: WeekPlan[] = []
  try {
    const parsed = JSON.parse(dto.weeklyPlans || '[]')
    if (Array.isArray(parsed)) weeklyPlans = parsed as WeekPlan[]
  } catch {
    weeklyPlans = []
  }
  return {
    id: String(dto.id),
    company: dto.company as TargetCompany,
    role: dto.role as TargetRole,
    duration: dto.duration as Duration,
    currentSkills,
    totalWeeks: dto.totalWeeks,
    weeklyPlans,
    focusAreas,
  }
}

function toDto(r: Roadmap): Partial<RoadmapDto> {
  return {
    company: r.company,
    role: r.role,
    duration: r.duration,
    totalWeeks: r.totalWeeks,
    focusAreas: JSON.stringify(r.focusAreas),
    currentSkills: JSON.stringify(r.currentSkills),
    weeklyPlans: JSON.stringify(r.weeklyPlans),
  }
}

export function RoadmapPage() {
  const [company, setCompany] = useState<TargetCompany>('Google')
  const [role, setRole] = useState<TargetRole>('SDE')
  const [duration, setDuration] = useState<Duration>('60 Days')
  const [selectedSkills, setSelectedSkills] = useState<SkillName[]>(['Java', 'DSA'])
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [checkedSkills, setCheckedSkills] = useState<SkillName[]>([])

  // Load the most recent saved roadmap from the backend on mount (mock fallback).
  useEffect(() => {
    let active = true
    listRoadmaps(USER_ID)
      .then((dtos) => {
        if (!active) return
        if (Array.isArray(dtos) && dtos.length > 0) {
          setRoadmap(toView(dtos[0]))
        }
      })
      .catch(() => {
        // Backend unavailable — fall back to mock-generated roadmaps.
      })
    return () => {
      active = false
    }
  }, [])

  const toggleSkill = (skill: SkillName) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  const toggleChecked = (skill: SkillName) => {
    setCheckedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  const handleGenerate = () => {
    // Validate required fields before generating.
    if (!company || !role || !duration || selectedSkills.length === 0) return
    const generated = buildMockRoadmap(company, role, duration, selectedSkills)
    setRoadmap(generated)
    setCheckedSkills([])
    // Persist the generated roadmap to the backend; ignore failures (mock fallback).
    createRoadmap(toDto(generated), USER_ID).catch(() => {})
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
          <Map className="h-7 w-7 text-blue-400" />
          Roadmap Generator
        </div>
        <p className="mt-1 text-sm text-white/50">
          Generate a personalized placement preparation roadmap for your target company.
        </p>
      </motion.div>

      {/* Form */}
      <div className="mb-6">
        <RoadmapForm
          company={company}
          role={role}
          duration={duration}
          selectedSkills={selectedSkills}
          onCompanyChange={setCompany}
          onRoleChange={setRole}
          onDurationChange={setDuration}
          onToggleSkill={toggleSkill}
          onGenerate={handleGenerate}
        />
      </div>

      {/* Generated roadmap */}
      {roadmap ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="space-y-6"
        >
          {/* Summary header */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white/90">
                  {roadmap.company} · {roadmap.role}
                </h3>
                <p className="text-sm text-white/50">
                  {roadmap.duration} · {roadmap.totalWeeks} weeks ·{' '}
                  {roadmap.currentSkills.length} skills
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.focusAreas.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress + goals */}
          <div className="grid gap-6 lg:grid-cols-3">
            <ProgressTracker
              percent={Math.round((checkedSkills.length / roadmap.currentSkills.length) * 100)}
            />
            <GoalCard
              label="LeetCode Goal"
              value={roadmap.weeklyPlans[0]?.leetCodeGoal ?? 'Solve 100 problems'}
            />
            <GoalCard
              label="GitHub Goal"
              value={roadmap.weeklyPlans[0]?.githubGoal ?? 'Build a strong portfolio'}
            />
          </div>

          {/* Skill checklist + resources */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SkillChecklist
              skills={roadmap.currentSkills}
              checked={checkedSkills}
              onToggle={toggleChecked}
            />
            <ResourceCard resources={roadmap.weeklyPlans[0]?.resources ?? []} />
          </div>

          {/* Weekly timeline */}
          <Timeline plans={roadmap.weeklyPlans} />
        </motion.div>
      ) : (
        <EmptyState onGenerate={handleGenerate} />
      )}
    </div>
  )
}
