/**
 * Logo de Biblioteca Aldana.
 * Isotipo: una «A» formada por dos páginas de libro que se apoyan en el vértice; el travesaño
 * es un marcapáginas (rosa langosta) y la línea inferior, un estante. Los colores son los de la
 * paleta del proyecto y no se derivan de ningún otro valor.
 */
type Tone = "light" | "onDark";

const TONES: Record<Tone, { tile: string; left: string; right: string; shelf: string }> = {
  // Sobre fondo claro: recuadro burgundy y páginas claras.
  light: { tile: "#721121", left: "#ffcf99", right: "#ffc07f", shelf: "#ffcf99" },
  // Sobre burgundy: se invierte el contraste para que el isotipo no se pierda.
  onDark: { tile: "#ffcf99", left: "#721121", right: "#a5402d", shelf: "#721121" },
};

export function LogoMark({
  tone = "light",
  className = "h-10 w-10",
}: {
  tone?: Tone;
  className?: string;
}) {
  const c = TONES[tone];
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 rounded-[25%] ${tone === "light" ? "dark:ring-1 dark:ring-apricot/40" : ""} ${className}`}>
      <rect width="64" height="64" rx="16" fill={c.tile} />
      <path d="M23 38h18v6H23z" fill="#f15156" />
      <path d="M32 11L12 52h9.5L32 29.5z" fill={c.left} />
      <path d="M32 11l20 41h-9.5L32 29.5z" fill={c.right} />
      <path d="M12 57.5h40" stroke={c.shelf} strokeWidth={2.5} strokeLinecap="round" fill="none" />
    </svg>
  );
}

const SIZES = {
  md: { mark: "h-10 w-10", small: "text-[10px]", name: "text-[22px]", gap: "gap-3" },
  lg: { mark: "h-14 w-14", small: "text-xs", name: "text-[34px]", gap: "gap-4" },
};

/** Isotipo + nombre en dos niveles. El texto es real (legible por lectores de pantalla). */
export function Logo({ tone = "light", size = "md" }: { tone?: Tone; size?: keyof typeof SIZES }) {
  const s = SIZES[size];
  const dark = tone === "onDark";
  return (
    <span className={`inline-flex items-center ${s.gap}`}>
      <LogoMark tone={tone} className={s.mark} />
      <span className="flex flex-col gap-1 leading-none">
        <span
          className={`${s.small} font-semibold uppercase tracking-[0.24em] ${
            dark ? "text-caramel" : "text-brown dark:text-caramel"
          }`}>
          Biblioteca
        </span>
        <span
          className={`font-serif ${s.name} font-bold tracking-tight ${
            dark ? "text-cream" : "text-accent"
          }`}>
          Aldana
        </span>
      </span>
    </span>
  );
}
