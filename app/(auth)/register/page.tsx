import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { getWebUser } from "@/lib/web/session";

export const metadata: Metadata = { title: "Crear cuenta" };

async function RedirectIfSignedIn() {
  if (await getWebUser()) redirect("/books");
  return null;
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-7">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-accent">Crear cuenta</h1>
        <p className="text-base text-muted">Regístrate como estudiante para solicitar préstamos.</p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
