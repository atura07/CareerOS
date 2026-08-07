import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

/**
 * Supabase client (OPTIONAL).
 *
 * Configure via environment variables:
 *   VITE_SUPABASE_URL      — e.g. https://xyzcompany.supabase.co
 *   VITE_SUPABASE_ANON_KEY — the public anon key
 *
 * The anon key is safe to expose in the browser; Row Level Security (RLS)
 * policies on the Supabase project enforce per-user data access.
 *
 * NOTE: Supabase is entirely optional in this project. The active authentication
 * layer is the Spring Boot JWT backend. This module must never throw or crash
 * the application at startup. When the environment variables are absent the
 * client is constructed with placeholder values so the module loads safely;
 * any repository call simply returns an error (feature effectively disabled)
 * instead of breaking the app.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient<Database> = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl as string, supabaseAnonKey as string)
  : // Placeholder — used only when Supabase is not configured. It is never the
    // active data/auth layer, so any call yields an error rather than a crash.
    createClient<Database>(
      'http://localhost:54321',
      'public-anon-key-placeholder-do-not-use',
    )
