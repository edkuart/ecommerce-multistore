"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

export function DashboardLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      window.location.href = "/dashboard/products";
    } catch {
      setError("No se pudo iniciar sesión. Revisa el correo y contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-md border border-ink/10 bg-white p-6 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
        Acceso admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-ink">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink/60">
        Usa la cuenta admin o seller creada en el backend.
      </p>

      <div className="mt-6 grid gap-3">
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="Correo"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-md border border-ink/15 px-3"
        />
        <input
          required
          type="password"
          autoComplete="current-password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-md border border-ink/15 px-3"
        />
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-moss px-4 text-sm font-semibold text-white transition hover:bg-ink disabled:bg-ink/30"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
