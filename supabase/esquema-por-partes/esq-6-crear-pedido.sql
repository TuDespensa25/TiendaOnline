-- Parte 6 — crear un pedido de una sola llamada.
-- Se puede volver a ejecutar sin romper nada.
--
-- Por que una funcion y no inserts sueltos desde el navegador:
--   1. Para insertar las lineas hace falta el id del pedido, y el cliente no
--      puede leerlo: RLS le deja crear pedidos pero no verlos, que es lo
--      correcto. Aqui el id no sale de la base.
--   2. Resolver el ?ref=yanet exige consultar perfiles, que esta cerrado.
--      Esta funcion lo consulta por dentro y solo devuelve el id del pedido,
--      sin exponer la tabla de vendedores a nadie.
--   3. Si algo falla a medias, no queda un pedido sin lineas.

create or replace function crear_pedido(
  p_municipio smallint,
  p_nombre    text,
  p_telefono  text,
  p_ref       text,
  p_items     jsonb   -- [{"producto_id": 2, "cantidad": 3}, ...]
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido   bigint;
  v_vendedor uuid;
  v_item     jsonb;
  v_cantidad integer;
begin
  if p_nombre is null or length(trim(p_nombre)) = 0 then
    raise exception 'Falta el nombre de quien recibe';
  end if;
  if p_telefono is null or length(trim(p_telefono)) = 0 then
    raise exception 'Falta el telefono de quien recibe';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido no tiene productos';
  end if;

  -- Si el codigo no existe o el vendedor esta inactivo, el pedido se crea
  -- igual pero sin atribuir: perder una comision es mejor que perder la venta.
  select id into v_vendedor
  from perfiles
  where codigo_ref = nullif(trim(p_ref), '') and rol = 'vendedor' and activo;

  insert into pedidos (municipio_id, nombre_recibe, telefono_recibe, vendedor_id)
  values (p_municipio, trim(p_nombre), trim(p_telefono), v_vendedor)
  returning id into v_pedido;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_cantidad := greatest(1, coalesce((v_item->>'cantidad')::integer, 1));

    -- Solo productos visibles. El precio y el nombre los pone el disparador
    -- desde el catalogo, asi que da igual lo que mande el navegador.
    insert into pedido_items (pedido_id, producto_id, cantidad)
    select v_pedido, p.id, v_cantidad
    from productos p
    where p.id = (v_item->>'producto_id')::integer and p.visible;
  end loop;

  if not exists (select 1 from pedido_items where pedido_id = v_pedido) then
    raise exception 'Ninguno de los productos del pedido esta disponible';
  end if;

  return v_pedido;
end;
$$;

grant execute on function crear_pedido(smallint, text, text, text, jsonb) to anon, authenticated;

select 'parte 6 lista' as estado;
