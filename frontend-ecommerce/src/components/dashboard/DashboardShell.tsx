"use client";

import Link from "next/link";
import {
  BarChart3,
  Boxes,
  FolderTree,
  Home,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Package,
  ReceiptText,
  Store,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Resumen", exact: true, icon: Home },
  { href: "/dashboard/stores", label: "Tiendas", icon: Store },
  { href: "/dashboard/products", label: "Productos", icon: Package },
  { href: "/dashboard/inventory", label: "Inventario", icon: Boxes },
  { href: "/dashboard/categories", label: "Categorías", icon: FolderTree },
  { href: "/dashboard/leads", label: "Leads", icon: MessageCircle },
  { href: "/dashboard/orders", label: "Pedidos", icon: ReceiptText },
];

const primaryMobileLinks = links.filter((link) =>
  ["/dashboard", "/dashboard/products", "/dashboard/inventory", "/dashboard/leads"].includes(
    link.href,
  ),
);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/dashboard/auth/logout", { method: "POST" });
    } finally {
      router.push("/dashboard/login");
    }
  }

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-8">
      <aside className="hidden rounded-md border border-ink/10 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:block lg:self-start">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
          Panel de venta
        </p>

        <nav className="flex gap-1 overflow-x-auto lg:grid lg:overflow-visible">
          {links.map((link) => {
            const Icon = link.icon;
            return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-linen hover:text-ink ${
                isActive(link.href, link.exact)
                  ? "bg-linen text-ink"
                  : "text-ink/60"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {link.label}
            </Link>
          )})}
        </nav>

        {/* Logout */}
        <div className="mt-4 border-t border-ink/8 pt-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-ink/50 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {loggingOut ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <section className="min-w-0">{children}</section>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(23,21,17,0.08)] backdrop-blur lg:hidden"
        aria-label="Navegación principal del panel"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {primaryMobileLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold transition ${
                  active ? "bg-linen text-ink" : "text-ink/55"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="max-w-full truncate">{link.label}</span>
              </Link>
            );
          })}

          <Link
            href="/dashboard/stores"
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold transition ${
              pathname.startsWith("/dashboard/stores") ||
              pathname.startsWith("/dashboard/categories") ||
              pathname.startsWith("/dashboard/orders")
                ? "bg-linen text-ink"
                : "text-ink/55"
            }`}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden />
            <span>Más</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
