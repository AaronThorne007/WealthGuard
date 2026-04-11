-- Run in Supabase SQL Editor (or merge into your migrations).
-- Goals: one row per savings goal for the authenticated user.

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  saved numeric not null default 0,
  target numeric not null,
  created_at timestamptz not null default now(),
  constraint goals_target_positive check (target > 0),
  constraint goals_saved_non_negative check (saved >= 0)
);

create index if not exists goals_user_id_idx on public.goals (user_id);

alter table public.goals enable row level security;

create policy "Users can select own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  using (auth.uid() = user_id);
