-- Autorise uniquement les utilisateurs authentifiés présents
-- dans public.profiles avec le rôle admin ou bureau
-- à consulter les inscriptions.

alter table public.profiles
  enable row level security;

alter table public.inscriptions
  enable row level security;

drop policy if exists
  "users can read their own profile"
  on public.profiles;

create policy
  "users can read their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

drop policy if exists
  "admin and bureau can read registrations"
  on public.inscriptions;

create policy
  "admin and bureau can read registrations"
on public.inscriptions
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
);
