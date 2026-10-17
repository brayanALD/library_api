import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookCover } from "@/components/book-card";
import { CoverUploadForm, RequestLoanButton } from "@/components/loan-controls";
import { cardClass } from "@/components/ui";
import { getBook } from "@/lib/data/books";
import { ApiError } from "@/lib/errors";
import { requireWebUser } from "@/lib/web/session";

export const metadata: Metadata = { title: "Detalle del libro" };

const statClass = `${cardClass} px-4 py-4`;

async function BookDetail({ params }: { params: PageProps<"/books/[id]">["params"] }) {
  const user = await requireWebUser();
  const { id } = await params;

  const book = await getBook(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  return (
    <div className="flex flex-col gap-7">
      <Link
        href="/books"
        className="inline-flex w-fit items-center gap-2 text-[15px] font-medium text-accent hover:underline">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-[18px] w-[18px]">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Volver al catálogo
      </Link>

      <article className="grid gap-10 md:grid-cols-[17.5rem_1fr]">
        <BookCover
          book={book}
          className="aspect-[5/7] w-56 text-[2.25rem] shadow-[0_18px_40px_rgba(114,17,33,0.25)] md:w-full"
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <span className="w-fit rounded-full bg-caramel px-3 py-1 text-[13px] font-semibold text-burgundy">
              {book.category}
            </span>
            <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-accent md:text-5xl">
              {book.title}
            </h1>
            <p className="text-xl text-muted">{book.author}</p>
          </div>

          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className={statClass}>
              <dt className="text-muted">Año</dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-accent">{book.year}</dd>
            </div>
            <div className={statClass}>
              <dt className="text-muted">Categoría</dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-accent">{book.category}</dd>
            </div>
            <div className="rounded-2xl bg-chip px-4 py-4 text-on-chip">
              <dt>Disponibles</dt>
              <dd className="mt-1 font-serif text-2xl font-bold">
                {book.availableCopies} de {book.totalCopies}
              </dd>
            </div>
          </dl>

          <p className="max-w-[62ch] text-lg leading-relaxed">{book.description}</p>

          {user.role === "student" ? (
            <RequestLoanButton bookId={book.id} disabled={book.availableCopies <= 0} />
          ) : (
            <section className={`${cardClass} p-5`}>
              <h2 className="mb-3 font-serif text-lg font-bold text-accent">
                Administración (bibliotecario)
              </h2>
              <CoverUploadForm bookId={book.id} />
            </section>
          )}
        </div>
      </article>
    </div>
  );
}

export default function BookPage(props: PageProps<"/books/[id]">) {
  return (
    <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-line" aria-busy />}>
      <BookDetail params={props.params} />
    </Suspense>
  );
}
