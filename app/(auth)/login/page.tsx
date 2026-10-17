import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { getWebUser } from "@/lib/web/session";

export const metadata: Metadata = { title: "Iniciar sesión" };

async function RedirectIfSignedIn() {
  if (await getWebUser()) redirect("/books");
  return null;
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-7">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-accent">Iniciar sesión</h1>
        <p className="text-base text-muted">Ingresa con tu correo para continuar.</p>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
