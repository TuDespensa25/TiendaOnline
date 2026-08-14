begin;

insert into categorias (nombre, orden) values
  ('Aderezo y condimentos', 1),
  ('Alimentos/Cárnicos', 2),
  ('Alimentos/Del Agro', 3),
  ('Alimentos/Del Confi', 4),
  ('Alimentos/Lácteos', 5),
  ('Alimentos/Líquidos', 6),
  ('Alimentos/Otros', 7),
  ('Combos Temporales', 8),
  ('Combos Variados', 9),
  ('Combos en oferta', 10),
  ('De Electrodomésticos', 11),
  ('Del Hogar', 12),
  ('Enlatados y conservas', 13),
  ('Granos', 14),
  ('Licoreria', 15),
  ('Productos mixtos', 16);

insert into municipios (id, provincia, nombre) values
  (1, 'Artemisa', 'Bahía Honda'),
  (2, 'Artemisa', 'San Cristóbal'),
  (3, 'Artemisa', 'Candelaria'),
  (4, 'Artemisa', 'Artemisa'),
  (5, 'Artemisa', 'Alquízar'),
  (6, 'Artemisa', 'Güira de Melena'),
  (7, 'Artemisa', 'San Antonio de los Baños'),
  (8, 'Artemisa', 'Bauta'),
  (9, 'Artemisa', 'Caimito'),
  (10, 'Artemisa', 'Guanajay'),
  (11, 'Artemisa', 'Mariel'),
  (12, 'Pinar Del Río', 'Los Palacios'),
  (13, 'Pinar Del Río', 'Consolación');

commit;