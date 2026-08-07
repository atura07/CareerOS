import type { DatabaseError, DatabaseErrorKind } from '../../types/database'
import type { PostgrestError } from '@supabase/supabase-js'

/**
 * Map a raw Supabase PostgrestError (or unknown) into the typed
 * DatabaseError used across the database service layer.
 */
export function mapDatabaseError(
  error: PostgrestError | null,
): DatabaseError | null {
  if (!error) return null

  let kind: DatabaseErrorKind = 'unknown'
  switch (error.code) {
    case '42P01': // undefined_table
    case '42501': // insufficient_privilege
      kind = 'permission-denied'
      break
    case '23505': // unique_violation
      kind = 'duplicate'
      break
    case 'PGRST116': // results contain 0 rows
      kind = 'not-found'
      break
    case 'PGRST301': // not authenticated
      kind = 'not-authenticated'
      break
    default:
      if (/network|fetch|ECONNREFUSED|Failed to fetch/i.test(error.message)) {
        kind = 'network'
      } else {
        kind = 'unknown'
      }
      break
  }

  return {
    kind,
    message: error.message,
    code: error.code,
  }
}

/** Create a DatabaseError for unresolvable / thrown errors. */
export function toDatabaseError(error: unknown): DatabaseError {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message)
    if (/network|fetch|ECONNREFUSED|Failed to fetch/i.test(message)) {
      return { kind: 'network', message }
    }
    return { kind: 'unknown', message }
  }
  return { kind: 'unknown', message: String(error) }
}
