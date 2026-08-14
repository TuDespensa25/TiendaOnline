begin;

-- 80 productos que se venden en toda la zona de reparto
insert into producto_municipios (producto_id, municipio_id)
select p.id, m.id from productos p cross join municipios m
where p.id in (
    4, 8, 11, 13, 14, 16, 17, 18, 19, 22, 24, 26, 28, 30, 35, 36, 37, 38,
    39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 53, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 94, 95, 96, 97, 98, 99, 100, 103, 104, 105,
    106, 108, 114, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 131,
    132, 133, 136, 150, 201, 202, 404, 30026
  );

-- 66 productos solo en los municipios 4, 5, 6, 7, 8, 9, 10, 11
insert into producto_municipios (producto_id, municipio_id)
select p.id, m.id from productos p cross join municipios m
where p.id in (
    1, 2, 3, 5, 6, 9, 10, 12, 20, 21, 25, 27, 29, 31, 32, 33, 34, 44,
    69, 70, 71, 72, 73, 74, 76, 78, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    90, 91, 92, 93, 101, 102, 109, 110, 111, 112, 113, 115, 130, 134, 135, 147, 149, 151,
    152, 401, 403, 20012, 20038, 20044, 20055, 20062, 20072, 20082, 20092, 20102
  ) and m.id in (4, 5, 6, 7, 8, 9, 10, 11);

-- 3 productos solo en los municipios 1, 2, 3, 12, 13
insert into producto_municipios (producto_id, municipio_id)
select p.id, m.id from productos p cross join municipios m
where p.id in (
    23, 75, 77
  ) and m.id in (1, 2, 3, 12, 13);

-- 2 productos solo en los municipios 4, 7, 9, 10, 11
insert into producto_municipios (producto_id, municipio_id)
select p.id, m.id from productos p cross join municipios m
where p.id in (
    153, 154
  ) and m.id in (4, 7, 9, 10, 11);

commit;

-- Si el editor anade un LIMIT automatico, que caiga en esta consulta
-- y no en los insert de arriba. Debe devolver 1593.
select count(*) as filas_de_disponibilidad from producto_municipios;