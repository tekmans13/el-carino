alter table public.inscriptions
add column if not exists admin_note text;

comment on column public.inscriptions.admin_note is
  'Note interne réservée aux administrateurs.';
