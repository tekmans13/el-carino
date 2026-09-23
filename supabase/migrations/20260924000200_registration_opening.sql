alter table public.club_settings
add column registration_open boolean not null default true;

alter table public.club_settings
add column registration_reopen_date date;
