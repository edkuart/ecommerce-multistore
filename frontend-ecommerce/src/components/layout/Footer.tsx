"use client";

import { usePathname } from "next/navigation";
import { env } from "@/config/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const pathname = usePathname();
  const displayPhone = env.whatsappPhone.replace(
    /^(\d{3})(\d{4})(\d{4})$/,
    "+$1 $2-$3",
  );
  const whatsappUrl = buildWhatsAppUrl({
    phone: env.whatsappPhone,
    productName: "Catálogo",
    quantity: 1,
    note: "Quiero información sobre productos disponibles.",
  });

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-ink px-6 pb-10 pt-20 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand col */}
          <div>
            <p className="mb-4 font-serif text-[36px] leading-none text-paper">
              <em className="not-italic">E</em>commerce
            </p>
            <p className="mb-6 max-w-[320px] text-[14px] leading-[1.6] text-paper/65">
              Cuatro mini-tiendas familiares en Guatemala. Curamos lo que
              vendemos y respondemos uno por uno.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 rounded bg-whats px-5 text-[13.5px] font-medium text-white transition duration-180 ease-commerce hover:bg-whats-deep"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 0a8 8 0 0 1 6.93 12.02L16 16l-4.11-1.05A8 8 0 1 1 8 0Zm0 1.6A6.4 6.4 0 1 0 12.3 12l-.23-.38.75-1.94-2.06.53-.4-.22A6.38 6.38 0 0 0 8 1.6ZM5.6 4.8h.6c.22 0 .45.16.53.37l.74 1.87c.09.22.03.48-.16.65l-.43.42c.4.8 1.15 1.54 1.95 1.95l.42-.43c.17-.19.43-.25.65-.16l1.87.74c.21.08.37.31.37.53v.6c0 .34-.28.62-.62.62A6.22 6.22 0 0 1 4.8 5.42c0-.34.28-.62.62-.62H5.6Z"/>
              </svg>
              {displayPhone}
            </a>
          </div>

          {/* Tiendas */}
          <div>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
              Tiendas
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: "#girls", label: "Ropa niñas" },
                { href: "#general", label: "Ropa general" },
                { href: "#shoes", label: "Calzado" },
                { href: "#wholesale", label: "Mayoreo" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[14px] text-paper/75 transition duration-180 ease-commerce hover:text-clay-soft"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Negocio */}
          <div>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
              Negocio
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { href: "#", label: "Cómo cotizar" },
                { href: "#", label: "Envíos a GT" },
                { href: "#", label: "Cambios y devoluciones" },
                { href: "#wholesale", label: "Mayoreo / B2B" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-[14px] text-paper/75 transition duration-180 ease-commerce hover:text-clay-soft"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visítanos */}
          <div>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
              Visítanos
            </h3>
            <div className="flex flex-col gap-4 text-[14px] leading-[1.7] text-paper/75">
              <p className="flex items-start gap-2.5">
                <svg className="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>
                  <strong className="font-medium text-paper">Ciudad de Guatemala</strong>
                  <br />
                  Zona — · Dirección pendiente
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <svg className="mt-0.5 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>
                  Lun – Sáb
                  <br />
                  9:00 – 18:00
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-paper/[0.12] pt-8 md:flex-row md:items-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-paper/50">
            © 2026 Ecommerce · Hecho en Guatemala
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-paper/50">
            Catálogo · No es checkout · Cotización por WhatsApp
          </span>
        </div>
      </div>
    </footer>
  );
}
