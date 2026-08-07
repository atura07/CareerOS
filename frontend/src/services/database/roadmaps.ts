import { supabase } from './client'
import type { RoadmapRow, DatabaseResult } from '../../types/database'
import { mapMany, mapSingle } from './mapper'

const TABLE = 'roadmaps' as const

/**
 * CRUD-ready repository for the `roadmaps` table.
 * Scoped by the authenticated Supabase user via RLS.
 */

export type RoadmapStatus = 'active' | 'completed' | 'archived'

export interface RoadmapInput {
  title: string
  description?: string | null
  goal?: string | null
  status?: RoadmapStatus
  start_date?: string | null
  target_date?: string | null
  progress?: number
}

type RoadmapUpdate = Partial<
  Omit<RoadmapRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

/** Build an insert payload from `RoadmapInput`, coercing `undefined` → defaults. */
function toInsertPayload(
  input: RoadmapInput,
): Omit<RoadmapRow, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  return {
    title: input.title,
    description: input.description ?? null,
    goal: input.goal ?? null,
    status: input.status ?? 'active',
    start_date: input.start_date ?? null,
    target_date: input.target_date ?? null,
    progress: input.progress ?? 0,
  }
}

export interface ListRoadmapsOptions {
  status?: RoadmapStatus
  limit?: number
  offset?: number
}

/** List roadmaps with optional filters. */
export async function listRoadmaps(
  options: ListRoadmapsOptions = {},
): Promise<DatabaseResult<RoadmapRow[]>> {
  let query = supabase.from(TABLE).select('*')

  if (options.status) query = query.eq('status', options.status)
  if (options.limit != null) query = query.limit(options.limit)
  if (options.offset != null) {
    const size = options.limit ?? 50
    query = query.range(options.offset, options.offset + size - 1)
  }

  query = query.order('created_at', { ascending: false })
  const result = await query
  return mapMany<RoadmapRow>(result)
}

/** Fetch a single roadmap by id. */
export async function getRoadmap(
  id: string,
): Promise<DatabaseResult<RoadmapRow>> {
  const result = await supabase.from(TABLE).select('*').eq('id', id).single()
  return mapSingle<RoadmapRow>(result)
}

/** Create a roadmap. */
export async function createRoadmap(
  input: RoadmapInput,
): Promise<DatabaseResult<RoadmapRow>> {
  const result = await supabase
    .from(TABLE)
    .insert(toInsertPayload(input))
    .select('*')
    .single()
  return mapSingle<RoadmapRow>(result)
}

/** Update a roadmap by id. */
export async function updateRoadmap(
  id: string,
  input: Partial<RoadmapInput>,
): Promise<DatabaseResult<RoadmapRow>> {
  const partial = {} as RoadmapUpdate
  for (const [key, value] of Object.entries(input)) {
    ;(partial as Record<string, unknown>)[key] = value ?? null
  }
  const result = await supabase
    .from(TABLE)
    .update(partial)
    .eq('id', id)
    .select('*')
    .single()
  return mapSingle<RoadmapRow>(result)
}

/** Delete a roadmap by id. */
export async function deleteRoadmap(
  id: string,
): Promise<DatabaseResult<null>> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    return {
      data: null,
      error: { kind: 'unknown', message: error.message, code: error.code },
    }
  }
  return { data: null, error: null }
}
