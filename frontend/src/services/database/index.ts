/**
 * Database service layer — CRUD-ready repositories backed by Supabase.
 *
 * Every table is scoped by `user_id` and protected by Row Level Security (RLS).
 * Import the individual repositories or the namespace below.
 */

export { supabase } from './client'
export { mapDatabaseError, toDatabaseError } from './errors'
export { mapSingle, mapMany, mapVoid, asResult } from './mapper'

export * from './profiles'
export * from './applications'
export * from './dsa_progress'
export * from './ats_reports'
export * from './roadmaps'
