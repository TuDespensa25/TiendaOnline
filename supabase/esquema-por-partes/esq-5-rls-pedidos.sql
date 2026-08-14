-- Parte 5 de 5 — RLS de los pedidos.
-- Un cliente sin cuenta CREA su pedido pero no puede leer ninguno: es lo que
-- permite comprar sin registrarse sin exponer los datos de nadie.
-- Se puede volver a ejecutar sin romper nada.

alter table pedidos      enable row level security;
alter table pedido_items enable row level security;

drop policy if exists "cualquiera crea un pedido" on pedidos;
create policy "cualquiera crea un pedido" on pedidos
  for insert to anon, authenticated with check (true);

drop policy if exists "el admin ve todo, el vendedor lo suyo" on pedidos;
create policy "el admin ve todo, el vendedor lo suyo" on pedidos
  for select to authenticated
  using (es_admin() or vendedor_id = auth.uid());

drop policy if exists "solo el admin cambia pedidos" on pedidos;
create policy "solo el admin cambia pedidos" on pedidos
  for update to authenticated
  using (es_admin()) with check (es_admin());

drop policy if exists "cualquiera anade lineas a su pedido" on pedido_items;
create policy "cualquiera anade lineas a su pedido" on pedido_items
  for insert to anon, authenticated with check (true);

drop policy if exists "las lineas se ven con el pedido" on pedido_items;
create policy "las lineas se ven con el pedido" on pedido_items
  for select to authenticated using (
    exists (
      select 1 from pedidos p
      where p.id = pedido_items.pedido_id
        and (es_admin() or p.vendedor_id = auth.uid())
    )
  );

select 'parte 5 lista — esquema completo' as estado;
