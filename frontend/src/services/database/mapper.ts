/**
 * Unwrap Supabase query results into typed values.
 *
 * These helpers normalize the `{ data, error }` shape returned by the
 * Supabase client into the project's `DatabaseResult<T>` envelope.
 */
import type { DatabaseResult, DatabaseError } from '../../types/database'
import { mapDatabaseError, toDatabaseError } from './errors'

/** Wrap a single fetched row (nullable). */
export function asResult<T>(
  data: T | null,
  error: unknown,
): DatabaseResult<T> {
  if (error) {
    return { data: null, error: toDatabaseError(error) }
  }
  return { data, error: null }
}

/** Map a single value from a Supabase query response. */
export function mapSingle<T>(
  queryResult: { data: T | null; error: unknown },
): DatabaseResult<T> {
  const { data, error } = queryResult
  if (error) {
    return { data: null, error: toDatabaseError(error) }
  }
  return { data, error: null }
}

/** Map an array value from a Supabase query response. */
export function mapMany<T>(
  queryResult: { data: T[] | null; error: unknown },
): DatabaseResult<T[]> {
  const { data, error } = queryResult
  if (error) {
    return { data: null, error: toDatabaseError(error) }
  }
  return { data: data ?? [], error: null }
}

/** Map a throwing void operation's error. */
export function mapVoid(
  error: unknown,
): { data: null; error: DatabaseError } {
  return { data: null, error: toDatabaseError(error) }
}

// Re-export for convenience
export { mapDatabaseError }
