"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest-label text-clay">
        Error del servidor
      </p>
      <h1 className="mt-4 font-serif text-[clamp(32px,4vw,52px)] font-normal leading-[1.05] tracking-[-0.015em] text-ink">
        Algo salió mal.
      </h1>
      <p className="mt-4 max-w-sm text-[16px] leading-[1.55] text-ink/60">
        Ocurrió un error inesperado. Podés intentarlo de nuevo o volver al catálogo.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-ink/30">
          ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex h-12 items-center gap-2 rounded bg-ink px-6 text-sm font-medium text-paper transition duration-180 ease-commerce hover:bg-moss"
        >
          Intentar de nuevo
        </button>
        <a
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded border border-ink/15 px-6 text-sm font-medium text-ink transition duration-180 ease-commerce hover:border-ink"
        >
          Volver al catálogo
        </a>
      </div>
    </div>
  );
}
