/**
 * Marco compartido de acceso y registro: panel de marca a la izquierda y formulario a la derecha.
 * En móvil el panel pasa arriba y se compacta.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-surface md:grid-cols-2">
      <section className="flex flex-col justify-between gap-10 bg-hero p-8 text-on-hero md:p-12">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-caramel">
          Biblioteca Aldana
        </span>
        <div className="flex flex-col gap-4">
          <p className="font-serif text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Cada libro, a un clic de ti.
          </p>
          <p className="max-w-sm text-base leading-relaxed text-hero-muted md:text-lg">
            Consulta el catálogo, mira qué ejemplares están disponibles y solicita tus préstamos
            desde cualquier dispositivo.
          </p>
        </div>
        <div className="flex gap-2.5" aria-hidden="true">
          <span className="h-2 w-14 rounded bg-apricot" />
          <span className="h-2 w-7 rounded bg-caramel" />
          <span className="h-2 w-3.5 rounded bg-coral" />
        </div>
      </section>
      <section className="flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </div>
  );
}
