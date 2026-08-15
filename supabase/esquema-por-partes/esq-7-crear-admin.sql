-- Parte 7 — convierte tu usuario en administrador.
--
-- ANTES de ejecutar esto, crea el usuario en el panel de Supabase:
--   Authentication -> Users -> Add user -> Create new user
--   Pon tu correo y una contrasena, y marca "Auto Confirm User".
--
-- Despues cambia el correo de abajo por el tuyo y ejecuta.
-- Se puede volver a ejecutar sin romper nada.

insert into perfiles (id, nombre, rol, activo)
select u.id, 'Administrador', 'admin', true
from auth.users u
where u.email = 'raudael95@gmail.com'      -- <<< CAMBIA ESTO SI USAS OTRO
on conflict (id) do update
  set rol = 'admin', activo = true;

-- Debe devolver una fila con rol = admin.
select p.nombre, p.rol, p.activo, u.email
from perfiles p
join auth.users u on u.id = p.id
where p.rol = 'admin';
