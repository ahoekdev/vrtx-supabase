
  create table "public"."tour" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
      );


alter table "public"."tour" enable row level security;

alter table "public"."tour_stages" add column "tour_id" uuid;

alter table "public"."tour_stages" alter column "stage_id" drop default;

CREATE UNIQUE INDEX tour_name_key ON public.tour USING btree (name);

CREATE UNIQUE INDEX tour_pkey ON public.tour USING btree (id);

alter table "public"."tour" add constraint "tour_pkey" PRIMARY KEY using index "tour_pkey";

alter table "public"."tour" add constraint "tour_name_key" UNIQUE using index "tour_name_key";

alter table "public"."tour_stages" add constraint "tour_stages_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tour(id) not valid;

alter table "public"."tour_stages" validate constraint "tour_stages_tour_id_fkey";

grant delete on table "public"."tour" to "anon";

grant insert on table "public"."tour" to "anon";

grant references on table "public"."tour" to "anon";

grant select on table "public"."tour" to "anon";

grant trigger on table "public"."tour" to "anon";

grant truncate on table "public"."tour" to "anon";

grant update on table "public"."tour" to "anon";

grant delete on table "public"."tour" to "authenticated";

grant insert on table "public"."tour" to "authenticated";

grant references on table "public"."tour" to "authenticated";

grant select on table "public"."tour" to "authenticated";

grant trigger on table "public"."tour" to "authenticated";

grant truncate on table "public"."tour" to "authenticated";

grant update on table "public"."tour" to "authenticated";

grant delete on table "public"."tour" to "service_role";

grant insert on table "public"."tour" to "service_role";

grant references on table "public"."tour" to "service_role";

grant select on table "public"."tour" to "service_role";

grant trigger on table "public"."tour" to "service_role";

grant truncate on table "public"."tour" to "service_role";

grant update on table "public"."tour" to "service_role";


