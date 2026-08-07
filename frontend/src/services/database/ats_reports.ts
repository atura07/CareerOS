import { supabase } from './client'
import type { AtsReportRow, DatabaseResult } from '../../types/database'
import { mapMany, mapSingle } from './mapper'

const TABLE = 'ats_reports' as const

/**
 * CRUD-ready repository for the `ats_reports` table.
 * Scoped by the authenticated Supabase user via RLS.
 */

export interface AtsReportInput {
  resume_name?: string | null
  overall_score: number
  keyword_matches?: string[]
  missing_keywords?: string[]
  suggestions?: string[]
}

type AtsReportUpdate = Partial<
  Omit<AtsReportRow, 'id' | 'user_id' | 'created_at'>
>

/** Build an insert payload from `AtsReportInput`, coercing `undefined` → `null`/defaults. */
function toInsertPayload(
  input: AtsReportInput,
): Omit<AtsReportRow, 'id' | 'user_id' | 'created_at'> {
  return {
    resume_name: input.resume_name ?? null,
    overall_score: input.overall_score,
    keyword_matches: input.keyword_matches ?? [],
    missing_keywords: input.missing_keywords ?? [],
    suggestions: input.suggestions ?? [],
  }
}

export interface ListAtsReportsOptions {
  limit?: number
  offset?: number
}

/** List ATS reports (most recent first). */
export async function listAtsReports(
  options: ListAtsReportsOptions = {},
): Promise<DatabaseResult<AtsReportRow[]>> {
  let query = supabase.from(TABLE).select('*')

  if (options.limit != null) query = query.limit(options.limit)
  if (options.offset != null) {
    const size = options.limit ?? 50
    query = query.range(options.offset, options.offset + size - 1)
  }

  query = query.order('created_at', { ascending: false })
  const result = await query
  return mapMany<AtsReportRow>(result)
}

/** Fetch a single ATS report by id. */
export async function getAtsReport(
  id: string,
): Promise<DatabaseResult<AtsReportRow>> {
  const result = await supabase.from(TABLE).select('*').eq('id', id).single()
  return mapSingle<AtsReportRow>(result)
}

/** Create an ATS report. */
export async function createAtsReport(
  input: AtsReportInput,
): Promise<DatabaseResult<AtsReportRow>> {
  const result = await supabase
    .from(TABLE)
    .insert(toInsertPayload(input))
    .select('*')
    .single()
  return mapSingle<AtsReportRow>(result)
}

/** Update an ATS report by id. */
export async function updateAtsReport(
  id: string,
  input: Partial<AtsReportInput>,
): Promise<DatabaseResult<AtsReportRow>> {
  const partial = {} as AtsReportUpdate
  for (const [key, value] of Object.entries(input)) {
    ;(partial as Record<string, unknown>)[key] =
      Array.isArray(value) ? value : (value ?? null)
  }
  const result = await supabase
    .from(TABLE)
    .update(partial)
    .eq('id', id)
    .select('*')
    .single()
  return mapSingle<AtsReportRow>(result)
}

/** Delete an ATS report by id. */
export async function deleteAtsReport(
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
