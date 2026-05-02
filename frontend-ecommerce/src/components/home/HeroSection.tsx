import Link from "next/link";
import { env } from "@/config/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type HeroSectionProps = {
  productCount: number;
  storeCount: number;
};

const heroTiles = [
  {
    src: "/demo/ropa-ninas.svg",
    label: "Ropa niñas",
    className: "absolute left-0 top-0",
    style: { width: "62%", height: "64%" },
  },
  {
    src: "/demo/mayoreo.svg",
    label: "Mayoreo",
    className: "absolute right-0",
    style: { top: "6%", width: "30%", height: "26%" },
  },
  {
    src: "/demo/calzado.svg",
    label: "Calzado",
    className: "absolute bottom-0 right-0",
    style: { width: "58%", height: "56%" },
  },
];

export function HeroSection({ productCount, storeCount }: HeroSectionProps) {
  const whatsappUrl = buildWhatsAppUrl({
    phone: env.whatsappPhone,
    productName: "Catálogo",
    quantity: 1,
    note: "Quiero información sobre productos disponibles.",
  });

  return (
    <section className="relative px-6 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20 lg:px-12 lg:pb-32 lg:pt-28">
      {/* Decorative number */}
      <span
        className="pointer-events-none absolute right-0 top-12 hidden select-none font-serif text-[220px] italic leading-none text-clay opacity-[0.06] xl:block"
        aria-hidden
      >
        04
      </span>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Left — copy */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" />
            <span className="font-mono text-[11px] uppercase tracking-widest-label text-ink/55">
              Cuatro mini-tiendas · Una sola mesa
            </span>
          </div>

          <h1 className="mb-6 font-serif text-[clamp(48px,7.5vw,100px)] font-normal leading-[0.95] tracking-[-0.02em] text-ink">
            Lo que{" "}
            <em className="italic text-clay">buscás</em>,
            <br />
            curado por
            <br />
            una familia.
          </h1>

          <p className="mb-8 max-w-[480px] text-[17px] leading-[1.55] text-ink/65">
            Ropa de niñas, ropa general, calzado y mayoreo — bajo el mismo techo.
            Sin checkout impersonal: respondemos uno por uno por WhatsApp,
            confirmamos disponibilidad y cerramos el pedido como se hace en el mercado.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#catalogo"
              className="inline-flex h-[52px] items-center gap-2.5 rounded bg-ink px-6 text-[14.5px] font-medium text-paper transition duration-180 ease-commerce hover:-translate-y-px hover:bg-moss hover:shadow-[0_8px_24px_rgba(23,21,17,0.18)]"
            >
              Ver catálogo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[52px] items-center gap-2.5 rounded bg-whats px-6 text-[14.5px] font-medium text-white transition duration-180 ease-commerce hover:-translate-y-px hover:bg-whats-deep hover:shadow-[0_8px_24px_rgba(18,140,126,0.30)]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 0a8 8 0 0 1 6.93 12.02L16 16l-4.11-1.05A8 8 0 1 1 8 0Zm0 1.6A6.4 6.4 0 1 0 12.3 12l-.23-.38.75-1.94-2.06.53-.4-.22A6.38 6.38 0 0 0 8 1.6ZM5.6 4.8h.6c.22 0 .45.16.53.37l.74 1.87c.09.22.03.48-.16.65l-.43.42c.4.8 1.15 1.54 1.95 1.95l.42-.43c.17-.19.43-.25.65-.16l1.87.74c.21.08.37.31.37.53v.6c0 .34-.28.62-.62.62A6.22 6.22 0 0 1 4.8 5.42c0-.34.28-.62.62-.62H5.6Z"/>
              </svg>
              Consultar por WhatsApp
            </a>
          </div>

          {/* Meta stats */}
          <div className="mt-10 grid max-w-[480px] grid-cols-3 gap-6 border-t border-ink/10 pt-7">
            {[
              { num: String(storeCount).padStart(2, "0"), label: "Mini-tiendas" },
              { num: String(productCount).padStart(2, "0"), label: "Productos" },
              { num: "1×1", label: "Atención real" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-serif text-[32px] leading-none text-ink">{num}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image collage */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
          {heroTiles.map((tile) => (
            <div
              key={tile.label}
              className={`hero-tile overflow-hidden rounded bg-white shadow-soft ring-1 ring-ink/5 ${tile.className}`}
              style={tile.style}
            >
              <img
                src={tile.src}
                alt={tile.label}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 rounded bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55 shadow-flat">
                {tile.label}
              </div>
            </div>
          ))}

          {/* Stamp */}
          <div className="absolute bottom-[3%] left-[4%] flex items-center gap-2.5 rounded bg-paper px-4 py-3 shadow-flat ring-1 ring-ink/10">
            <span className="h-2 w-2 rounded-full bg-moss shadow-[0_0_0_4px_rgba(39,63,50,0.12)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              Stock confirmado · GT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
