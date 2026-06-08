-- Masar AI — run once in Supabase SQL editor
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text,
  nationality text,
  curriculum text,
  overall_average numeric,
  math_score numeric,
  physics_score numeric,
  english_score numeric,
  preferred_location text,
  selected_track text,
  ai_roadmap text
);

create index if not exists students_email_idx on public.students (email);
create index if not exists students_created_at_idx on public.students (created_at desc);
