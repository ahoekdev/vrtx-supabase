insert into public.stages (from_lodge_id, to_lodge_id, duration, distance)
select from_lodge.id, to_lodge.id, stage_pairs.duration, stage_pairs.distance
from (
  values
    ('Gamshütte', 'Friesenberghaus', 330, 10500),
    ('Friesenberghaus', 'Olpererhütte', 240, 7200),
    ('Olpererhütte', 'Furtschlaglhaus', 270, 8300),
    ('Furtschlaglhaus', 'Berliner Hütte', 330, 9800),
    ('Berliner Hütte', 'Greizer Hütte', 360, 10500),
    ('Greizer Hütte', 'Kasseler Hütte', 270, 8600),
    ('Kasseler Hütte', 'Karl-von-Edel-Hütte', 390, 12000),
    ('Starkenburger Hütte', 'Franz-Senn-Hütte', 360, 9800),
    ('Franz-Senn-Hütte', 'Neue Regensburger Hütte', 240, 7200),
    ('Neue Regensburger Hütte', 'Dresdner Hütte', 390, 11500),
    ('Dresdner Hütte', 'Sulzenauhütte', 240, 6200),
    ('Sulzenauhütte', 'Nürnberger Hütte', 300, 8700),
    ('Nürnberger Hütte', 'Bremer Hütte', 270, 7900),
    ('Bremer Hütte', 'Innsbrucker Hütte', 330, 9600),
    ('Potsdamer Hütte', 'Alpengasthof Praxmar', 180, 5400),
    ('Alpengasthof Praxmar', 'Pforzheimer Hütte', 270, 8100),
    ('Alpengasthof Praxmar', 'Westfalenhaus', 240, 7000),
    ('Westfalenhaus', 'Pforzheimer Hütte', 300, 8400),
    ('Westfalenhaus', 'Winnebachseehütte', 390, 11200),
    ('Pforzheimer Hütte', 'Schweinfurter Hütte', 270, 7800),
    ('Schweinfurter Hütte', 'Dortmunder Hütte', 330, 9300),
    ('Winnebachseehütte', 'Pforzheimer Hütte', 360, 10000),
    ('Dortmunder Hütte', 'Peter-Anich-Hütte', 300, 8500),
    ('Tuxerjochhaus', 'Friesenberghaus', 240, 8400),
    ('Olpererhütte', 'Pfitscherjochhaus', 180, 8700),
    ('Pfitscherjochhaus', 'Landshuter Europahütte', 180, 8200),
    ('Landshuter Europahütte', 'Geraer Hütte', 420, 11600),
    ('Geraer Hütte', 'Tuxerjochhaus', 240, 9900),
    ('Patscherkofel Schutzhaus', 'Glungezer-Hütte', 210, 9700),
    ('Glungezer-Hütte', 'Lizumer Hütte', 450, 14800),
    ('Lizumer Hütte', 'Weidener Hütte', 295, 12300),
    ('Weidener Hütte', 'Rastkogelhütte', 330, 12500),
    ('Rastkogelhütte', 'Kellerjoch-Hütte', 320, 13800)
) as stage_pairs(from_name, to_name, duration, distance)
join public.lodges as from_lodge
  on from_lodge.name = stage_pairs.from_name
join public.lodges as to_lodge
  on to_lodge.name = stage_pairs.to_name;
