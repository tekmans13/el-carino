alter table public.club_settings
add column registration_season text not null default '2026/2027';

alter table public.club_settings
add constraint club_settings_registration_season_check
check (
  registration_season ~ '^[0-9]{4}/[0-9]{4}$'
);
