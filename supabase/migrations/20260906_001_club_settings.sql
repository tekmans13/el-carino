create table public.club_settings (
  id uuid primary key default gen_random_uuid(),

  adult_age_threshold integer not null default 18,

  minor_annual_fee_cents integer not null default 12000,
  adult_annual_fee_cents integer not null default 15000,
  federal_license_fee_cents integer not null default 3500,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint club_settings_single_row
    check (id is not null),

  constraint club_settings_adult_age_threshold_check
    check (adult_age_threshold >= 1 and adult_age_threshold <= 120),

  constraint club_settings_minor_fee_check
    check (minor_annual_fee_cents >= 0),

  constraint club_settings_adult_fee_check
    check (adult_annual_fee_cents >= 0),

  constraint club_settings_license_fee_check
    check (federal_license_fee_cents >= 0)
);

alter table public.club_settings enable row level security;

insert into public.club_settings (
  adult_age_threshold,
  minor_annual_fee_cents,
  adult_annual_fee_cents,
  federal_license_fee_cents
)
values (
  18,
  12000,
  15000,
  3500
);

create policy "Public can read club settings"
on public.club_settings
for select
to anon, authenticated
using (true);

create policy "Authenticated users can update club settings"
on public.club_settings
for update
to authenticated
using (true)
with check (true);
