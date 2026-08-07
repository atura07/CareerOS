import { supabase } from './client'
import type {
  DsaProgressRow,
  DatabaseResult,
  DsaProblemStatus,
} from '../../types/database'
import { mapMany, mapSingle } from './mapper'

const TABLE = 'dsa_progress' as const

/**
 * CRUD-ready repository for the `dsa_progress` table.
 * Scoped by the authenticated Supabase user via RLS.
 */

export interface DsaProgressInput {
  topic: string
  problem_id: string
  title: string
  difficulty?: 'Easy' | 'Medium' | 'Hard' | null
  status: DsaProblemStatus
  solved_date?: string | null
  notes?: string | null
}

type DsaProgressUpdate = Partial<
  Omit<DsaProgressRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

/** Build an insert payload from `DsaProgressInput`, coercing `undefined` → `null`. */
function toInsertPayload(
  input: DsaProgressInput,
): Omit<DsaProgressRow, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  return {
    topic: input.topic,
    problem_id: input.problem_id,
    title: input.title,
    difficulty: input.difficulty ?? null,
    status: input.status,
    solved_date: input.solved_date ?? null,
    notes: input.notes ?? null,
  }
}

export interface ListDsaProgressOptions {
  status?: DsaProblemStatus
  topic?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  limit?: number
  offset?: number
}

/** List DSA progress rows with optional filters. */
export async function listDsaProgress(
  options: ListDsaProgressOptions = {},
): Promise<DatabaseResult<DsaProgressRow[]>> {
  let query = supabase.from(TABLE).select('*')

  if (options.status) query = query.eq('status', options.status)
  if (options.topic) query = query.eq('topic', options.topic)
  if (options.difficulty) query = query.eq('difficulty', options.difficulty)
  if (options.limit != null) query = query.limit(options.limit)
  if (options.offset != null) {
    const size = options.limit ?? 50
    query = query.range(options.offset, options.offset + size - 1)
  }

  query = query.order('created_at', { ascending: false })
  const result = await query
  return mapMany<DsaProgressRow>(result)
}

/** Fetch a single DSA progress row by id. */
export async function getDsaProgress(
  id: string,
): Promise<DatabaseResult<DsaProgressRow>> {
  const result = await supabase.from(TABLE).select('*').eq('id', id).single()
  return mapSingle<DsaProgressRow>(result)
}

/** Create a DSA progress row. */
export async function createDsaProgress(
  input: DsaProgressInput,
): Promise<DatabaseResult<DsaProgressRow>> {
  const result = await supabase
    .from(TABLE)
    .insert(toInsertPayload(input))
    .select('*')
    .single()
  return mapSingle<DsaProgressRow>(result)
}

/** Update a DSA progress row by id. */
export async function updateDsaProgress(
  id: string,
  input: Partial<DsaProgressInput>,
): Promise<DatabaseResult<DsaProgressRow>> {
  const partial = {} as DsaProgressUpdate
  for (const [key, value] of Object.entries(input)) {
    ;(partial as Record<string, unknown>)[key] = value ?? null
  }
  const result = await supabase
    .from(TABLE)
    .update(partial)
    .eq('id', id)
    .select('*')
    .single()
  return mapSingle<DsaProgressRow>(result)
}

/** Delete a DSA progress row by id. */
export async function deleteDsaProgress(
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
