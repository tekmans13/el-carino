alter table public.inscriptions
  add column planned_payment_main_method text null,
  add column planned_payment_aids text[] not null default '{}';

alter table public.inscriptions
  add constraint inscriptions_planned_payment_main_method_check
  check (
    planned_payment_main_method is null
    or planned_payment_main_method in (
      'cash',
      'check_1',
      'check_2',
      'check_3'
    )
  );

alter table public.inscriptions
  add constraint inscriptions_planned_payment_aids_check
  check (
    planned_payment_aids <@ array[
      'caf',
      'cjeune',
      'pass_sport'
    ]::text[]
  );
