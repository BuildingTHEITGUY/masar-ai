-- Run in Supabase SQL Editor after students table exists

alter table public.students

  add column if not exists math_score numeric,

  add column if not exists physics_score numeric,

  add column if not exists english_score numeric;


