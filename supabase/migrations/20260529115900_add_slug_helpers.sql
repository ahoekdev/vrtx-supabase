create extension if not exists "unaccent" with schema "extensions";

create or replace function public.slugify_text(input text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(
      both '-' from regexp_replace(
        lower(extensions.unaccent(coalesce(input, ''))),
        '[^a-z0-9]+',
        '-',
        'g'
      )
    ),
    ''
  );
$$;

create or replace function public.set_slug_from_name()
returns trigger
language plpgsql
as $$
begin
  new.slug := public.slugify_text(new.name);
  return new;
end;
$$;
