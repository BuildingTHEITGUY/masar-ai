-- Run in Supabase SQL Editor — English proficiency replaces EmSAT tracking
alter table public.students
  add column if not exists english_test_type text,
  add column if not exists english_test_score numeric;
