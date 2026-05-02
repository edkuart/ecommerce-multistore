"use client";

import { env } from "@/config/env";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { usePathname } from "next/navigation";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/product/");
  const href = buildWhatsAppUrl({
    phone: env.whatsappPhone,
    productName: "Catálogo",
    quantity: 1,
    note: "Quiero información sobre productos disponibles.",
  });

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`fixed bottom-5 right-5 z-50 h-14 w-14 items-center justify-center rounded-full bg-whats text-white shadow-[0_12px_32px_rgba(18,140,126,0.36)] transition duration-180 ease-commerce hover:scale-[1.08] hover:bg-whats-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-whats focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 ${
        isProductPage ? "hidden lg:flex" : "flex"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 0a8 8 0 0 1 6.93 12.02L16 16l-4.11-1.05A8 8 0 1 1 8 0Zm0 1.6A6.4 6.4 0 1 0 12.3 12l-.23-.38.75-1.94-2.06.53-.4-.22A6.38 6.38 0 0 0 8 1.6ZM5.6 4.8h.6c.22 0 .45.16.53.37l.74 1.87c.09.22.03.48-.16.65l-.43.42c.4.8 1.15 1.54 1.95 1.95l.42-.43c.17-.19.43-.25.65-.16l1.87.74c.21.08.37.31.37.53v.6c0 .34-.28.62-.62.62A6.22 6.22 0 0 1 4.8 5.42c0-.34.28-.62.62-.62H5.6Z"/>
      </svg>
    </a>
  );
}
