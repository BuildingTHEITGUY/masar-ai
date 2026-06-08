-- Run in Supabase SQL Editor if your students table only has id, created_at, name, email, nationality
-- Safe to run multiple times (IF NOT EXISTS)

alter table public.students add column if not exists curriculum text;
alter table public.students add column if not exists overall_average numeric;
alter table public.students add column if not exists preferred_location text;
alter table public.students add column if not exists selected_track text;
alter table public.students add column if not exists ai_roadmap text;

-- Service role bypasses RLS; optional: allow anon read for dashboard testing only
-- alter table public.students enable row level security;
