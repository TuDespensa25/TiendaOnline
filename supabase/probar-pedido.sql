-- Prueba de que el dinero se calcula en el servidor.
-- Crea un pedido falso, comprueba y DESHACE: no deja rastro en la base.
--
-- Manda a proposito datos mentirosos (precio de 1 centavo, nombre inventado,
-- total de 99999) que es justo lo que podria enviar un navegador manipulado.
-- Si los disparadores funcionan, la base los ignora y pone los de verdad.

begin;

-- Pedido con un total mentiroso
insert into pedidos (nombre_recibe, telefono_recibe, total_usd)
values ('PRUEBA - se deshace', '00000000', 99999);

-- Linea con nombre y precio mentirosos, sobre el primer producto visible
insert into pedido_items (pedido_id, producto_id, nombre, precio_usd, cantidad)
select
  (select max(id) from pedidos),
  id,
  'NOMBRE INVENTADO',
  0.01,
  3
from productos
where visible
order by id
limit 1;

-- Resultado
select
  case when i.nombre <> 'NOMBRE INVENTADO'
       then 'OK' else 'FALLA' end                        as nombre_lo_pone_la_base,
  case when i.precio_usd <> 0.01
       then 'OK' else 'FALLA' end                        as precio_lo_pone_la_base,
  case when p.total_usd = round(i.precio_usd * i.cantidad, 2)
       then 'OK' else 'FALLA' end                        as total_recalculado,
  case when p.total_usd <> 99999
       then 'OK' else 'FALLA' end                        as total_falso_ignorado,
  case when p.comision_usd = 0
       then 'OK' else 'FALLA' end                        as sin_vendedor_sin_comision,
  i.nombre                                               as nombre_real,
  i.precio_usd                                           as precio_real,
  i.cantidad,
  p.total_usd                                            as total_real
from pedidos p
join pedido_items i on i.pedido_id = p.id
where p.id = (select max(id) from pedidos);

-- Nada de esto se guarda.
rollback;
