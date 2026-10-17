# Bitácora de uso de IA generativa (guía §11)

Registro de cada uso: propósito, qué se obtuvo, cómo se validó y qué se decidió. No se incluyen credenciales ni contenido del `.env`.

Herramienta en todos los casos: **Claude Code** (asistente de IA generativa de Anthropic). Algunas filas citan además sus conectores (MCP de Firebase y de Vercel, y el artefacto Claude Design).

| Fecha | Herramienta y prompt (resumido) | Qué respondió | Cómo lo validé | Decisión |
|---|---|---|---|---|
| 2026-10-17 | Claude Code: «Analiza la guía PDF y crea CLAUDE.md y PLANNING.md» | Plan por fases (0–9), reglas de trabajo y lista de ambigüedades de la guía | Contraste con el PDF (secciones y páginas citadas); revisé el plan | Aceptado; fases autorizadas una a una |
| 2026-10-17 | «Crea el proyecto Next.js, instala dependencias y scripts (Fase 0)» | Proyecto con `create-next-app`, `pnpm-workspace.yaml`, dependencias y scripts de la guía | `pnpm typecheck` sin errores; revisión de `package.json` | Aceptado. El paquete `firebase` (cliente) se instaló a petición mía y no está en la guía; nada lo usa |
| 2026-10-17 | «Implementa la Fase 1 (API REST, semana 9)» | Tipos, errores, esquemas Zod, `http.ts`, acceso a libros, rutas, `seed.mts` y pruebas, con el código de la guía | `pnpm typecheck` y `pnpm test` (2 archivos, 12 pruebas) | Aceptado |
| 2026-10-17 | «Implementa las Fases 2 a 4 (auth, préstamos, portadas)» | Servicio de auth, guard, rutas, reglas de préstamo, transacciones, `sniffImageType` y pruebas | `typecheck` y `test` en cada fase (3, 4 y 5 archivos; 31 pruebas) | Aceptado; la verificación contra Firebase real se hizo después (fila de `smoke`) |
| 2026-10-17 | «Implementa el sitio web y la documentación OpenAPI (Fases 5 y 6)» | Sesión por cookie, acciones del servidor, componentes, páginas, generador OpenAPI y prueba anti-desfase | `typecheck`, `test` (6 archivos, 36 pruebas), `lint` y `build`; prueba de desfase con una ruta temporal que hizo fallar el test | Aceptado |
| 2026-10-17 | «Implementa `reset-demo` y `smoke` (Fase 7) y la config de Vercel (Fase 8)» | Scripts con 41 comprobaciones y `vercel.json` | Compilación de los `.mts` con `tsc`; `typecheck`, `test`, `lint`, `build`; revisión de git sin secretos | Aceptado |
| 2026-10-17 | «Conéctate al MCP de Firebase y crea la base de datos» | La cuenta de servicio no tenía permiso para crear la base (403). Con `firebase_init` y `firebase_deploy` del MCP se creó Firestore `(default)` en `nam5` con reglas `allow read, write: if false` | Acceso a Firestore con la cuenta de servicio; `pnpm seed` cargó los 10 libros; `pnpm smoke` pasó 41 de 41 contra Firebase real | Aceptado. Elegí la región `nam5`; el `.json` de la cuenta de servicio debe borrarse de Descargas |
| 2026-10-17 | «Revisa por qué no deja iniciar sesión con cuentas ya creadas en Vercel» | El MCP de Vercel daba 403, así que usó la CLI y los `curl` de la guía. Diagnóstico: credenciales falsas daban 401 `INVALID_CREDENTIALS` pero la cuenta real daba «Sesión inválida o expirada», es decir, las variables del Admin SDK estaban mal en Vercel. Las volvió a subir sin comillas y redesplegó | Tras el redespliegue: login de la cuenta real → 200 con rol; `/api/auth/me` y `/api/books` con el token → 200; el diagnóstico no mostró valores de secretos | Aceptado. No pude ver cuál de las tres variables estaba mal porque Vercel las oculta; probablemente `FIREBASE_PRIVATE_KEY` |
| 2026-10-17 | «¿Lo tengo subido dos veces en Vercel?» | Detectó dos proyectos (`library-api` y `library-api-q3uy`) conectados al mismo repositorio, ambos funcionando | Lista de proyectos, despliegues y variables por CLI; `curl` a ambos dominios | Decidí conservar `library-api` y borrar el duplicado desde el panel |
| 2026-10-17 | «Rediseña la web como Biblioteca Aldana con la paleta de `palette.txt` y usa Claude Design» | Propuesta visual, 4 pantallas en un lienzo de Claude Design y la implementación en el código (tokens de color, tipografía serif, encabezado, catálogo, detalle, préstamos y acceso) | `typecheck`, `test` (36), `lint` y `build`; la lógica y la API no cambiaron | Aceptado. Revisión visual en el navegador pendiente de mi parte; la interfaz ya no coincide con el código literal de la guía (decisión mía) |
| 2026-10-17 | «Diseña un logo original en Claude Design e intégralo» | Isotipo «A» con dos páginas y marcapáginas, versión para fondo claro y oscuro, componente `Logo` y favicon | `typecheck`, `lint`, `build`; el favicon se sirve en `/icon.svg` | Aceptado |
| 2026-10-17 | «Añade portadas reales en español; verifica que correspondan» | Google Books agotó su cuota (429), así que usó Open Library. Revisó cada imagen y descartó 3 (una casi en blanco, una con sello de biblioteca, una edición abreviada). Cargó 10 portadas con `pnpm seed-covers` y documentó su procedencia en `scripts/covers/SOURCES.md` | Comprobación visual de cada imagen contra el título y el autor; la API sirvió las 10 portadas idénticas (SHA-1) a las revisadas | Aceptado. Para los 4 libros técnicos se usó la edición original en inglés, porque así figura su título en el catálogo; las portadas pertenecen a sus editoriales (uso académico) |
| 2026-10-17 | «Cambia el README a español y da contexto» | `README.md` con contexto, roles, endpoints, seguridad, ejecución, scripts, estructura y despliegue | Contraste con el código y los scripts reales; no incluye credenciales | Aceptado |
| 2026-10-17 | «Valora lo construido contra el PDF» | Auditoría por secciones con un cumplimiento estimado de ~92 % y lista de pendientes | Verificación de los 58 archivos de la guía y de `typecheck`, `test`, `lint` y `build`, más pruebas de los dominios desplegados | Aceptado. Pendientes: cambiar la cuenta de prueba débil, colección Postman o Bruno y prueba manual del sitio |
| 2026-10-17 | «Desinstala el paquete firestore» | Interpretó que se trataba del paquete `firebase` (SDK de cliente), comprobó que ningún archivo lo importaba, lo desinstaló con `pnpm remove firebase` y conservó `firebase-admin`, que sí usa toda la API | Búsqueda de imports en `app`, `components`, `lib`, `scripts` y `tests`; `typecheck`, `test` (36), `lint` y `build` después del cambio | Aceptado. Resuelve la desviación de la guía anotada el mismo día (paquete instalado a petición mía y sin uso) |
| 2026-10-17 | «Crea otra cuenta de bibliotecario» (tras borrar la cuenta de prueba `text@correo.com`) | Pidió correo, nombre y contraseña, y sugirió ejecutar `pnpm create-user` yo mismo para que la contraseña no pasara por el chat. Lo ejecuté con una contraseña más sólida; el script creó la cuenta y comprobó el login y el rol `librarian` | Salida del script: «Inicio de sesión correcto. Rol en el token: librarian» | Aceptado. Cumple la guía §9.1: ya no hay una cuenta con contraseña simple. La contraseña quedó en el historial de la terminal y de la conversación; la cambiaré si comparto el entorno |

## Pendientes del autor

- Probar el sitio manualmente en el navegador con una sesión real (login, solicitar, aprobar, subir portada).
- Añadir una colección de Postman o Bruno (se puede importar desde `/api/openapi.json`) como evidencia para el docente.
- Añadir aquí cualquier otro uso de IA que haga fuera de este registro.

## Referencias (guía §12)

- Next.js. Route Handlers, Proxy y Authentication. Documentación incluida en `node_modules/next/dist/docs/`.
- Firebase. Admin SDK: verify ID tokens, custom claims, session cookies. https://firebase.google.com/docs/auth/admin
- Firebase. Auth REST API. https://firebase.google.com/docs/reference/rest/auth
- Firebase. Transactions (Firestore). https://firebase.google.com/docs/firestore/manage-data/transactions
- Zod. https://zod.dev
- OWASP. Application Security Verification Standard (ASVS) y MASVS. https://mas.owasp.org
- UNESCO (2023). Guidance for generative AI in education and research. https://unesdoc.unesco.org/ark:/48223/pf0000386693
