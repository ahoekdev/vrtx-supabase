create table "public"."tour_variants" (
  "id" uuid not null default gen_random_uuid(),
  "created_at" timestamp with time zone not null default now(),
  "tour_id" uuid not null,
  "label" text not null,
  "slug" text not null,
  "is_primary" boolean not null default false
);

alter table "public"."tour_variants" enable row level security;

create unique index "tour_variants_pkey" on public.tour_variants using btree ("id");
alter table "public"."tour_variants" add constraint "tour_variants_pkey" primary key using index "tour_variants_pkey";

create unique index "tour_variants_tour_id_slug_key" on public.tour_variants using btree ("tour_id", "slug");
alter table "public"."tour_variants" add constraint "tour_variants_tour_id_slug_key" unique using index "tour_variants_tour_id_slug_key";

create unique index "tour_variants_one_primary_per_tour_key"
  on public.tour_variants using btree ("tour_id")
  where is_primary;

create index "tour_variants_tour_id_idx" on public.tour_variants using btree ("tour_id");

alter table "public"."tour_variants"
  add constraint "tour_variants_tour_id_fkey"
  foreign key ("tour_id")
  references public.tour(id)
  not valid;

alter table "public"."tour_variants"
  validate constraint "tour_variants_tour_id_fkey";

grant references on table "public"."tour_variants" to "anon";
grant select on table "public"."tour_variants" to "anon";

grant references on table "public"."tour_variants" to "authenticated";
grant select on table "public"."tour_variants" to "authenticated";

grant delete on table "public"."tour_variants" to "service_role";
grant insert on table "public"."tour_variants" to "service_role";
grant references on table "public"."tour_variants" to "service_role";
grant select on table "public"."tour_variants" to "service_role";
grant trigger on table "public"."tour_variants" to "service_role";
grant truncate on table "public"."tour_variants" to "service_role";
grant update on table "public"."tour_variants" to "service_role";

create policy "Enable read access for all users"
on "public"."tour_variants"
for select
using (true);

insert into public.tour_variants (tour_id, label, slug, is_primary)
select
  tour.id,
  'Primary',
  'primary',
  true
from public.tour as tour
where not exists (
  select 1
  from public.tour_variants as variant
  where variant.tour_id = tour.id
    and variant.slug = 'primary'
);

create table "public"."tour_variant_stages" (
  "id" uuid not null default gen_random_uuid(),
  "tour_variant_id" uuid not null,
  "stage_id" uuid not null,
  "order" smallint not null
);

alter table "public"."tour_variant_stages" enable row level security;

create unique index "tour_variant_stages_pkey" on public.tour_variant_stages using btree ("id");
alter table "public"."tour_variant_stages" add constraint "tour_variant_stages_pkey" primary key using index "tour_variant_stages_pkey";

create unique index "tour_variant_stages_variant_order_key" on public.tour_variant_stages using btree ("tour_variant_id", "order");
alter table "public"."tour_variant_stages" add constraint "tour_variant_stages_variant_order_key" unique using index "tour_variant_stages_variant_order_key";

create index "tour_variant_stages_tour_variant_id_idx" on public.tour_variant_stages using btree ("tour_variant_id");
create index "tour_variant_stages_stage_id_idx" on public.tour_variant_stages using btree ("stage_id");

alter table "public"."tour_variant_stages"
  add constraint "tour_variant_stages_tour_variant_id_fkey"
  foreign key ("tour_variant_id")
  references public.tour_variants(id)
  on delete cascade
  not valid;

alter table "public"."tour_variant_stages"
  validate constraint "tour_variant_stages_tour_variant_id_fkey";

alter table "public"."tour_variant_stages"
  add constraint "tour_variant_stages_stage_id_fkey"
  foreign key ("stage_id")
  references public.stages(id)
  not valid;

alter table "public"."tour_variant_stages"
  validate constraint "tour_variant_stages_stage_id_fkey";

grant references on table "public"."tour_variant_stages" to "anon";
grant select on table "public"."tour_variant_stages" to "anon";

grant references on table "public"."tour_variant_stages" to "authenticated";
grant select on table "public"."tour_variant_stages" to "authenticated";

grant delete on table "public"."tour_variant_stages" to "service_role";
grant insert on table "public"."tour_variant_stages" to "service_role";
grant references on table "public"."tour_variant_stages" to "service_role";
grant select on table "public"."tour_variant_stages" to "service_role";
grant trigger on table "public"."tour_variant_stages" to "service_role";
grant truncate on table "public"."tour_variant_stages" to "service_role";
grant update on table "public"."tour_variant_stages" to "service_role";

create policy "Enable read access for all users"
on "public"."tour_variant_stages"
for select
using (true);

insert into public.tour_variant_stages (tour_variant_id, stage_id, "order")
select
  variant.id,
  old_stage.stage_id,
  old_stage."order"
from public.tour_stages as old_stage
join public.tour_variants as variant
  on variant.tour_id = old_stage.tour_id
 and variant.is_primary = true
where not exists (
  select 1
  from public.tour_variant_stages as new_stage
  where new_stage.tour_variant_id = variant.id
    and new_stage."order" = old_stage."order"
);
