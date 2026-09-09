drop policy if exists
  "admin and bureau can delete registrations"
  on public.inscriptions;

create policy
  "admin and bureau can delete registrations"
on public.inscriptions
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'bureau')
  )
);
