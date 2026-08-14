-- Pone los descuentos y el marcador 'reciente' al dia desde app.js.
-- Solo hace falta si los productos ya estaban insertados.

begin;

-- Se parte de cero para que quitar un descuento en app.js tambien lo quite aqui.
update productos set descuento_pct = 0, reciente = false;

update productos set descuento_pct = 55 where id in (50);
update productos set descuento_pct = 35 where id in (99);
update productos set descuento_pct = 31 where id in (105);
update productos set descuento_pct = 30 where id in (56);
update productos set descuento_pct = 20 where id in (13, 201, 95);
update productos set descuento_pct = 18 where id in (96);
update productos set descuento_pct = 15 where id in (114, 98, 63);
update productos set descuento_pct = 14 where id in (64);
update productos set descuento_pct = 12 where id in (103, 104, 106, 150, 68);
update productos set descuento_pct = 11 where id in (67);
update productos set descuento_pct = 10 where id in (2, 75, 9, 27, 404, 97);
update productos set descuento_pct = 7 where id in (65);
update productos set descuento_pct = 5 where id in (4, 62, 94);

update productos set reciente = true where id in (92, 93, 5, 6, 10, 12, 134, 101, 153, 154, 129, 149, 108, 127, 86, 87, 147, 89, 112, 115, 113, 33, 109, 402, 116, 117, 68, 69, 118, 119, 120, 121, 122, 123, 124, 128, 125, 126, 110, 111);

commit;

select count(*) filter (where descuento_pct > 0) as con_descuento,
       count(*) filter (where reciente) as recientes from productos;