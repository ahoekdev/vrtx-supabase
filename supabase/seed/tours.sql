insert into public.tour (name)
values
  ('Berliner Hohenweg'),
  ('Stubaier Hohenweg');

insert into public.tour_stages (tour_id, stage_id, "order")
select tour.id, stage.id, seeded_stages.stage_order
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
join public.lodges as from_lodge
  on from_lodge.name = seeded_stages.from_name
join public.lodges as to_lodge
  on to_lodge.name = seeded_stages.to_name
join public.stages as stage
  on stage.from_lodge_id = from_lodge.id
 and stage.to_lodge_id = to_lodge.id;
