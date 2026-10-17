import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Serif para titulares: da el carácter editorial de una biblioteca. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Biblioteca Aldana", template: "%s · Biblioteca Aldana" },
  description:
    "Biblioteca Aldana: consulta el catálogo, revisa la disponibilidad y solicita tus préstamos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand">
          Saltar al contenido
        </a>
        {/* La cookie de sesión es dato de petición: se lee dentro de Suspense para no bloquear el resto. */}
        <Suspense fallback={<div className="h-[72px] border-b border-line" />}>
          <Header />
        </Suspense>
        <main id="contenido" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="bg-hero text-hero-muted">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-7 text-sm">
            <span className="font-serif text-lg font-bold text-on-hero">Biblioteca Aldana</span>
            <span>Catálogo y préstamo de libros</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
