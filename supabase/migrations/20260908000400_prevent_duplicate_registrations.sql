create unique index
  if not exists inscriptions_unique_practitioner_identity_idx
on public.inscriptions (
  lower(btrim(first_name)),
  lower(btrim(last_name)),
  birth_date
);
