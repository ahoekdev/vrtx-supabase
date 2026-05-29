alter table "public"."lodges"
  add column "slug" text;

update "public"."lodges"
set "slug" = public.slugify_text("name");

alter table "public"."lodges"
  alter column "slug" set not null;

create unique index "lodges_slug_key" on "public"."lodges" using btree ("slug");

alter table "public"."lodges"
  add constraint "lodges_slug_key" unique using index "lodges_slug_key";

do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgname = 'set_lodge_slug_before_write'
      and tgrelid = 'public.lodges'::regclass
  ) then
    execute 'drop trigger "set_lodge_slug_before_write" on "public"."lodges"';
  end if;
end;
$$;

create trigger "set_lodge_slug_before_write"
before insert or update of "name" on "public"."lodges"
for each row
execute function public.set_slug_from_name();
