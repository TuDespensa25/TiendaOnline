-- TuDespensa25 — esquema base
-- Pegar entero en el SQL Editor de Supabase y ejecutar una sola vez.
--
-- Dos roles: 'admin' (tu) y 'vendedor' (los referidos).
-- El dinero se calcula SIEMPRE en el servidor: el navegador puede mandar lo
-- que quiera, pero los precios, el total y la comision se recalculan aqui
-- desde las tablas. Ver los disparadores del final.

-- ---------------------------------------------------------------- perfiles

create table perfiles (
  id          uuid primary key references auth.users on delete cascade,
  nombre      text not null,
  rol         text not null check (rol in ('admin', 'vendedor')),
  -- Solo los vendedores lo tienen: es el ?ref= de su enlace.
  codigo_ref  text unique,
  activo      boolean not null default true,
  creado      timestamptz not null default now()
);

comment on column perfiles.codigo_ref is 'Codigo del enlace de referido, p.ej. tudespensa25.com/?ref=yanet';

-- security definer para poder consultar perfiles desde las politicas de
-- perfiles sin que la comprobacion se llame a si misma en bucle.
create or replace function es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from perfiles
    where id = auth.uid() and rol = 'admin' and activo
  );
$$;

-- ---------------------------------------------------------------- ajustes

create table ajustes (
  clave        text primary key,
  valor        jsonb not null,
  actualizado  timestamptz not null default now()
);

-- El porcentaje de comision vive aqui, no en el codigo: lo cambia el admin
-- desde el panel. Los pedidos guardan una COPIA del porcentaje del momento,
-- asi que cambiarlo nunca reescribe lo ya vendido.
insert into ajustes (clave, valor) values
  ('comision', '{"pct": 10}'),
  ('tasa_cambio', '{"cup_por_usd": 340}');

-- ---------------------------------------------------------- catalogo

create table categorias (
  id      smallint primary key generated always as identity,
  nombre  text not null unique,
  orden   smallint not null default 0,
  icono   text,
  activa  boolean not null default true
);

create table municipios (
  -- Se conservan los ids que ya usaba app.js para no reescribir los productos.
  id         smallint primary key,
  provincia  text not null,
  nombre     text not null,
  activo     boolean not null default true,
  unique (provincia, nombre)
);

create table productos (
  id             integer primary key,
  nombre         text not null,
  descripcion    text,
  categoria_id   smallint not null references categorias on delete restrict,
  precio_usd     numeric(10,2) not null check (precio_usd >= 0),
  descuento_pct  numeric(5,2) not null default 0 check (descuento_pct between 0 and 100),
  -- Para las ofertas con cuenta atras (el antiguo tiempoLimite).
  oferta_hasta   timestamptz,
  -- public_id de Cloudinary, sin la URL: la URL se arma en utils/imagenes.js.
  imagen_id      text,
  reciente       boolean not null default false,
  visible        boolean not null default true,
  creado         timestamptz not null default now()
);

comment on column productos.imagen_id is 'public_id de Cloudinary, p.ej. tudespensa25/productos/pollocaja';

-- Un producto solo se vende en ciertos municipios. Sin fila aqui, el producto
-- no le aparece a nadie que haya elegido su municipio.
create table producto_municipios (
  producto_id   integer  not null references productos  on delete cascade,
  municipio_id  smallint not null references municipios on delete cascade,
  primary key (producto_id, municipio_id)
);

create index on productos (categoria_id) where visible;
create index on producto_municipios (municipio_id);

-- ---------------------------------------------------------------- pedidos

create table pedidos (
  id                bigint primary key generated always as identity,
  creado            timestamptz not null default now(),
  municipio_id      smallint references municipios on delete set null,
  nombre_recibe     text not null,
  telefono_recibe   text not null,
  -- Quien lo refirio. Nulo si el cliente llego por su cuenta.
  vendedor_id       uuid references perfiles on delete set null,
  total_usd         numeric(10,2) not null default 0,
  -- Copias del momento del pedido. No son un join a proposito.
  comision_pct      numeric(5,2)  not null default 0,
  comision_usd      numeric(10,2) not null default 0,
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente', 'en_camino', 'entregado', 'cancelado')),
  nota              text
);

