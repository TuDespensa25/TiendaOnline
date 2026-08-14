-- Parte 1 de 5 — perfiles, es_admin() y ajustes.
-- Se puede volver a ejecutar sin romper nada.

create table if not exists perfiles (
  id          uuid primary key references auth.users on delete cascade,
  nombre      text not null,
  rol         text not null check (rol in ('admin', 'vendedor')),
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

create table if not exists ajustes (
  clave        text primary key,
  valor        jsonb not null,
  actualizado  timestamptz not null default now()
);

-- El porcentaje de comision vive aqui, no en el codigo: lo cambia el admin.
-- Cada pedido guarda una COPIA del porcentaje del momento, asi que cambiarlo
-- nunca reescribe lo ya vendido.
insert into ajustes (clave, valor) values
  ('comision', '{"pct": 10}'),
  ('tasa_cambio', '{"cup_por_usd": 340}')
on conflict (clave) do nothing;

select 'parte 1 lista' as estado;
