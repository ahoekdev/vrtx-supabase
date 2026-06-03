create or replace function public.get_tour_variants(
  p_lodge_id uuid default null,
  p_limit integer default null
)
returns table (
  tour_id uuid,
  tour_name text,
  tour_slug text,
  id uuid,
  label text,
  slug text,
  is_primary boolean,
  stage_count integer,
  distance_meters integer,
  variant_count integer
)
language sql
stable
as $$
with ordered as (
  select
    t.id as tour_id,
    t.name as tour_name,
    t.slug as tour_slug,
    tv.id,
    tv.label,
    tv.slug,
    tv.is_primary,
    coalesce(stage_metrics.stage_count, 0)::integer as stage_count,
    coalesce(stage_metrics.distance_meters, 0)::integer as distance_meters,
    variant_metrics.variant_count,
    row_number() over (
      order by tv.label asc, tv.is_primary desc, tv.id asc
    ) as rn
  from public.tour_variants as tv
  join public.tour as t
    on t.id = tv.tour_id
  left join lateral (
    select
      count(*)::integer as stage_count,
      coalesce(sum(s.distance), 0)::integer as distance_meters
    from public.tour_variant_stages as tvs
    join public.stages as s
      on s.id = tvs.stage_id
    where tvs.tour_variant_id = tv.id
  ) as stage_metrics on true
  left join lateral (
    select
      count(*)::integer as variant_count
    from public.tour_variants as tv2
    where tv2.tour_id = tv.tour_id
  ) as variant_metrics on true
  where
    p_lodge_id is null
    or exists (
      select 1
      from public.tour_variant_stages as matching_tvs
      join public.stages as matching_stage
        on matching_stage.id = matching_tvs.stage_id
      where matching_tvs.tour_variant_id = tv.id
        and (
          matching_stage.from_lodge_id = p_lodge_id
          or matching_stage.to_lodge_id = p_lodge_id
        )
    )
)
select
  tour_id,
  tour_name,
  tour_slug,
  id,
  label,
  slug,
  is_primary,
  stage_count,
  distance_meters,
  variant_count
from ordered
where p_limit is null or rn <= p_limit
order by rn;
$$;

grant execute on function public.get_tour_variants(uuid, integer) to anon;
grant execute on function public.get_tour_variants(uuid, integer) to authenticated;
grant execute on function public.get_tour_variants(uuid, integer) to service_role;