create table pedido_items (
  id           bigint primary key generated always as identity,
  pedido_id    bigint  not null references pedidos on delete cascade,
  producto_id  integer references productos on delete set null,
  -- Copia del nombre y del precio ya con descuento aplicado, para que
  -- cambiar el catalogo no reescriba pedidos viejos.
  nombre       text not null default '',
  precio_usd   numeric(10,2) not null default 0,
  cantidad     integer not null check (cantidad > 0)
);

create index on pedidos (vendedor_id, creado desc);
create index on pedidos (estado, creado desc);
create index on pedido_items (pedido_id);

-- --------------------------------------------- el dinero, calculado aqui

-- Toma el nombre y el precio del catalogo e ignora lo que mande el navegador.
-- Sin esto, cualquiera podria insertar un pedido con el precio que quisiera.
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

create trigger pedido_items_precio
  before insert or update on pedido_items
  for each row execute function item_desde_catalogo();

-- Recalcula el total del pedido y la comision a partir de las lineas reales.
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

create trigger pedido_items_recalcular
  after insert or update or delete on pedido_items
  for each row execute function recalcular_pedido();

-- ------------------------------------------------------------------- RLS

alter table perfiles            enable row level security;
alter table ajustes             enable row level security;
alter table categorias          enable row level security;
alter table municipios          enable row level security;
alter table productos           enable row level security;
alter table producto_municipios enable row level security;
alter table pedidos             enable row level security;
alter table pedido_items        enable row level security;

-- El catalogo lo ve cualquiera, incluso sin cuenta. Solo el admin lo toca.
create policy "catalogo visible para todos" on categorias
  for select using (activa);
create policy "solo el admin edita categorias" on categorias
  for all using (es_admin()) with check (es_admin());

create policy "municipios visibles para todos" on municipios
  for select using (activo);
create policy "solo el admin edita municipios" on municipios
  for all using (es_admin()) with check (es_admin());

create policy "productos visibles para todos" on productos
  for select using (visible);
create policy "solo el admin edita productos" on productos
  for all using (es_admin()) with check (es_admin());

create policy "disponibilidad visible para todos" on producto_municipios
  for select using (true);
create policy "solo el admin edita disponibilidad" on producto_municipios
  for all using (es_admin()) with check (es_admin());

-- Cada uno ve su perfil; el admin los ve todos.
create policy "ver mi perfil" on perfiles
  for select using (id = auth.uid() or es_admin());
create policy "solo el admin gestiona perfiles" on perfiles
  for all using (es_admin()) with check (es_admin());

-- Los ajustes los lee quien tenga cuenta (el vendedor necesita ver su %).
create policy "ajustes para quien tenga cuenta" on ajustes
  for select to authenticated using (true);
create policy "solo el admin cambia ajustes" on ajustes
  for all using (es_admin()) with check (es_admin());

-- Un cliente sin cuenta CREA su pedido, pero no puede leer ninguno.
-- Es lo que permite comprar sin registrarse sin exponer los datos de nadie.
create policy "cualquiera crea un pedido" on pedidos
  for insert to anon, authenticated with check (true);
create policy "el admin ve todo, el vendedor lo suyo" on pedidos
  for select to authenticated
  using (es_admin() or vendedor_id = auth.uid());
create policy "solo el admin cambia pedidos" on pedidos
  for update to authenticated
  using (es_admin()) with check (es_admin());

create policy "cualquiera anade lineas a su pedido" on pedido_items
  for insert to anon, authenticated with check (true);
create policy "las lineas se ven con el pedido" on pedido_items
  for select to authenticated using (
    exists (
      select 1 from pedidos p
      where p.id = pedido_items.pedido_id
        and (es_admin() or p.vendedor_id = auth.uid())
    )
  );
