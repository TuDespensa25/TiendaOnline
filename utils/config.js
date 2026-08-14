// utils/config.js — claves publicas de TuDespensa25.
//
// Las tres son publicas por diseno y viajan en el navegador de cualquier
// visitante. No son un secreto y por eso estan en el repositorio:
//
//   - anon key de Supabase: quien protege los datos es RLS, no esta clave.
//     La clave service_role NUNCA debe aparecer aqui ni en ningun archivo
//     del repositorio: esa se salta RLS entera.
//   - cloud name y upload preset de Cloudinary: el preset va sin firma y solo
//     permite subir, nunca borrar ni sobrescribir.

window.SUPABASE_URL = "https://gvwhdhemvrcnppeqmqun.supabase.co";
window.SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2d2hkaGVtdnJjbnBwZXFtcXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzU0NzYsImV4cCI6MjEwMjMxMTQ3Nn0.AIpQkiTAuUy331FmBM5nFLZ-UJEm4I1OXa4AVQfy0ao";

window.CLOUDINARY_CLOUD_NAME = "uyvla7fj";
window.CLOUDINARY_UPLOAD_PRESET = "TuDespensa";
window.CLOUDINARY_FOLDER_PRODUCTOS = "tudespensa25/productos";
