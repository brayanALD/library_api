# Amenazas y controles (guía §4.5)

| Amenaza | Control |
|---|---|
| Secretos de administrador filtrados | Solo en variables de entorno; `*-firebase-adminsdk-*.json` y `.env*` ignorados por git |
| Escalada de privilegios al registrarse | El registro público siempre crea `student` |
| Un estudiante invoca endpoints de bibliotecario | `assertRole` en cada ruta (se prueba con 403) |
| Enumeración de correos | Mensaje único para credenciales inválidas; 404 en vez de 403 para recursos ajenos |
| Entradas maliciosas | Validación con Zod en todas las rutas |
