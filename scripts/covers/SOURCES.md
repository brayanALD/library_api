# Procedencia de las portadas

Imágenes obtenidas de **Open Library** (`https://covers.openlibrary.org/b/id/<id>-L.jpg`) y revisadas
una por una contra el título y el autor del catálogo. Google Books se intentó primero, pero su cuota
anónima diaria estaba agotada (HTTP 429).

Criterio: edición **en español** cuando el título del catálogo está en español. Los cuatro libros técnicos
figuran en inglés en el catálogo, así que se usa la edición original, cuyo año coincide con el del catálogo.

| Libro (slug) | Open Library `cover id` | Edición mostrada | ISBN de la ficha |
|---|---|---|---|
| `cien-anos-de-soledad` | 12931898 | Editorial Sudamericana (edición original, 1967) | 9788439720676 (la ficha lo asocia a Random House Mondadori 2007; la imagen es la de Sudamericana) |
| `don-quijote` | 7240552 | Alfaguara, RAE y ASALE (edición del IV Centenario, obra completa) | — |
| `amor-en-los-tiempos-del-colera` | 15224051 | Editorial Oveja Negra (la ficha lo asocia a Peisa 2002) | 9972402323 |
| `rayuela` | 15103307 | Alfaguara | 9789681902001 |
| `pedro-paramo` | 1053895 | Fondo de Cultura Económica, Colección Popular | 9789681605025 |
| `la-ciudad-y-los-perros` | 12518806 | Seix Barral, Literatura Contemporánea (1985) | 9788432220630 |
| `clean-code` | 15126503 | Prentice Hall (2008, edición original en inglés) | 9780132350884 |
| `introduction-to-algorithms` | 6709987 | MIT Press (1.ª edición, 1990) | 9780262031417 |
| `pragmatic-programmer` | 15136784 | Addison-Wesley (1999) | 9780201616224 |
| `dont-make-me-think` | 554640 | New Riders (2000) | 9780789723109 |

Descartadas tras revisarlas: `Cátedra Base` de *Don Quijote* (edición abreviada, «Selección») y una portada de
*Cien años de soledad* casi en blanco y otra con sello de biblioteca pública.

Las portadas pertenecen a sus editoriales y se usan aquí solo con fines académicos.
Para cargarlas en Firestore: `pnpm seed-covers`.
