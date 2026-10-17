import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { getWebUser } from "@/lib/web/session";
import { NavLink } from "./nav-link";
import { secondaryButtonClass } from "./ui";

/** Marca: libro abierto sobre fondo burgundy. */
export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-xl bg-burgundy ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffcf99"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[55%] w-[55%]">
        <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z" />
        <path d="M12 6v13.5" />
      </svg>
    </span>
  );
}

export async function Header() {
  const user = await getWebUser();

  return (
    <header className="border-b border-line bg-background">
      <div className="mx-auto flex min-h-[72px] max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link
          href={user ? "/books" : "/login"}
          className="flex items-center gap-3 text-accent">
          <BrandMark />
          <span className="font-serif text-[22px] font-bold tracking-tight">Biblioteca Aldana</span>
        </Link>
        {user && (
          <nav aria-label="Principal" className="flex flex-wrap items-center gap-2">
            <NavLink href="/books">Catálogo</NavLink>
            <NavLink href="/loans">
              {user.role === "librarian" ? "Gestión de préstamos" : "Mis préstamos"}
            </NavLink>
            <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
            <span className="hidden text-sm text-muted sm:inline">
              {user.name} · {user.role === "librarian" ? "Bibliotecario" : "Estudiante"}
            </span>
            <form action={logoutAction}>
              <button className={secondaryButtonClass}>Salir</button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
