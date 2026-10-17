"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Enlace de navegación que resalta la sección activa (aria-current para lectores de pantalla). */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-xl px-4 py-2.5 text-[15px] transition ${
        active
          ? "bg-chip font-semibold text-on-chip"
          : "font-medium text-accent hover:bg-chip/60"
      }`}>
      {children}
    </Link>
  );
}
