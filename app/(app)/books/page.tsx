import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookCard } from "@/components/book-card";
import { buttonClass, emptyBoxClass, inputClass } from "@/components/ui";
import { listBooks, listCategories } from "@/lib/data/books";
import { requireWebUser } from "@/lib/web/session";

export const metadata: Metadata = { title: "Catálogo" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Enlace de filtro por categoría que conserva la búsqueda actual. */
function categoryHref(category: string | undefined, q: string | undefined): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `/books?${qs}` : "/books";
}

async function BookList({ searchParams }: { searchParams: PageProps<"/books">["searchParams"] }) {
  await requireWebUser();
  const params = await searchParams;
  const q = first(params.q)?.trim().slice(0, 100) || undefined;
  const category = first(params.category)?.trim().slice(0, 60) || undefined;

  const [books, categories] = await Promise.all([listBooks({ q, category }), listCategories()]);
  const available = books.filter((b) => b.availableCopies > 0).length;

  return (
    <>
      <section className="rounded-3xl bg-hero px-6 py-10 text-on-hero md:px-10 md:py-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-caramel">
            Catálogo de libros
          </p>
          <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Encuentra tu próxima lectura
          </h1>
          <p className="text-base leading-relaxed text-hero-muted md:text-lg">
            Busca por título o autor, revisa la disponibilidad y solicita tu préstamo en un par de
            clics.
          </p>
        </div>
        <form
          role="search"
          className="mt-7 flex flex-col gap-3 rounded-2xl bg-cream p-3 sm:flex-row">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por título o autor"
            className={`${inputClass} !border-[#e8c9a4] !bg-white !text-[#2b0a10] sm:flex-[3]`}
            aria-label="Buscar"
          />
          <select
            name="category"
            defaultValue={category ?? ""}
            className={`${inputClass} !border-[#e8c9a4] !bg-white !text-[#2b0a10] sm:flex-1`}
            aria-label="Categoría">
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className={`${buttonClass} !bg-burgundy !text-cream hover:!bg-brown sm:px-8`}>
            Buscar
          </button>
        </form>
      </section>

      <nav aria-label="Filtrar por categoría" className="mt-6 flex flex-wrap gap-2">
        {[undefined, ...categories].map((c) => {
          const active = c === category;
          return (
            <Link
              key={c ?? "todas"}
              href={categoryHref(c, q)}
              aria-current={active ? "true" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-brand text-on-brand"
                  : "border border-line bg-surface text-accent hover:bg-chip"
              }`}>
              {c ?? "Todas"}
            </Link>
          );
        })}
      </nav>

      <div className="mb-5 mt-8 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-2xl font-bold text-accent">
          {category ?? "Todos los libros"}
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          {books.length} {books.length === 1 ? "libro" : "libros"} · {available} con ejemplares
          disponibles
        </p>
      </div>

      {books.length === 0 ? (
        <p className={emptyBoxClass}>No encontramos libros con esos criterios.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b) => (
            <li key={b.id}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl bg-line" />
      ))}
    </div>
  );
}

export default function BooksPage(props: PageProps<"/books">) {
  return (
    <Suspense fallback={<Skeleton />}>
      <BookList searchParams={props.searchParams} />
    </Suspense>
  );
}
