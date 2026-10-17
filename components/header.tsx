import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { getWebUser } from "@/lib/web/session";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { secondaryButtonClass } from "./ui";

export async function Header() {
  const user = await getWebUser();

  return (
    <header className="border-b border-line bg-background">
      <div className="mx-auto flex min-h-[72px] max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link
          href={user ? "/books" : "/login"}
          aria-label="Biblioteca Aldana, ir al inicio"
          className="rounded-xl">
          <Logo />
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
