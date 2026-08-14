-- Estado real del esquema. Devuelve pocas filas a proposito.

-- 1) Que tablas existen y si tienen RLS activado y politicas
select
  c.relname                                          as tabla,
  c.relrowsecurity                                   as rls_activado,
  (select count(*) from pg_policies p
    where p.schemaname = 'public' and p.tablename = c.relname) as politicas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;

-- 2) Cuantas filas hay (solo de las tablas del catalogo)
select
  (select count(*) from categorias)          as categorias,
  (select count(*) from municipios)          as municipios,
  (select count(*) from productos)           as productos,
  (select count(*) from producto_municipios) as disponibilidad;

-- 3) Funciones creadas
select proname as funcion
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' order by 1;

-- Lo correcto seria:
--   8 tablas: ajustes, categorias, municipios, pedido_items, pedidos,
--             perfiles, producto_municipios, productos
--   todas con rls_activado = true y al menos 1 politica
--   3 funciones: es_admin, item_desde_catalogo, recalcular_pedido
