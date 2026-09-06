create table public.payments (
  id uuid primary key default gen_random_uuid(),

  inscription_id uuid not null
    references public.inscriptions(id)
    on delete cascade,

  amount_cents integer not null,

  payment_method text not null,

  received_at timestamptz not null
    default now(),

  note text null,

  created_by uuid null
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null
    default now(),

  constraint payments_amount_cents_positive
    check (amount_cents > 0),

  constraint payments_payment_method_check
    check (
      payment_method in (
        'cash',
        'check',
        'caf',
        'cjeune',
        'pass_sport'
      )
    )
);

create index payments_inscription_id_idx
  on public.payments(inscription_id);

create index payments_received_at_idx
  on public.payments(received_at desc);

alter table public.payments
  enable row level security;

create policy "Authenticated users can read payments"
  on public.payments
  for select
  to authenticated
  using (true);

create policy "Authenticated users can create payments"
  on public.payments
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update payments"
  on public.payments
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete payments"
  on public.payments
  for delete
  to authenticated
  using (true);
