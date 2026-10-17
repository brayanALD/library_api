# Biblioteca Aldana

API REST y sitio web de una biblioteca universitaria: catálogo de libros, búsqueda, disponibilidad de ejemplares, solicitudes de préstamo y portadas. Está construida con **Next.js 16**, **Firebase** (Authentication y Firestore) y **TypeScript**.

Proyecto de la asignatura **Desarrollo Móvil** (Unidad 03: integración con API, seguridad y servicios del dispositivo). Es la primera parte de un sistema de dos: este repositorio ofrece la **API y la web**, y una app móvil (Expo + SQLite, aparte) consumirá esa misma API.

- **Sitio web:** https://library-api-phi.vercel.app
- **Documentación interactiva de la API (Swagger):** https://library-api-phi.vercel.app/api/docs
- **Especificación OpenAPI:** https://library-api-phi.vercel.app/api/openapi.json

## ¿Qué problema resuelve?

Una biblioteca necesita que sus usuarios consulten qué libros hay y cuántos ejemplares están libres, y que el personal controle quién se lleva cada libro. Biblioteca Aldana lo resuelve con dos roles:

| Rol | Qué puede hacer |
|---|---|
| **Estudiante** | Crear cuenta (siempre como estudiante), iniciar sesión, buscar y filtrar libros, ver el detalle, solicitar un préstamo y ver sus propias solicitudes |
| **Bibliotecario** | Iniciar sesión, ver todos los préstamos, **prestar**, **rechazar** o **registrar la devolución**, y cambiar la portada de un libro |

El flujo de un préstamo es `solicitado → prestado → devuelto`, o `solicitado → rechazado`. Solicitar un libro no reserva ejemplares: solo al prestarlo se descuenta uno, y al devolverlo se repone. El préstamo dura 14 días.

## Cómo está pensada

Tres ideas gobiernan el diseño:

1. **La app móvil nunca habla con Firebase**, solo con esta API. Las credenciales de administrador viven únicamente en el servidor.
2. **Las reglas de negocio están en un solo lugar** (`lib/domain`), así la web y la app se comportan igual.
3. **El servidor es la fuente de verdad.** Cuando el teléfono y el servidor no coinciden, gana el servidor.

La API ofrece tres garantías para que una app con trabajo sin conexión sea segura:

| Garantía | Cómo se logra |
|---|---|
| **Cambios incrementales** | `GET /api/books?updatedSince=` devuelve solo lo que cambió; `serverTime` sirve de cursor |
| **Idempotencia** | El préstamo usa como id `{uid}_{clientRequestId}`: reintentar la misma solicitud no la duplica |
| **Consistencia de ejemplares** | Las operaciones sobre préstamos y ejemplares usan transacciones de Firestore |

## Tecnologías

Next.js 16 (App Router, Route Handlers, Server Actions, `cacheComponents`) · React 19 · TypeScript · Firebase Admin SDK 13 · Zod 4 · Tailwind CSS 4 · Vitest · OpenAPI 3.1 · pnpm · Vercel.

## Endpoints

Todos los errores tienen la misma forma, para que el cliente reaccione al `code` y no al texto:

```json
{ "error": { "code": "NO_COPIES", "message": "No hay ejemplares disponibles" } }
```

| Método y ruta | Quién | Qué hace |
|---|---|---|
| `GET /api/health` | Público | Comprueba que el servidor responde |
| `GET /api/openapi.json` | Público | Especificación OpenAPI (generada desde los esquemas Zod) |
| `GET /api/docs` | Público | Documentación interactiva (Swagger UI) |
| `POST /api/auth/register` | Público | Crea un estudiante y devuelve tokens |
| `POST /api/auth/login` | Público | Inicia sesión |
| `POST /api/auth/refresh` | Público | Cambia un `refreshToken` por un `idToken` nuevo |
| `GET /api/auth/me` | Autenticado | Usuario actual y su rol |
| `GET /api/books?q=&category=&updatedSince=` | Autenticado | Lista de libros con búsqueda sin tildes ni mayúsculas |
| `GET /api/books/:id` | Autenticado | Detalle de un libro |
| `GET /api/books/:id/cover` | Público | Imagen de portada |
| `PUT /api/books/:id/cover` | Bibliotecario | Sube la portada (valida los bytes reales de la imagen) |
| `GET /api/loans?status=` | Autenticado | Estudiante: los suyos. Bibliotecario: todos |
| `POST /api/loans` | Estudiante | Solicita un préstamo (idempotente) |
| `GET /api/loans/:id` | Autenticado | Un préstamo (uno ajeno responde 404, no 403) |
| `PATCH /api/loans/:id` | Bibliotecario | `approve`, `reject` o `return` |

La autenticación usa un `idToken` de Firebase en `Authorization: Bearer <idToken>`; el rol viaja como *custom claim* dentro del token.

## Sitio web

Reutiliza exactamente las mismas funciones de datos y reglas que la API, mediante Server Components y Server Actions.

| Ruta | Pantalla |
|---|---|
| `/login`, `/register` | Acceso y registro de estudiantes |
| `/books` | Catálogo con búsqueda, filtro por categoría y disponibilidad |
| `/books/[id]` | Detalle del libro; solicitar préstamo (estudiante) o cambiar portada (bibliotecario) |
| `/loans` | «Mis préstamos» (estudiante) o «Gestión de préstamos» (bibliotecario) |

