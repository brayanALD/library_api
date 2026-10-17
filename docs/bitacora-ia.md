# Bitácora de uso de IA generativa (guía §11)

Registro de cada uso: propósito, qué se obtuvo, cómo se validó y qué se decidió. No se incluyen credenciales ni contenido del `.env`.

| Fecha | Herramienta y prompt (resumido) | Qué respondió | Cómo lo validé | Decisión |
|---|---|---|---|---|
| 2026-10-17 | Claude Code: «Analiza la guía PDF y crea CLAUDE.md y PLANNING.md» | Plan por fases (0–9), reglas de trabajo y lista de ambigüedades de la guía | Contraste con el PDF (secciones y páginas citadas); el usuario revisó el plan | Aceptado; fases autorizadas una a una |
| 2026-10-17 | Claude Code: «Crea el proyecto Next.js, instala dependencias y scripts (Fase 0)» | Proyecto con `create-next-app`, `pnpm-workspace.yaml`, dependencias y scripts de la guía | `pnpm typecheck` sin errores; revisión de `package.json` | Aceptado. El paquete `firebase` (cliente) se instaló a petición del usuario y no está en la guía |
| 2026-10-17 | Claude Code: «Implementa la Fase 1 (API REST, semana 9)» | Tipos, errores, esquemas Zod, `http.ts`, acceso a libros, rutas, `seed.mts` y pruebas, con el código de la guía | `pnpm typecheck` y `pnpm test` (2 archivos, 12 pruebas) | Aceptado |
| 2026-10-17 | Claude Code: «Implementa las Fases 2 a 4 (auth, préstamos, portadas)» | Servicio de auth, guard, rutas, reglas de préstamo, transacciones, `sniffImageType` y pruebas | `typecheck` y `test` en cada fase (3, 4 y 5 archivos; 31 pruebas); sin verificar contra Firebase real | Aceptado con reservas: falta la prueba contra Firebase real |
| 2026-10-17 | Claude Code: «Implementa el sitio web y la documentación OpenAPI (Fases 5 y 6)» | Sesión por cookie, acciones del servidor, componentes, páginas, generador OpenAPI y prueba anti-desfase | `typecheck`, `test` (6 archivos, 36 pruebas), `lint` y `build`; prueba manual de desfase con una ruta temporal | Aceptado; la prueba manual del sitio con sesión real está pendiente |
| 2026-10-17 | Claude Code: «Implementa `reset-demo` y `smoke` (Fase 7) y la config de Vercel (Fase 8)» | Scripts con 41 comprobaciones y `vercel.json` | Compilación de los `.mts` con `tsc`; `typecheck`, `test`, `lint`, `build`; revisión de git sin secretos | Aceptado; `smoke` no se ha ejecutado contra Firebase real |

Pendiente de completar por el autor: nuevos usos de IA, validaciones manuales posteriores y decisiones finales.

## Referencias (guía §12)

- Next.js. Route Handlers, Proxy y Authentication. Documentación incluida en `node_modules/next/dist/docs/`.
- Firebase. Admin SDK: verify ID tokens, custom claims, session cookies. https://firebase.google.com/docs/auth/admin
- Firebase. Auth REST API. https://firebase.google.com/docs/reference/rest/auth
- Firebase. Transactions (Firestore). https://firebase.google.com/docs/firestore/manage-data/transactions
- Zod. https://zod.dev
- OWASP. Application Security Verification Standard (ASVS) y MASVS. https://mas.owasp.org
- UNESCO (2023). Guidance for generative AI in education and research. https://unesdoc.unesco.org/ark:/48223/pf0000386693
