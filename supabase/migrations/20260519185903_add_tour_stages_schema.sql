
  create table "public"."tour_stages" (
    "id" uuid not null default gen_random_uuid(),
    "stage_id" uuid not null default gen_random_uuid(),
    "order" smallint not null
      );


alter table "public"."tour_stages" enable row level security;

CREATE UNIQUE INDEX tour_stages_pkey ON public.tour_stages USING btree (id);

alter table "public"."tour_stages" add constraint "tour_stages_pkey" PRIMARY KEY using index "tour_stages_pkey";

alter table "public"."tour_stages" add constraint "tour_stages_stage_id_fkey" FOREIGN KEY (stage_id) REFERENCES public.stages(id) not valid;

alter table "public"."tour_stages" validate constraint "tour_stages_stage_id_fkey";

grant delete on table "public"."tour_stages" to "anon";

grant insert on table "public"."tour_stages" to "anon";

grant references on table "public"."tour_stages" to "anon";

grant select on table "public"."tour_stages" to "anon";

grant trigger on table "public"."tour_stages" to "anon";

grant truncate on table "public"."tour_stages" to "anon";

grant update on table "public"."tour_stages" to "anon";

grant delete on table "public"."tour_stages" to "authenticated";

grant insert on table "public"."tour_stages" to "authenticated";

grant references on table "public"."tour_stages" to "authenticated";

grant select on table "public"."tour_stages" to "authenticated";

grant trigger on table "public"."tour_stages" to "authenticated";

grant truncate on table "public"."tour_stages" to "authenticated";

grant update on table "public"."tour_stages" to "authenticated";

grant delete on table "public"."tour_stages" to "service_role";

grant insert on table "public"."tour_stages" to "service_role";

grant references on table "public"."tour_stages" to "service_role";

grant select on table "public"."tour_stages" to "service_role";

grant trigger on table "public"."tour_stages" to "service_role";

grant truncate on table "public"."tour_stages" to "service_role";

grant update on table "public"."tour_stages" to "service_role";


