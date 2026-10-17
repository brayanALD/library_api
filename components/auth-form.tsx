"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/app/actions";
import { Alert, buttonClass, inputClass } from "./ui";

const initial: FormState = {};
const labelClass = "flex flex-col gap-1.5 text-[15px] font-semibold text-foreground";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState(
    mode === "login" ? loginAction : registerAction,
    initial,
  );
  const isLogin = mode === "login";

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Alert kind="error">{state.error}</Alert>}
      {!isLogin && (
        <label className={labelClass}>
          Nombre
          <input
            name="displayName"
            required
            minLength={2}
            autoComplete="name"
            className={inputClass}
          />
        </label>
      )}
      <label className={labelClass}>
        Correo
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Contraseña
        <input
          name="password"
          type="password"
          required
          minLength={isLogin ? 1 : 6}
          autoComplete={isLogin ? "current-password" : "new-password"}
          className={inputClass}
        />
      </label>
      <button type="submit" disabled={pending} className={`${buttonClass} h-[54px] text-[17px]`}>
        {pending ? "Procesando…" : isLogin ? "Iniciar sesión" : "Crear cuenta de estudiante"}
      </button>
      <p className="text-center text-[15px] text-muted">
        {isLogin ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-accent underline">
              Regístrate
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-accent underline">
              Inicia sesión
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
