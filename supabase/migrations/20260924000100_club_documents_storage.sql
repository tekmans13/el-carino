-- Documents publics du club.
-- Les fichiers sont accessibles publiquement,
-- mais seuls les membres Admin et Bureau peuvent les modifier.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'club-documents',
  'club-documents',
  true,
  10485760,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- Lecture publique

drop policy if exists
  "public can read club documents"
  on storage.objects;

create policy
  "public can read club documents"
on storage.objects
for select
to public
using (
  bucket_id = 'club-documents'
);


-- Upload Admin + Bureau

drop policy if exists
  "admin and bureau can upload club documents"
  on storage.objects;

create policy
  "admin and bureau can upload club documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'club-documents'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
);


-- Remplacement d'un document existant.
-- Supabase upsert nécessite également UPDATE.

drop policy if exists
  "admin and bureau can update club documents"
  on storage.objects;

create policy
  "admin and bureau can update club documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'club-documents'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
)
with check (
  bucket_id = 'club-documents'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
);
