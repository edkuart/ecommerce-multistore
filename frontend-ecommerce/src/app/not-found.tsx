import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest-label text-clay">
        Error 404
      </p>
      <h1 className="mt-4 font-serif text-[clamp(36px,5vw,60px)] font-normal leading-[1.05] tracking-[-0.015em] text-ink">
        Página no encontrada.
      </h1>
      <p className="mt-4 max-w-sm text-[16px] leading-[1.55] text-ink/60">
        La dirección que buscás no existe o fue movida.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded bg-ink px-6 text-sm font-medium text-paper transition duration-180 ease-commerce hover:bg-moss"
        >
          Ir al catálogo
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center gap-2 rounded border border-ink/15 px-6 text-sm font-medium text-ink transition duration-180 ease-commerce hover:border-ink"
        >
          Ir al panel
        </Link>
      </div>
    </div>
  );
}
