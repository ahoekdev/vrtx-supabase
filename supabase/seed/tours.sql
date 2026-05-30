insert into public.tour (name)
values
  ('Berliner Hohenweg'),
  ('Stubaier Hohenweg');

insert into public.tour_variants (tour_id, label, slug, is_primary)
select
  tour.id,
  'Primary',
  'primary',
  true
from public.tour as tour;

insert into public.tour_variant_stages (tour_variant_id, stage_id, "order")
select
  variant.id,
  stage.id,
  seeded_stages.stage_order
from (
  values
    ('Berliner Hohenweg', 'Gamshütte', 'Friesenberghaus', 1),
    ('Berliner Hohenweg', 'Friesenberghaus', 'Olpererhütte', 2),
    ('Berliner Hohenweg', 'Olpererhütte', 'Furtschlaglhaus', 3),
    ('Berliner Hohenweg', 'Furtschlaglhaus', 'Berliner Hütte', 4),
    ('Berliner Hohenweg', 'Berliner Hütte', 'Greizer Hütte', 5),
    ('Berliner Hohenweg', 'Greizer Hütte', 'Kasseler Hütte', 6),
    ('Berliner Hohenweg', 'Kasseler Hütte', 'Karl-von-Edel-Hütte', 7),
    ('Stubaier Hohenweg', 'Starkenburger Hütte', 'Franz-Senn-Hütte', 1),
    ('Stubaier Hohenweg', 'Franz-Senn-Hütte', 'Neue Regensburger Hütte', 2),
    ('Stubaier Hohenweg', 'Neue Regensburger Hütte', 'Dresdner Hütte', 3),
    ('Stubaier Hohenweg', 'Dresdner Hütte', 'Sulzenauhütte', 4),
    ('Stubaier Hohenweg', 'Sulzenauhütte', 'Nürnberger Hütte', 5),
    ('Stubaier Hohenweg', 'Nürnberger Hütte', 'Bremer Hütte', 6),
    ('Stubaier Hohenweg', 'Bremer Hütte', 'Innsbrucker Hütte', 7)
) as seeded_stages(tour_name, from_name, to_name, stage_order)
join public.tour as tour
  on tour.name = seeded_stages.tour_name
join public.tour_variants as variant
  on variant.tour_id = tour.id
 and variant.is_primary = true
join public.lodges as from_lodge
  on from_lodge.name = seeded_stages.from_name
join public.lodges as to_lodge
  on to_lodge.name = seeded_stages.to_name
join public.stages as stage
  on stage.from_lodge_id = from_lodge.id
 and stage.to_lodge_id = to_lodge.id;

insert into public.tour (name)
values
  ('Sellrainer Hüttenrunde');

insert into public.tour_variants (tour_id, label, slug, is_primary)
select
  tour.id,
  variants.label,
  variants.slug,
  variants.is_primary
from public.tour as tour
join (
  values
    ('Sellrainer Hüttenrunde', 'Alpin', 'alpin', true),
    ('Sellrainer Hüttenrunde', 'Hochalpin', 'hochalpin', false),
    ('Sellrainer Hüttenrunde', 'Hochalpin via Bielefelder Hütte', 'hochalpin-bielefelder-huette', false)
) as variants(tour_name, label, slug, is_primary)
  on tour.name = variants.tour_name;

insert into public.tour_variant_stages (tour_variant_id, stage_id, "order")
select
  variant.id,
  stage.id,
  seeded_stages.stage_order
from (
  values
    ('Sellrainer Hüttenrunde', 'alpin', 'Potsdamer Hütte', 'Alpengasthof Praxmar', 1),
    ('Sellrainer Hüttenrunde', 'alpin', 'Alpengasthof Praxmar', 'Pforzheimer Hütte', 2),
    ('Sellrainer Hüttenrunde', 'alpin', 'Pforzheimer Hütte', 'Schweinfurter Hütte', 3),
    ('Sellrainer Hüttenrunde', 'alpin', 'Schweinfurter Hütte', 'Dortmunder Hütte', 4),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Potsdamer Hütte', 'Alpengasthof Praxmar', 1),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Alpengasthof Praxmar', 'Westfalenhaus', 2),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Westfalenhaus', 'Winnebachseehütte', 3),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Winnebachseehütte', 'Pforzheimer Hütte', 4),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Pforzheimer Hütte', 'Schweinfurter Hütte', 5),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Schweinfurter Hütte', 'Dortmunder Hütte', 6),
    ('Sellrainer Hüttenrunde', 'hochalpin', 'Dortmunder Hütte', 'Peter-Anich-Hütte', 7),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Potsdamer Hütte', 'Alpengasthof Praxmar', 1),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Alpengasthof Praxmar', 'Westfalenhaus', 2),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Westfalenhaus', 'Winnebachseehütte', 3),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Winnebachseehütte', 'Pforzheimer Hütte', 4),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Pforzheimer Hütte', 'Schweinfurter Hütte', 5),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Schweinfurter Hütte', 'Bielefelder Hütte', 6),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Bielefelder Hütte', 'Dortmunder Hütte', 7),
    ('Sellrainer Hüttenrunde', 'hochalpin-bielefelder-huette', 'Dortmunder Hütte', 'Peter-Anich-Hütte', 8)
) as seeded_stages(tour_name, variant_slug, from_name, to_name, stage_order)
join public.tour as tour
  on tour.name = seeded_stages.tour_name
join public.tour_variants as variant
  on variant.tour_id = tour.id
 and variant.slug = seeded_stages.variant_slug
join public.lodges as from_lodge
  on from_lodge.name = seeded_stages.from_name
join public.lodges as to_lodge
  on to_lodge.name = seeded_stages.to_name
join public.stages as stage
  on stage.from_lodge_id = from_lodge.id
 and stage.to_lodge_id = to_lodge.id;
