"use client";

import Link from "next/link";
import {
  Boxes,
  ExternalLink,
  FolderTree,
  Home,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Package,
  ReceiptText,
  Store,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard", label: "Resumen", exact: true, icon: Home },
  { href: "/dashboard/stores", label: "Tiendas", icon: Store },
  { href: "/dashboard/products", label: "Productos", icon: Package },
  { href: "/dashboard/inventory", label: "Inventario", icon: Boxes },
  { href: "/dashboard/categories", label: "Categorías", icon: FolderTree },
  { href: "/dashboard/leads", label: "Leads", icon: MessageCircle },
  { href: "/dashboard/orders", label: "Pedidos", icon: ReceiptText },
];

const primaryMobileLinks = links.filter((l) =>
  ["/dashboard", "/dashboard/products", "/dashboard/inventory", "/dashboard/leads"].includes(l.href),
);

const drawerLinks = links.filter((l) =>
  ["/dashboard/stores", "/dashboard/categories", "/dashboard/orders"].includes(l.href),
);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    setDrawerOpen(false);
    try {
      await fetch("/api/dashboard/auth/logout", { method: "POST" });
    } finally {
      router.push("/dashboard/login");
    }
  }

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  const drawerActive = drawerLinks.some((l) => isActive(l.href));

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-8">
      {/* Desktop sidebar */}
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
                  isActive(link.href, link.exact) ? "bg-linen text-ink" : "text-ink/60"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

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

      {/* Mobile bottom nav */}
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

          {/* Más button */}
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold transition ${
              drawerOpen || drawerActive ? "bg-linen text-ink" : "text-ink/55"
            }`}
            aria-expanded={drawerOpen}
            aria-label="Más opciones"
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden />
            <span>Más</span>
          </button>
        </div>
      </nav>

      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-[0_-20px_60px_rgba(23,21,17,0.18)] transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
        aria-modal="true"
        role="dialog"
        aria-label="Más secciones"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-ink/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ink/8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            Panel de venta
          </p>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="rounded-md p-1.5 text-ink/40 transition hover:bg-linen hover:text-ink"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="grid gap-1 px-3 pt-3">
          {drawerLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                  active ? "bg-linen text-ink" : "text-ink/70 hover:bg-linen/60 hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Ver catálogo + Logout */}
        <div className="mt-3 border-t border-ink/8 px-3 pt-3 grid gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-ink/70 transition hover:bg-linen/60 hover:text-ink"
          >
            <ExternalLink className="h-5 w-5 shrink-0" aria-hidden />
            Ver catálogo
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-ink/50 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
