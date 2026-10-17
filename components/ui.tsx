import type { LoanStatus } from "@/lib/types";

export const inputClass =
  "w-full h-12 rounded-xl border-[1.5px] border-field-line bg-field px-3.5 text-base " +
  "text-foreground placeholder:text-muted/70 outline-none focus-visible:border-brand";

export const buttonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base " +
  "font-semibold text-on-brand transition hover:bg-brand-hover " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center rounded-xl border-[1.5px] border-accent px-5 " +
  "text-sm font-semibold text-accent transition hover:bg-chip disabled:opacity-50";

/** Recuadro de "no hay nada que mostrar" (listas vacías). */
export const emptyBoxClass =
  "rounded-2xl border border-dashed border-field-line bg-surface p-10 text-center text-muted";

/** Tarjeta base reutilizable (catálogo, préstamos, ficha). */
export const cardClass = "rounded-2xl border border-line bg-surface";

type IconName = "check" | "clock" | "x" | "undo" | "alert" | "plus";

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  check: <path d="M5 12l5 5L20 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  undo: (
    <>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10a6 6 0 010 12h-3" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
};

/** Icono decorativo (el significado siempre va también en el texto). */
export function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}>
      {ICON_PATHS[name]}
    </svg>
  );
}

const STATUS: Record<LoanStatus, { label: string; icon: IconName; className: string }> = {
  requested: { label: "Solicitado", icon: "clock", className: "bg-chip text-on-chip" },
  approved: { label: "Prestado", icon: "check", className: "bg-brand text-on-brand" },
  rejected: {
    label: "Rechazado",
    icon: "x",
    className: "border-[1.5px] border-coral bg-surface text-accent",
  },
  returned: { label: "Devuelto", icon: "undo", className: "bg-line text-foreground" },
};

export function StatusBadge({ status }: { status: LoanStatus }) {
  const { label, icon, className } = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      <Icon name={icon} />
      {label}
    </span>
  );
}

export function Alert({ kind, children }: { kind: "error" | "ok"; children: React.ReactNode }) {
  const styles =
    kind === "error"
      ? "border-[1.5px] border-coral bg-surface text-accent"
      : "bg-chip text-on-chip";
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-medium ${styles}`}>
      <Icon name={kind === "error" ? "alert" : "check"} className="h-[18px] w-[18px] shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