La sesión web usa una cookie `httpOnly`; el navegador nunca guarda tokens. La interfaz tiene tema claro y oscuro, es adaptable a móvil e incorpora la identidad visual de Biblioteca Aldana (logo, paleta burgundy y caramelo, titulares en Fraunces).

## Seguridad

- Toda entrada (cuerpo, parámetros, cabeceras) se valida con **Zod**; los errores inesperados responden 500 sin filtrar detalles internos.
- El registro público **siempre** crea estudiantes; el rol de bibliotecario solo se asigna con un script de administración.
- Mensaje único para credenciales inválidas, para no revelar si un correo existe.
- Las portadas se validan por sus **bytes reales** (JPEG, PNG o WebP), no por el tipo que declara el cliente.
- Las reglas de Firestore niegan todo acceso directo; solo el servidor accede a los datos.
- Los secretos solo están en variables de entorno y nunca se versionan.

## Cómo ejecutarlo

Requisitos: Node.js 24 (mínimo 22.5) y [pnpm](https://pnpm.io). Necesitas un proyecto de Firebase con **Authentication** (correo y contraseña) y **Firestore** habilitados.

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Copia `.env.example` a `.env` y completa los cuatro valores. Salen de la consola de Firebase: la clave de API web, y el `project_id`, `client_email` y `private_key` de una cuenta de servicio.

   ```
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_WEB_API_KEY=
   ```

   En `.env` la llave privada va entre comillas dobles y con los saltos de línea como `\n`. **En Vercel va sin comillas.**

3. Carga los libros de ejemplo y sus portadas, y crea un bibliotecario:

   ```bash
   pnpm seed
   pnpm seed-covers
   pnpm create-user -- correo@dominio.com "TuClave" "Tu Nombre" librarian
   ```

4. Arranca el servidor en http://localhost:3000:

   ```bash
   pnpm dev
   ```

### Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` / `pnpm dev:lan` | Servidor de desarrollo (el segundo acepta conexiones de la red local) |
| `pnpm build` / `pnpm start` | Compilación y servidor de producción |
| `pnpm typecheck` | Genera los tipos de rutas y revisa TypeScript |
| `pnpm test` | Pruebas unitarias con Vitest |
| `pnpm lint` | ESLint |
| `pnpm seed [-- --reset]` | Carga los 10 libros de ejemplo (`--reset` los reescribe) |
| `pnpm seed-covers` | Carga las portadas de `scripts/covers/` (procedencia en `SOURCES.md`) |
| `pnpm create-user -- <correo> <clave> "<nombre>" <librarian\|student>` | Crea o actualiza un usuario con un rol |
| `pnpm set-role -- <correo> <librarian\|student>` | Cambia el rol de un usuario existente |
| `pnpm smoke` | Prueba de extremo a extremo (41 comprobaciones) contra Firebase real; requiere el servidor en marcha |
| `pnpm reset-demo` | Borra préstamos y portadas y restaura los ejemplares. Después, vuelve a ejecutar `pnpm seed-covers` |

## Pruebas

`pnpm typecheck`, `pnpm test`, `pnpm lint` y `pnpm build` deben pasar sin errores. Hay 6 archivos de prueba con 36 pruebas: esquemas, manejo de errores, guardia de autenticación, reglas de préstamo, detección de imágenes y la especificación OpenAPI. Esta última compara las rutas documentadas con los archivos reales de `app/api`, así que falla si se añade una ruta sin documentarla.

## Estructura

```
app/
  api/                 Route Handlers de la API (auth, books, loans, docs, health)
  (auth)/ (app)/       Páginas del sitio web (acceso, catálogo, detalle, préstamos)
  actions.ts           Server Actions de la web
components/            Interfaz: logo, encabezado, tarjetas de libro, formularios
lib/
  data/                Acceso a Firestore (única capa que lo conoce)
  domain/              Reglas de negocio puras (préstamos)
  services/            Autenticación con Firebase
  web/                 Sesión del sitio web (cookie y control de acceso)
  schemas.ts openapi.ts http.ts guard.ts ...
scripts/               Administración: seed, usuarios, portadas, prueba de humo
tests/                 Pruebas con Vitest
proxy.ts               Redirección optimista a /login (la verificación real está en el servidor)
```

## Despliegue

La aplicación se despliega en **Vercel** (`vercel.json` ya está incluido). Configura en *Settings → Environment Variables* las cuatro variables de Firebase para Production, **sin comillas**, y haz un *Redeploy* si las cambias, porque Vercel no aplica variables nuevas a despliegues ya hechos.

## Datos

Cuatro colecciones de Firestore:

| Colección | Documento | Contenido |
|---|---|---|
| `books` | slug del libro | título, autor, categoría, año, descripción, ejemplares totales y disponibles, versión de portada |
| `bookCovers` | id del libro | tipo de contenido y la imagen en base64 |
| `loans` | `{uid}_{clientRequestId}` | libro, usuario, estado y fechas del préstamo |
| `users` | uid | correo, nombre, rol |

> Las portadas se guardan en base64 dentro de Firestore por simplicidad didáctica. En un proyecto real con muchas imágenes lo correcto sería Firebase Storage o un CDN. Los listados se filtran y ordenan en memoria porque el volumen es pequeño; con miles de registros habría que paginar y crear índices.
