-- Que hay realmente en la base. Devuelve UNA sola fila, asi que ningun
-- limite de visualizacion la puede recortar.

select
  (select count(*) from categorias)          as categorias,
  (select count(*) from municipios)          as municipios,
  (select count(*) from productos)           as productos,
  (select count(*) from producto_municipios) as disponibilidad,
  (select count(*) from productos where imagen_id is null) as productos_sin_foto,
  (select count(*) from productos p
     where not exists (select 1 from producto_municipios pm
                       where pm.producto_id = p.id))       as productos_sin_municipio;

-- Lo esperado cuando este todo cargado:
--   categorias 16 · municipios 13 · productos 155
--   disponibilidad 1593 · sin_foto 2 · sin_municipio 4
