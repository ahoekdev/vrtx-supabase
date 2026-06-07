create table "public"."user_lodge_favorites" (
  "id" uuid not null default gen_random_uuid(),
  "user_id" uuid not null,
  "lodge_id" uuid not null,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."user_lodge_favorites" enable row level security;

create unique index "user_lodge_favorites_pkey" on public.user_lodge_favorites using btree ("id");
alter table "public"."user_lodge_favorites" add constraint "user_lodge_favorites_pkey" primary key using index "user_lodge_favorites_pkey";

create unique index "user_lodge_favorites_user_id_lodge_id_key" on public.user_lodge_favorites using btree ("user_id", "lodge_id");
alter table "public"."user_lodge_favorites" add constraint "user_lodge_favorites_user_id_lodge_id_key" unique using index "user_lodge_favorites_user_id_lodge_id_key";

alter table "public"."user_lodge_favorites"
  add constraint "user_lodge_favorites_user_id_fkey"
  foreign key ("user_id")
  references auth.users(id)
  on delete cascade
  not valid;

alter table "public"."user_lodge_favorites"
  validate constraint "user_lodge_favorites_user_id_fkey";

alter table "public"."user_lodge_favorites"
  add constraint "user_lodge_favorites_lodge_id_fkey"
  foreign key ("lodge_id")
  references public.lodges(id)
  on delete cascade
  not valid;

alter table "public"."user_lodge_favorites"
  validate constraint "user_lodge_favorites_lodge_id_fkey";

grant delete on table "public"."user_lodge_favorites" to authenticated;
grant insert on table "public"."user_lodge_favorites" to authenticated;
grant select on table "public"."user_lodge_favorites" to authenticated;

grant delete on table "public"."user_lodge_favorites" to service_role;
grant insert on table "public"."user_lodge_favorites" to service_role;
grant references on table "public"."user_lodge_favorites" to service_role;
grant select on table "public"."user_lodge_favorites" to service_role;
grant trigger on table "public"."user_lodge_favorites" to service_role;
grant truncate on table "public"."user_lodge_favorites" to service_role;
grant update on table "public"."user_lodge_favorites" to service_role;

create policy "Users can view their own favorites"
on "public"."user_lodge_favorites"
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own favorites"
on "public"."user_lodge_favorites"
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own favorites"
on "public"."user_lodge_favorites"
for delete
to authenticated
using ((select auth.uid()) = user_id);
