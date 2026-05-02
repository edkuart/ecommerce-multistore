"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { env } from "@/config/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Header() {
  const { count } = useCart();
  const whatsappUrl = buildWhatsAppUrl({
    phone: env.whatsappPhone,
    productName: "Catálogo",
    quantity: 1,
    note: "Quiero información sobre productos disponibles.",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 md:px-8 lg:px-12">
        {/* Brand */}
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-serif text-[22px] leading-none text-ink">
            <em className="not-italic">E</em>commerce
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-clay sm:block">
            Catálogo familiar · GT
          </span>
        </Link>

        {/* Nav — hidden on mobile */}
        <nav className="hidden items-center gap-7 md:flex">
          {[
            { href: "#cats", label: "Tiendas" },
            { href: "#girls", label: "Niñas" },
            { href: "#general", label: "Ropa" },
            { href: "#shoes", label: "Calzado" },
            { href: "#wholesale", label: "Mayoreo" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[14px] text-ink/60 transition duration-180 ease-commerce hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded border border-ink/10 bg-white px-3 text-[13px] font-medium text-whats transition duration-180 ease-commerce hover:border-whats/30 hover:text-whats-deep sm:inline-flex"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0a8 8 0 0 1 6.93 12.02L16 16l-4.11-1.05A8 8 0 1 1 8 0Zm0 1.6A6.4 6.4 0 1 0 12.3 12l-.23-.38.75-1.94-2.06.53-.4-.22A6.38 6.38 0 0 0 8 1.6ZM5.6 4.8h.6c.22 0 .45.16.53.37l.74 1.87c.09.22.03.48-.16.65l-.43.42c.4.8 1.15 1.54 1.95 1.95l.42-.43c.17-.19.43-.25.65-.16l1.87.74c.21.08.37.31.37.53v.6c0 .34-.28.62-.62.62A6.22 6.22 0 0 1 4.8 5.42c0-.34.28-.62.62-.62H5.6Z"/>
            </svg>
            WhatsApp
          </a>
          <Link
            href="/dashboard"
            className="hidden min-h-11 items-center gap-2 rounded border border-ink/10 bg-white px-3 text-[13px] font-medium text-ink/65 transition duration-180 ease-commerce hover:border-ink/25 hover:text-ink md:inline-flex"
          >
            Panel
          </Link>
          {/* Cart */}
          <div className="flex min-h-11 items-center gap-2 rounded border border-ink/10 bg-white px-3 text-[13px] font-medium shadow-flat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="font-mono tabular-nums">{count}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
