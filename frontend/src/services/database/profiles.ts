import { supabase } from './client'
import type {
  ProfileRow,
  DatabaseResult,
} from '../../types/database'
import { mapMany, mapSingle } from './mapper'

const TABLE = 'profiles' as const

/**
 * CRUD-ready repository for the `profiles` table.
 * Scoped by the authenticated Supabase user via RLS.
 */

export interface ProfileInput {
  full_name: string
  email: string
  github_username?: string | null
  leetcode_username?: string | null
}

/**
 * Payload for profile updates. Optional fields drop `undefined` so they remain
 * assignable to the Supabase `Update` type (which does not allow `undefined`).
 */
export type ProfileUpdate = Partial<
  Pick<ProfileInput, 'full_name' | 'email' | 'github_username' | 'leetcode_username'>
>

/** Fetch the current user's profile (single row). */
export async function getProfile(): Promise<DatabaseResult<ProfileRow>> {
  const result = await supabase.from(TABLE).select('*').single()
  return mapSingle<ProfileRow>(result)
}

/** Fetch a profile by its id. */
export async function getProfileById(
  id: string,
): Promise<DatabaseResult<ProfileRow>> {
  const result = await supabase.from(TABLE).select('*').eq('id', id).single()
  return mapSingle<ProfileRow>(result)
}

/** List all profiles visible to the current user. */
export async function listProfiles(): Promise<DatabaseResult<ProfileRow[]>> {
  const result = await supabase.from(TABLE).select('*')
  return mapMany<ProfileRow>(result)
}

/** Create a profile row. */
export async function createProfile(
  input: ProfileInput,
): Promise<DatabaseResult<ProfileRow>> {
  const result = await supabase
    .from(TABLE)
    .insert({
      full_name: input.full_name,
      email: input.email,
      github_username: input.github_username ?? null,
      leetcode_username: input.leetcode_username ?? null,
    })
    .select('*')
    .single()
  return mapSingle<ProfileRow>(result)
}

/**
 * Update a profile by id.
 * `partial` omits `user_id` (managed by RLS trigger) and allows optional fields.
 */
export async function updateProfile(
  id: string,
  partial: Pick<
    ProfileInput,
    'full_name' | 'email' | 'github_username' | 'leetcode_username'
  >,
): Promise<DatabaseResult<ProfileRow>> {
  const result = await supabase
    .from(TABLE)
    .update(partial)
    .eq('id', id)
    .select('*')
    .single()
  return mapSingle<ProfileRow>(result)
}

/** Upsert the current user's profile (replaces or inserts). */
export async function upsertProfile(
  input: ProfileInput,
): Promise<DatabaseResult<ProfileRow>> {
  // Strip `undefined` from optional fields so the payload matches the
  // Supabase `Insert` type (which disallows `undefined`).
  const payload: Omit<ProfileRow, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
    full_name: input.full_name,
    email: input.email,
    github_username: input.github_username ?? null,
    leetcode_username: input.leetcode_username ?? null,
  }
  const result = await supabase.from(TABLE).upsert(payload).select('*').single()
  return mapSingle<ProfileRow>(result)
}

/** Delete a profile by id. */
export async function deleteProfile(
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
