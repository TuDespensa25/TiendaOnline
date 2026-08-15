-- Prueba de extremo a extremo de crear_pedido(). Hace rollback: no deja nada.
--
-- Comprueba lo que no se puede ver desde el navegador, porque la clave
-- publica puede crear pedidos pero no leerlos.
--
-- Pedido: 1x Caja de Pollo (52.00 con 10% = 46.80)
--         3x Picadillo de pollo (2.40 con 20% = 1.92, x3 = 5.76)
-- Total esperado: 52.56

begin;

select crear_pedido(
  8::smallint,              -- Bauta
  'PRUEBA - se deshace',
  '+53 50000000',
  'codigo-que-no-existe',   -- vendedor inexistente: no debe romper el pedido
  '[{"producto_id": 2, "cantidad": 1}, {"producto_id": 13, "cantidad": 3}]'::jsonb
) as numero_de_pedido;

select
  case when p.total_usd = 52.56
       then 'OK' else 'FALLA' end                      as total_calculado,
  case when p.vendedor_id is null and p.comision_usd = 0
       then 'OK' else 'FALLA' end                      as sin_vendedor_sin_comision,
  case when (select count(*) from pedido_items where pedido_id = p.id) = 2
       then 'OK' else 'FALLA' end                      as dos_lineas,
  case when (select bool_and(nombre <> '' and precio_usd > 0)
             from pedido_items where pedido_id = p.id)
       then 'OK' else 'FALLA' end                      as nombre_y_precio_del_catalogo,
  case when p.estado = 'pendiente'
       then 'OK' else 'FALLA' end                      as estado_inicial,
  p.total_usd,
  p.comision_usd
from pedidos p
where p.id = (select max(id) from pedidos);

-- Detalle de las lineas, para verlo con los ojos
select i.nombre, i.precio_usd, i.cantidad,
       round(i.precio_usd * i.cantidad, 2) as subtotal
from pedido_items i
where i.pedido_id = (select max(id) from pedidos)
order by i.id;

rollback;
