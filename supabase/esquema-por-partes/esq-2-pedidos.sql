-- Parte 2 de 5 — pedidos y sus lineas.
-- El catalogo (categorias, municipios, productos, producto_municipios) ya
-- existe, asi que no se repite aqui.
-- Se puede volver a ejecutar sin romper nada.

create table if not exists pedidos (
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

create table if not exists pedido_items (
  id           bigint primary key generated always as identity,
  pedido_id    bigint  not null references pedidos on delete cascade,
  producto_id  integer references productos on delete set null,
  -- Copia del nombre y del precio ya con descuento, para que cambiar el
  -- catalogo no reescriba pedidos viejos.
  nombre       text not null default '',
  precio_usd   numeric(10,2) not null default 0,
  cantidad     integer not null check (cantidad > 0)
);

create index if not exists pedidos_vendedor_idx   on pedidos (vendedor_id, creado desc);
create index if not exists pedidos_estado_idx     on pedidos (estado, creado desc);
create index if not exists pedido_items_pedido_idx on pedido_items (pedido_id);

select 'parte 2 lista' as estado;
