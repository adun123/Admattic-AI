-- Final render storage + history.
-- Run this in Supabase SQL Editor after your base project tables exist.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'final-renders',
  'final-renders',
  true,
  524288000,
  array['video/mp4']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.final_renders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  aspect_ratio text not null default '9:16',
  clip_count integer not null default 0,
  file_size_bytes bigint not null default 0,
  has_audio boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists final_renders_project_id_created_at_idx
  on public.final_renders (project_id, created_at desc);

alter table public.final_renders enable row level security;

drop policy if exists "Authenticated users can read final renders" on public.final_renders;
create policy "Authenticated users can read final renders"
on public.final_renders
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert final renders" on public.final_renders;
create policy "Authenticated users can insert final renders"
on public.final_renders
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can delete final renders" on public.final_renders;
create policy "Authenticated users can delete final renders"
on public.final_renders
for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can upload final render files" on storage.objects;
create policy "Authenticated users can upload final render files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'final-renders');

drop policy if exists "Anyone can read final render files" on storage.objects;
create policy "Anyone can read final render files"
on storage.objects
for select
to public
using (bucket_id = 'final-renders');

drop policy if exists "Authenticated users can delete final render files" on storage.objects;
create policy "Authenticated users can delete final render files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'final-renders');
