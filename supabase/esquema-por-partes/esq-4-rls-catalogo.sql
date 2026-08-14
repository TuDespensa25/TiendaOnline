-- Parte 4 de 5 — RLS del catalogo.
-- ESTA ES LA PARTE QUE FALTABA: con RLS activado y sin politicas, la base
-- deniega todo, y por eso la tienda veia cero productos.
-- Se puede volver a ejecutar sin romper nada.

alter table perfiles            enable row level security;
alter table ajustes             enable row level security;
alter table categorias          enable row level security;
alter table municipios          enable row level security;
alter table productos           enable row level security;
alter table producto_municipios enable row level security;

-- El catalogo lo ve cualquiera, incluso sin cuenta. Solo el admin lo toca.
drop policy if exists "catalogo visible para todos" on categorias;
create policy "catalogo visible para todos" on categorias
  for select using (activa);
drop policy if exists "solo el admin edita categorias" on categorias;
create policy "solo el admin edita categorias" on categorias
  for all using (es_admin()) with check (es_admin());

drop policy if exists "municipios visibles para todos" on municipios;
create policy "municipios visibles para todos" on municipios
  for select using (activo);
drop policy if exists "solo el admin edita municipios" on municipios;
create policy "solo el admin edita municipios" on municipios
  for all using (es_admin()) with check (es_admin());

drop policy if exists "productos visibles para todos" on productos;
create policy "productos visibles para todos" on productos
  for select using (visible);
drop policy if exists "solo el admin edita productos" on productos;
create policy "solo el admin edita productos" on productos
  for all using (es_admin()) with check (es_admin());

drop policy if exists "disponibilidad visible para todos" on producto_municipios;
create policy "disponibilidad visible para todos" on producto_municipios
  for select using (true);
drop policy if exists "solo el admin edita disponibilidad" on producto_municipios;
create policy "solo el admin edita disponibilidad" on producto_municipios
  for all using (es_admin()) with check (es_admin());

-- Cada uno ve su perfil; el admin los ve todos.
drop policy if exists "ver mi perfil" on perfiles;
create policy "ver mi perfil" on perfiles
  for select using (id = auth.uid() or es_admin());
drop policy if exists "solo el admin gestiona perfiles" on perfiles;
create policy "solo el admin gestiona perfiles" on perfiles
  for all using (es_admin()) with check (es_admin());

-- Los ajustes los lee quien tenga cuenta: el vendedor necesita ver su %.
drop policy if exists "ajustes para quien tenga cuenta" on ajustes;
create policy "ajustes para quien tenga cuenta" on ajustes
  for select to authenticated using (true);
drop policy if exists "solo el admin cambia ajustes" on ajustes;
create policy "solo el admin cambia ajustes" on ajustes
  for all using (es_admin()) with check (es_admin());

select 'parte 4 lista' as estado;
