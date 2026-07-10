-- App-Firness cloud sync schema.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
--
-- Every domain's local data (workouts, nutrition entries, custom exercises,
-- custom foods, custom routines, scheduled routines, progress metrics) is
-- stored as JSON in one shared table, discriminated by `collection` — this
-- mirrors the app's local AsyncStorage repository shape exactly, so no
-- separate table per feature is needed. The user's profile gets its own
-- table since it's a single row per user rather than a collection.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade default auth.uid(),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_collections (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  collection text not null,
  item_id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, collection, item_id)
);

alter table public.profiles enable row level security;
alter table public.user_collections enable row level security;

create policy "profiles: owner read" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles: owner insert" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles: owner update" on public.profiles
  for update using (auth.uid() = user_id);
create policy "profiles: owner delete" on public.profiles
  for delete using (auth.uid() = user_id);

create policy "user_collections: owner read" on public.user_collections
  for select using (auth.uid() = user_id);
create policy "user_collections: owner insert" on public.user_collections
  for insert with check (auth.uid() = user_id);
create policy "user_collections: owner update" on public.user_collections
  for update using (auth.uid() = user_id);
create policy "user_collections: owner delete" on public.user_collections
  for delete using (auth.uid() = user_id);

create index if not exists user_collections_user_collection_idx
  on public.user_collections (user_id, collection);
