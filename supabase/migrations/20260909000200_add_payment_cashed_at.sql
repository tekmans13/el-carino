alter table public.payments
  add column cashed_at timestamptz;

update public.payments
set cashed_at = received_at
where cashed_at is null;

create index payments_cashed_at_idx
  on public.payments(cashed_at);
