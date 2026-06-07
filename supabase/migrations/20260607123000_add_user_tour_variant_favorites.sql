create table "public"."user_tour_variant_favorites" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "tour_variant_id" uuid not null,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."user_tour_variant_favorites" enable row level security;

create unique index "user_tour_variant_favorites_pkey" on public.user_tour_variant_favorites using btree ("id");
alter table "public"."user_tour_variant_favorites" add constraint "user_tour_variant_favorites_pkey" primary key using index "user_tour_variant_favorites_pkey";

create unique index "user_tour_variant_favorites_user_id_tour_variant_id_key" on public.user_tour_variant_favorites using btree ("user_id", "tour_variant_id");
alter table "public"."user_tour_variant_favorites" add constraint "user_tour_variant_favorites_user_id_tour_variant_id_key" unique using index "user_tour_variant_favorites_user_id_tour_variant_id_key";

alter table "public"."user_tour_variant_favorites"
  add constraint "user_tour_variant_favorites_user_id_fkey"
  foreign key ("user_id")
  references auth.users(id)
  on delete cascade
  not valid;

alter table "public"."user_tour_variant_favorites"
  validate constraint "user_tour_variant_favorites_user_id_fkey";

alter table "public"."user_tour_variant_favorites"
  add constraint "user_tour_variant_favorites_tour_variant_id_fkey"
  foreign key ("tour_variant_id")
  references public.tour_variants(id)
  on delete cascade
  not valid;

alter table "public"."user_tour_variant_favorites"
  validate constraint "user_tour_variant_favorites_tour_variant_id_fkey";

grant delete on table "public"."user_tour_variant_favorites" to authenticated;
grant insert on table "public"."user_tour_variant_favorites" to authenticated;
grant select on table "public"."user_tour_variant_favorites" to authenticated;

grant delete on table "public"."user_tour_variant_favorites" to service_role;
grant insert on table "public"."user_tour_variant_favorites" to service_role;
grant references on table "public"."user_tour_variant_favorites" to service_role;
grant select on table "public"."user_tour_variant_favorites" to service_role;
grant trigger on table "public"."user_tour_variant_favorites" to service_role;
grant truncate on table "public"."user_tour_variant_favorites" to service_role;
grant update on table "public"."user_tour_variant_favorites" to service_role;

create policy "Users can view their own tour variant favorites"
on "public"."user_tour_variant_favorites"
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own tour variant favorites"
on "public"."user_tour_variant_favorites"
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own tour variant favorites"
on "public"."user_tour_variant_favorites"
for delete
to authenticated
using ((select auth.uid()) = user_id);
