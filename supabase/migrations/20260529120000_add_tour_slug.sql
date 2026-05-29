alter table "public"."tour"
  add column "slug" text;

update "public"."tour"
set "slug" = public.slugify_text("name");

alter table "public"."tour"
  alter column "slug" set not null;

create unique index "tour_slug_key" on "public"."tour" using btree ("slug");

alter table "public"."tour"
  add constraint "tour_slug_key" unique using index "tour_slug_key";

do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgname = 'set_tour_slug_before_write'
      and tgrelid = 'public.tour'::regclass
  ) then
    execute 'drop trigger "set_tour_slug_before_write" on "public"."tour"';
  end if;
end;
$$;

create trigger "set_tour_slug_before_write"
before insert or update of "name" on "public"."tour"
for each row
execute function public.set_slug_from_name();
