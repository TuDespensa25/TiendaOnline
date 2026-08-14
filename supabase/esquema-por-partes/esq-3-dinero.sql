-- Parte 3 de 5 — el dinero se calcula en el servidor.
-- Sin esto, cualquiera podria insertar un pedido con el precio y la comision
-- que quisiera: el navegador manda lo que le da la gana.
-- Se puede volver a ejecutar sin romper nada.

-- Toma el nombre y el precio del catalogo e ignora lo que mande el navegador.
create or replace function item_desde_catalogo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  p record;
begin
  if new.producto_id is not null then
    select nombre, precio_usd, descuento_pct into p
    from productos where id = new.producto_id;

    if found then
      new.nombre     := p.nombre;
      new.precio_usd := round(p.precio_usd * (1 - p.descuento_pct / 100), 2);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists pedido_items_precio on pedido_items;
create trigger pedido_items_precio
  before insert or update on pedido_items
  for each row execute function item_desde_catalogo();

-- Recalcula el total y la comision a partir de las lineas reales.
create or replace function recalcular_pedido()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  id_pedido bigint := coalesce(new.pedido_id, old.pedido_id);
  suma numeric(10,2);
  pct  numeric(5,2);
begin
  select coalesce(sum(precio_usd * cantidad), 0) into suma
  from pedido_items where pedido_id = id_pedido;

  -- El porcentaje se congela en el primer calculo: si el admin lo cambia
  -- manana, este pedido conserva el que tenia.
  select case when comision_pct > 0 then comision_pct
              else (select (valor->>'pct')::numeric from ajustes where clave = 'comision')
         end
  into pct
  from pedidos where id = id_pedido;

  pct := coalesce(pct, 0);

  update pedidos set
    total_usd    = suma,
    comision_pct = case when vendedor_id is null then 0 else pct end,
    comision_usd = case when vendedor_id is null then 0
                        else round(suma * pct / 100, 2) end
  where id = id_pedido;

  return null;
end;
$$;

drop trigger if exists pedido_items_recalcular on pedido_items;
create trigger pedido_items_recalcular
  after insert or update or delete on pedido_items
  for each row execute function recalcular_pedido();

select 'parte 3 lista' as estado;
