-- Bucket privé réservé aux certificats médicaux PDF.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'medical-certificates',
  'medical-certificates',
  false,
  5242880,
  array['application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Le formulaire public peut uniquement déposer un PDF.
-- Il ne peut ni lire, ni modifier, ni supprimer les fichiers.

drop policy if exists
  "public can upload medical certificates"
  on storage.objects;

create policy
  "public can upload medical certificates"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'medical-certificates'
  and storage.extension(name) = 'pdf'
);

-- Les membres autorisés du back-office peuvent lire les PDF.

drop policy if exists
  "admin and bureau can read medical certificates"
  on storage.objects;

create policy
  "admin and bureau can read medical certificates"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'medical-certificates'
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
);
