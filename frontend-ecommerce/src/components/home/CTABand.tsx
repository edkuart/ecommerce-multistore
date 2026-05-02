import { env } from "@/config/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function CTABand() {
  const whatsappUrl = buildWhatsAppUrl({
    phone: env.whatsappPhone,
    productName: "Catálogo",
    quantity: 1,
    note: "Quiero información sobre productos disponibles.",
  });

  return (
    <section className="relative overflow-hidden bg-clay px-6 py-20 md:px-8 md:py-24 lg:px-12">
      {/* Decorative background text */}
      <span
        className="pointer-events-none absolute -bottom-10 -left-4 select-none font-serif text-[200px] italic leading-none text-paper/[0.08] md:text-[280px] lg:text-[320px]"
        aria-hidden
      >
        ¡Hola!
      </span>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 md:grid-cols-[1.4fr_auto] md:gap-14">
        <div>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-widest-label text-paper/70">
            — ¿Buscás algo específico?
          </p>
          <h2 className="max-w-[14ch] font-serif text-[clamp(36px,5.5vw,72px)] font-normal leading-[1] tracking-[-0.015em] text-paper">
            Mandanos foto, talla o referencia.{" "}
            <em
              className="italic"
              style={{
                textDecoration: "underline",
                textDecorationThickness: "2px",
                textUnderlineOffset: "8px",
                color: "#f8f3e8",
              }}
            >
              Te respondemos.
            </em>
          </h2>
        </div>

        <div className="flex min-w-[260px] flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded bg-paper px-6 text-[14.5px] font-medium text-ink transition duration-180 ease-commerce hover:bg-ink hover:text-paper"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0a8 8 0 0 1 6.93 12.02L16 16l-4.11-1.05A8 8 0 1 1 8 0Zm0 1.6A6.4 6.4 0 1 0 12.3 12l-.23-.38.75-1.94-2.06.53-.4-.22A6.38 6.38 0 0 0 8 1.6ZM5.6 4.8h.6c.22 0 .45.16.53.37l.74 1.87c.09.22.03.48-.16.65l-.43.42c.4.8 1.15 1.54 1.95 1.95l.42-.43c.17-.19.43-.25.65-.16l1.87.74c.21.08.37.31.37.53v.6c0 .34-.28.62-.62.62A6.22 6.22 0 0 1 4.8 5.42c0-.34.28-.62.62-.62H5.6Z"/>
            </svg>
            Escribir por WhatsApp
          </a>
          <a
            href="#catalogo"
            className="inline-flex h-14 items-center justify-center rounded border border-paper/40 px-6 text-[14.5px] font-medium text-paper transition duration-180 ease-commerce hover:border-paper hover:bg-paper/[0.08]"
          >
            Seguir explorando
          </a>
        </div>
      </div>
    </section>
  );
}
