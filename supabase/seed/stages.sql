insert into public.stages (from_lodge_id, to_lodge_id)
select from_lodge.id, to_lodge.id
from (
  values
    ('Gamshütte', 'Friesenberghaus'),
    ('Friesenberghaus', 'Olpererhütte'),
    ('Olpererhütte', 'Furtschlaglhaus'),
    ('Furtschlaglhaus', 'Berliner Hütte'),
    ('Berliner Hütte', 'Greizer Hütte'),
    ('Greizer Hütte', 'Kasseler Hütte'),
    ('Kasseler Hütte', 'Karl-von-Edel-Hütte'),
    ('Starkenburger Hütte', 'Franz-Senn-Hütte'),
    ('Franz-Senn-Hütte', 'Neue Regensburger Hütte'),
    ('Neue Regensburger Hütte', 'Dresdner Hütte'),
    ('Dresdner Hütte', 'Sulzenauhütte'),
    ('Sulzenauhütte', 'Nürnberger Hütte'),
    ('Nürnberger Hütte', 'Bremer Hütte'),
    ('Bremer Hütte', 'Innsbrucker Hütte')
) as stage_pairs(from_name, to_name)
join public.lodges as from_lodge
  on from_lodge.name = stage_pairs.from_name
join public.lodges as to_lodge
  on to_lodge.name = stage_pairs.to_name;
