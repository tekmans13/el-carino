-- Autorise la création publique d'un dossier d'inscription,
-- sans donner accès à la lecture des dossiers existants.

alter table public.inscriptions
  enable row level security;

grant insert on table public.inscriptions
  to anon, authenticated;

drop policy if exists
  "public can create draft registrations"
  on public.inscriptions;

create policy
  "public can create draft registrations"
on public.inscriptions
as permissive
for insert
to anon, authenticated
with check (
  status = 'brouillon'
);
