-- Parte 8 — que los productos nuevos reciban su id solos.
--
-- Los 155 que migramos traen el id que ya tenian en app.js, asi que la
-- columna se creo sin generador. Para poder crear productos desde el panel
-- hace falta uno, empezando por encima del id mas alto que ya existe.
--
-- Se puede volver a ejecutar sin romper nada.

create sequence if not exists productos_id_seq owned by productos.id;

-- Arranca justo despues del mayor id actual. Sin esto chocaria con los
-- productos ya migrados, que llegan hasta el 30026.
select setval('productos_id_seq', coalesce((select max(id) from productos), 0) + 1, false);

alter table productos alter column id set default nextval('productos_id_seq');

-- El panel borra productos. La historia de pedidos no se pierde: pedido_items
-- guarda copia del nombre y del precio, y su producto_id queda en nulo.
-- La disponibilidad por municipio se borra sola (on delete cascade).

select
  (select max(id) from productos)              as id_mas_alto,
  (select last_value from productos_id_seq)    as proximo_id,
  'parte 8 lista'                              as estado;
