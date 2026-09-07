alter table public.inscriptions
  add column height_cm integer,
  add column weight_kg numeric(5,2),
  add column tshirt_size text,
  add column short_size text;

alter table public.inscriptions
  add constraint inscriptions_height_cm_check
    check (height_cm is null or height_cm between 80 and 250),
  add constraint inscriptions_weight_kg_check
    check (weight_kg is null or weight_kg between 20 and 300),
  add constraint inscriptions_tshirt_size_check
    check (
      tshirt_size is null
      or tshirt_size in ('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL')
    ),
  add constraint inscriptions_short_size_check
    check (
      short_size is null
      or short_size in ('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL')
    );
