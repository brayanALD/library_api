import Link from "next/link";
import type { Book } from "@/lib/types";
import { Icon } from "./ui";

/**
 * Portadas de reemplazo con la paleta de Aldana. El color se elige a partir del título,
 * así un mismo libro siempre luce igual y el catálogo no se ve monótono.
 */
const COVERS = [
  "bg-burgundy border-brown text-apricot",
  "bg-caramel border-brown text-burgundy",
  "bg-brown border-burgundy text-cream",
  "bg-apricot border-burgundy text-burgundy",
];

function coverTone(title: string): string {
  let sum = 0;
  for (const ch of title) sum += ch.charCodeAt(0);
  return COVERS[sum % COVERS.length];
}

export function BookCover({ book, className = "" }: { book: Book; className?: string }) {
  const shape = "rounded-l-sm rounded-r-xl border-l-8 border-brown";
  if (book.coverUrl) {
    // Imagen dinámica servida por la propia API; next/image no aporta aquí.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.coverUrl}
        alt={`Portada de ${book.title}`}
        className={`object-cover ${shape} ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center font-serif font-bold ${shape} ${coverTone(book.title)} ${className}`}>
      <span className="text-[2.75em] leading-none">{book.title.charAt(0)}</span>
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  const available = book.availableCopies > 0;
  return (
    <Link
      href={`/books/${book.id}`}
      className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand hover:shadow-md">
      <BookCover book={book} className="h-36 w-24 shrink-0 text-base" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <h2 className="font-serif text-lg font-bold leading-snug text-accent">{book.title}</h2>
        <p className="text-sm text-muted">{book.author}</p>
        <p className="text-[13px] text-muted">
          {book.category} · {book.year}
        </p>
        <p
          className={`mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${
            available
              ? "bg-chip text-on-chip"
              : "border-[1.5px] border-coral bg-surface text-accent"
          }`}>
          <Icon name={available ? "check" : "x"} className="h-3.5 w-3.5" />
          {available
            ? `${book.availableCopies} de ${book.totalCopies} disponibles`
            : "Sin ejemplares"}
        </p>
      </div>
    </Link>
  );
}
