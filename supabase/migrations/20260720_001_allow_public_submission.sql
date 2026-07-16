-- Autorise le formulaire public à créer uniquement
-- un dossier officiellement soumis.

drop policy if exists
  "public can create draft registrations"
  on public.inscriptions;

drop policy if exists
  "public can submit registrations"
  on public.inscriptions;

create policy
  "public can submit registrations"
on public.inscriptions
as permissive
for insert
to anon, authenticated
with check (
  status = 'soumis'
);
