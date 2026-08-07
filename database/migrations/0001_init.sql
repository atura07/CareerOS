-- =====================================================================
-- CareerOS — Supabase schema (0001_init.sql)
-- Tables + Row Level Security (RLS) for the Sprint 13 backend foundation.
--
-- Applies to the `public` schema. Run against your Supabase project via
-- the SQL Editor or the Supabase CLI (`supabase db push`).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. profiles
--    One row per authenticated user. `user_id` references auth.users.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  github_username text,
  leetcode_username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------
-- 2. applications
--    Job application tracker rows, scoped by user.
-- ---------------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_name text not null,
  company_logo text,
  role text not null,
  package text,
  location text,
  applied_date date,
  last_updated date,
  status text not null default 'Applied',
  next_round text,
  notes text,
  recruiter text,
  recruiter_email text,
  application_link text,
  deadline date,
  priority text not null default 'Medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. dsa_progress
--    DSA problem-solving progress, scoped by user.
-- ---------------------------------------------------------------------
create table if not exists public.dsa_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null,
  problem_id text not null,
  title text not null,
  difficulty text,
  status text not null default 'todo',
  solved_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. ats_reports
--    ATS analysis results, scoped by user.
-- ---------------------------------------------------------------------
create table if not exists public.ats_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_name text,
  overall_score integer not null default 0,
  keyword_matches text[] not null default '{}',
  missing_keywords text[] not null default '{}',
  suggestions text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. roadmaps
--    Career roadmap plans, scoped by user.
-- ---------------------------------------------------------------------
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  goal text,
  status text not null default 'active',
  start_date date,
  target_date date,
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- Helpers: set user_id from auth.uid() and bump updated_at.
-- =====================================================================
create or replace function public.set_user_id()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.user_id := auth.uid();
  return new;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Apply the triggers to tables that carry updated_at.
drop trigger if exists trg_profiles_user_id on public.profiles;
create trigger trg_profiles_user_id
  before insert on public.profiles
  for each row execute function public.set_user_id();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_applications_user_id on public.applications;
create trigger trg_applications_user_id
  before insert on public.applications
  for each row execute function public.set_user_id();

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
  before update on public.applications
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_dsa_progress_user_id on public.dsa_progress;
create trigger trg_dsa_progress_user_id
  before insert on public.dsa_progress
  for each row execute function public.set_user_id();

drop trigger if exists trg_dsa_progress_updated_at on public.dsa_progress;
create trigger trg_dsa_progress_updated_at
  before update on public.dsa_progress
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_ats_reports_user_id on public.ats_reports;
create trigger trg_ats_reports_user_id
  before insert on public.ats_reports
  for each row execute function public.set_user_id();

drop trigger if exists trg_roadmaps_user_id on public.roadmaps;
create trigger trg_roadmaps_user_id
  before insert on public.roadmaps
  for each row execute function public.set_user_id();

drop trigger if exists trg_roadmaps_updated_at on public.roadmaps;
create trigger trg_roadmaps_updated_at
  before update on public.roadmaps
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row Level Security
-- Enable RLS on every table and add per-user policies.
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.dsa_progress enable row level security;
alter table public.ats_reports enable row level security;
alter table public.roadmaps enable row level security;

-- profiles: users can read/update their own profile.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = user_id);

-- applications
create policy "applications_select_own" on public.applications
  for select using (auth.uid() = user_id);
create policy "applications_insert_own" on public.applications
  for insert with check (auth.uid() = user_id);
create policy "applications_update_own" on public.applications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "applications_delete_own" on public.applications
  for delete using (auth.uid() = user_id);

-- dsa_progress
create policy "dsa_progress_select_own" on public.dsa_progress
  for select using (auth.uid() = user_id);
create policy "dsa_progress_insert_own" on public.dsa_progress
  for insert with check (auth.uid() = user_id);
create policy "dsa_progress_update_own" on public.dsa_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "dsa_progress_delete_own" on public.dsa_progress
  for delete using (auth.uid() = user_id);

-- ats_reports
create policy "ats_reports_select_own" on public.ats_reports
  for select using (auth.uid() = user_id);
create policy "ats_reports_insert_own" on public.ats_reports
  for insert with check (auth.uid() = user_id);
create policy "ats_reports_update_own" on public.ats_reports
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ats_reports_delete_own" on public.ats_reports
  for delete using (auth.uid() = user_id);

-- roadmaps
create policy "roadmaps_select_own" on public.roadmaps
  for select using (auth.uid() = user_id);
create policy "roadmaps_insert_own" on public.roadmaps
  for insert with check (auth.uid() = user_id);
create policy "roadmaps_update_own" on public.roadmaps
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "roadmaps_delete_own" on public.roadmaps
  for delete using (auth.uid() = user_id);

-- =====================================================================
-- Auto-create a profile row when a new auth user signs up.
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
