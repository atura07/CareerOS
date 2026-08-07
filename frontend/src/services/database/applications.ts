import { supabase } from './client'
import type {
  ApplicationRow,
  DatabaseResult,
  ApplicationStatus,
  Priority,
} from '../../types/database'
import { mapMany, mapSingle } from './mapper'

const TABLE = 'applications' as const

/**
 * CRUD-ready repository for the `applications` table.
 * Scoped by the authenticated Supabase user via RLS.
 */

export interface ApplicationInput {
  company_name: string
  company_logo?: string | null
  role: string
  package?: string | null
  location?: string | null
  applied_date?: string | null
  last_updated?: string | null
  status: ApplicationStatus
  next_round?: string | null
  notes?: string | null
  recruiter?: string | null
  recruiter_email?: string | null
  application_link?: string | null
  deadline?: string | null
  priority: Priority
}

export interface ListApplicationsOptions {
  status?: ApplicationStatus
  priority?: Priority
  search?: string
  limit?: number
  offset?: number
}

/** List applications with optional filters. */
export async function listApplications(
  options: ListApplicationsOptions = {},
): Promise<DatabaseResult<ApplicationRow[]>> {
  let query = supabase.from(TABLE).select('*')

  if (options.status) query = query.eq('status', options.status)
  if (options.priority) query = query.eq('priority', options.priority)
  if (options.search) query = query.ilike('company_name', `%${options.search}%`)
  if (options.limit != null) query = query.limit(options.limit)
  if (options.offset != null) {
    const size = options.limit ?? 50
    query = query.range(options.offset, options.offset + size - 1)
  }

  query = query.order('created_at', { ascending: false })
  const result = await query
  return mapMany<ApplicationRow>(result)
}

/** Fetch a single application by id. */
export async function getApplication(
  id: string,
): Promise<DatabaseResult<ApplicationRow>> {
  const result = await supabase.from(TABLE).select('*').eq('id', id).single()
  return mapSingle<ApplicationRow>(result)
}

/**
 * Build an insert payload from `ApplicationInput`, coercing `undefined` to
 * `null` for the nullable columns so it matches the Supabase `Insert` type.
 */
function toInsertPayload(
  input: ApplicationInput,
): Omit<ApplicationRow, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  return {
    company_name: input.company_name,
    company_logo: input.company_logo ?? null,
    role: input.role,
    package: input.package ?? null,
    location: input.location ?? null,
    applied_date: input.applied_date ?? null,
    last_updated: input.last_updated ?? null,
    status: input.status,
    next_round: input.next_round ?? null,
    notes: input.notes ?? null,
    recruiter: input.recruiter ?? null,
    recruiter_email: input.recruiter_email ?? null,
    application_link: input.application_link ?? null,
    deadline: input.deadline ?? null,
    priority: input.priority,
  }
}

/** Create an application. */
export async function createApplication(
  input: ApplicationInput,
): Promise<DatabaseResult<ApplicationRow>> {
  const result = await supabase
    .from(TABLE)
    .insert(toInsertPayload(input))
    .select('*')
    .single()
  return mapSingle<ApplicationRow>(result)
}

type ApplicationUpdate = Partial<
  Omit<ApplicationRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

/** Update an application by id. */
export async function updateApplication(
  id: string,
  input: Partial<ApplicationInput>,
): Promise<DatabaseResult<ApplicationRow>> {
  // Coerce `undefined` → `null` for partial updates so the payload matches the
  // Supabase `Update` type (which disallows `undefined`).
  const partial = {} as ApplicationUpdate
  for (const [key, value] of Object.entries(input)) {
    ;(partial as Record<string, unknown>)[key] = value ?? null
  }
  const result = await supabase
    .from(TABLE)
    .update(partial)
    .eq('id', id)
    .select('*')
    .single()
  return mapSingle<ApplicationRow>(result)
}

/** Delete an application by id. */
export async function deleteApplication(
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
