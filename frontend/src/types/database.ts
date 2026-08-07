/**
 * Supabase database schema types for CareerOS.
 *
 * These mirror the migration in `supabase/migrations/0001_init.sql`.
 * Every table is scoped by `user_id` and protected by Row Level Security (RLS).
 */

/* ------------------------------- Enums / unions ------------------------------- */

export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'OA Scheduled'
  | 'OA Cleared'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Offer'
  | 'Rejected'

export type Priority = 'High' | 'Medium' | 'Low'

export type DsaProblemStatus = 'todo' | 'solved' | 'revising'

/* --------------------------------- Row types --------------------------------- */

// NOTE: Row types are declared as `type` aliases (not `interface`) so they are
// assignable to `Record<string, unknown>`. Interfaces lack implicit index
// signatures, which would make these tables fail the supabase-js `GenericTable`
// constraint and cause `supabase.from()` to resolve queries to `never`.
export type ProfileRow = {
  id: string
  user_id: string
  full_name: string
  email: string
  github_username: string | null
  leetcode_username: string | null
  created_at: string
  updated_at: string
}

export type ApplicationRow = {
  id: string
  user_id: string
  company_name: string
  company_logo: string | null
  role: string
  package: string | null
  location: string | null
  applied_date: string | null
  last_updated: string | null
  status: ApplicationStatus
  next_round: string | null
  notes: string | null
  recruiter: string | null
  recruiter_email: string | null
  application_link: string | null
  deadline: string | null
  priority: Priority
  created_at: string
  updated_at: string
}

export type DsaProgressRow = {
  id: string
  user_id: string
  topic: string
  problem_id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  status: DsaProblemStatus
  solved_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type AtsReportRow = {
  id: string
  user_id: string
  resume_name: string | null
  overall_score: number
  keyword_matches: string[]
  missing_keywords: string[]
  suggestions: string[]
  created_at: string
}

export type RoadmapRow = {
  id: string
  user_id: string
  title: string
  description: string | null
  goal: string | null
  status: 'active' | 'completed' | 'archived'
  start_date: string | null
  target_date: string | null
  progress: number
  created_at: string
  updated_at: string
}

/* ------------------------------ Table definitions ------------------------------ */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        // `user_id` is set server-side by a trigger (auth.uid()) under RLS,
        // so it is omitted from Insert/Update.
        Insert: Omit<ProfileRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        Update: Partial<
          Omit<ProfileRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >
        Relationships: []
      }
      applications: {
        Row: ApplicationRow
        Insert: Omit<
          ApplicationRow,
          'id' | 'user_id' | 'created_at' | 'updated_at'
        >
        Update: Partial<
          Omit<ApplicationRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >
        Relationships: []
      }
      dsa_progress: {
        Row: DsaProgressRow
        Insert: Omit<
          DsaProgressRow,
          'id' | 'user_id' | 'created_at' | 'updated_at'
        >
        Update: Partial<
          Omit<DsaProgressRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >
        Relationships: []
      }
      ats_reports: {
        Row: AtsReportRow
        Insert: Omit<AtsReportRow, 'id' | 'user_id' | 'created_at'>
        Update: Partial<Omit<AtsReportRow, 'id' | 'user_id' | 'created_at'>>
        Relationships: []
      }
      roadmaps: {
        Row: RoadmapRow
        Insert: Omit<
          RoadmapRow,
          'id' | 'user_id' | 'created_at' | 'updated_at'
        >
        Update: Partial<
          Omit<RoadmapRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
        >
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

/* -------------------------------- Error types -------------------------------- */

export type DatabaseErrorKind =
  | 'not-authenticated'
  | 'not-found'
  | 'permission-denied'
  | 'network'
  | 'duplicate'
  | 'unknown'

export interface DatabaseError {
  kind: DatabaseErrorKind
  message: string
  code?: string
}

/** Generic result returned by the database service layer. */
export interface DatabaseResult<T> {
  data: T | null
  error: DatabaseError | null
}
