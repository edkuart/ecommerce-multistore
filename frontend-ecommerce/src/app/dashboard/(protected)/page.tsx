import Link from "next/link";
import {
  getDashboardLeads,
  getDashboardProducts,
  getDashboardStores,
} from "@/lib/dashboardApi";
import type { StoreType } from "@/types/store";

const storeTypeLabel: Record<StoreType, string> = {
  girls_clothing: "Ropa niñas",
  general_clothing: "Ropa general",
  wholesale: "Mayoreo",
  shoes: "Calzado",
  other: "Otra",
};

const storeTypeBadge: Record<StoreType, string> = {
  girls_clothing: "bg-pink-50 text-pink-700",
  general_clothing: "bg-emerald-50 text-emerald-700",
  wholesale: "bg-amber-50 text-amber-700",
  shoes: "bg-blue-50 text-blue-700",
  other: "bg-stone-100 text-ink/55",
};

export default async function DashboardPage() {
  const [products, leads, stores] = await Promise.all([
    getDashboardProducts(),
    getDashboardLeads(),
    getDashboardStores({ includeInactive: true }),
  ]);

  // --- Compute per-store stats ---
  const productsByStore = products.reduce<Record<string, number>>((acc, p) => {
    if (p.storeId) acc[p.storeId] = (acc[p.storeId] ?? 0) + 1;
    return acc;
  }, {});

  const leadsByStore = leads.reduce<Record<string, number>>((acc, l) => {
    if (l.storeId) acc[l.storeId] = (acc[l.storeId] ?? 0) + 1;
    return acc;
  }, {});

  // --- Conversion funnel ---
  const totalLeads = leads.length;
  const whatsappOpened = leads.filter((l) =>
    l.purchaseIntents?.some(
      (pi) =>
        pi.status === "whatsapp_opened" ||
        pi.status === "contacted" ||
        pi.status === "converted" ||
        (pi.whatsappClicks && pi.whatsappClicks.length > 0),
    ),
  ).length;
  const contacted = leads.filter((l) =>
    l.purchaseIntents?.some(
      (pi) => pi.status === "contacted" || pi.status === "converted",
    ),
  ).length;
  const converted = leads.filter((l) =>
    l.purchaseIntents?.some((pi) => pi.status === "converted"),
  ).length;

  const funnelSteps = [
    { label: "Leads totales", value: totalLeads, pct: 100 },
    {
      label: "Abrieron WhatsApp",
      value: whatsappOpened,
      pct: totalLeads > 0 ? Math.round((whatsappOpened / totalLeads) * 100) : 0,
    },
    {
      label: "Contactados",
      value: contacted,
      pct: totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0,
    },
    {
      label: "Convertidos",
      value: converted,
      pct: totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0,
    },
  ];

  // --- Top 5 most consulted products ---
  const productLeadCount = leads.reduce<Record<string, { name: string; count: number }>>((acc, l) => {
    const intent = l.purchaseIntents?.[0];
    const productId = intent?.productId ?? l.productId;
    const productName = intent?.product?.name ?? "Producto";
    if (productId) {
      if (!acc[productId]) acc[productId] = { name: productName, count: 0 };
      acc[productId].count += 1;
    }
    return acc;
  }, {});

  const topProducts = Object.entries(productLeadCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  const activeProducts = products.filter((p) => p.isActive !== false);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products
    .filter((product) => product.trackInventory && product.stock > 0 && product.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);
  const outOfStockCount = products.filter(
    (product) => product.trackInventory && product.stock <= 0,
  ).length;

  // --- Global summary cards ---
  const summaryCards = [
    { label: "Productos activos", value: activeProducts.length },
    { label: "Tiendas internas", value: stores.filter((s) => s.isActive).length },
    { label: "Stock total", value: totalStock },
    { label: "Leads WhatsApp", value: leads.length },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
          Resumen
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">
          Estado general de la tienda
        </h1>
        <p className="mt-1.5 text-sm text-ink/60">
          Vista rápida del catálogo, leads y actividad por mini-tienda.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/dashboard/products"
            className="inline-flex min-h-11 items-center rounded-md border border-moss/20 px-3 py-2 text-sm font-semibold text-moss transition hover:border-moss hover:bg-moss/5"
          >
            Gestionar productos
          </Link>
          <Link
            href="/dashboard/inventory"
            className="inline-flex min-h-11 items-center rounded-md border border-ink/10 px-3 py-2 text-sm font-semibold text-ink/65 transition hover:border-ink/25 hover:text-ink"
          >
            Ver inventario
          </Link>
        </div>
      </div>

      {/* Global stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-md border border-ink/10 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-ink/55">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-moss">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Operational alerts */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Alertas de inventario
              </h2>
              <p className="mt-1 text-sm text-ink/50">
                Productos que conviene revisar antes de vender más.
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {lowStockProducts.length + outOfStockCount} alertas
            </span>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products?storeId=${product.storeId ?? ""}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-ink/10 px-3 py-2 transition hover:border-moss/30 hover:bg-linen/40"
                >
                  <span className="truncate text-sm font-medium text-ink">
                    {product.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 font-mono text-xs font-semibold text-amber-700">
                    {product.stock} uds.
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              No hay productos en bajo stock en este momento.
            </p>
          )}
        </div>

        <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">
            Preparado para demo
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            El panel ya muestra tiendas, productos, leads, stock y reportes.
            Para una presentación, el flujo ideal es producto → WhatsApp → lead
            → movimiento de inventario.
          </p>
        </div>
      </div>

      {/* Per-store breakdown */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Mini-tiendas</h2>
          <Link
            href="/dashboard/stores"
            className="text-sm font-medium text-moss hover:underline"
          >
            Gestionar tiendas →
          </Link>
        </div>

        {stores.length === 0 ? (
          <div className="rounded-md border border-ink/10 bg-white px-5 py-12 text-center shadow-sm">
            <p className="text-sm text-ink/50">No hay tiendas registradas.</p>
            <Link
              href="/dashboard/stores"
              className="mt-3 inline-block text-sm font-semibold text-moss hover:underline"
            >
              Crear primera tienda →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stores.map((store) => {
              const prodCount = productsByStore[store.id] ?? 0;
              const leadCount = leadsByStore[store.id] ?? 0;
              return (
                <div
                  key={store.id}
                  className="flex flex-col gap-4 rounded-md border border-ink/10 bg-white p-5 shadow-sm"
                >
                  {/* Store name + badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">
                        {store.name}
                      </p>
                      <p className="truncate text-xs text-ink/45">
                        /{store.slug}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        store.isActive
                          ? storeTypeBadge[store.type]
                          : "bg-stone-100 text-ink/40"
                      }`}
                    >
                      {store.isActive
                        ? storeTypeLabel[store.type]
                        : "Inactiva"}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 border-t border-ink/8 pt-4">
                    <div>
                      <p className="text-xs font-medium text-ink/50">
                        Productos
                      </p>
                      <p className="mt-1 text-xl font-semibold text-ink">
                        {prodCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-ink/50">Leads</p>
                      <p className="mt-1 text-xl font-semibold text-moss">
                        {leadCount}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp indicator */}
                  {store.whatsappPhone && (
                    <p className="truncate text-xs text-ink/45">
                      WA: {store.whatsappPhone}
                    </p>
                  )}

                  {/* Quick links */}
                  <div className="flex gap-2 border-t border-ink/8 pt-3">
                    <Link
                      href={`/dashboard/products?storeId=${store.id}`}
                      className="flex-1 rounded border border-ink/10 px-2 py-1.5 text-center text-xs font-semibold text-ink/70 transition hover:border-moss/40 hover:text-moss"
                    >
                      Productos
                    </Link>
                    <Link
                      href={`/dashboard/leads?storeId=${store.id}`}
                      className="flex-1 rounded border border-ink/10 px-2 py-1.5 text-center text-xs font-semibold text-ink/70 transition hover:border-moss/40 hover:text-moss"
                    >
                      Leads
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Conversion funnel */}
      {totalLeads > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-ink">
            Embudo de conversión
          </h2>
          <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
            <p className="mb-5 text-xs text-ink/45">
              Del total de leads generados por WhatsApp, cuántos avanzaron en cada etapa.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {funnelSteps.map((step, i) => (
                <div key={step.label} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-medium text-ink/55">{step.label}</p>
                    <span className="shrink-0 font-mono text-xs text-ink/40">
                      {step.pct}%
                    </span>
                  </div>
                  <p className="font-mono text-2xl font-semibold text-moss">
                    {step.value}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-linen">
                    <div
                      className={`h-full rounded-full transition-all ${
                        i === 0
                          ? "bg-moss"
                          : i === 1
                            ? "bg-moss/70"
                            : i === 2
                              ? "bg-clay/70"
                              : "bg-clay"
                      }`}
                      style={{ width: `${step.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {converted > 0 && totalLeads > 0 && (
              <p className="mt-5 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                Tasa de conversión general:{" "}
                <span className="font-semibold">
                  {Math.round((converted / totalLeads) * 100)}%
                </span>{" "}
                ({converted} de {totalLeads} leads marcados como convertidos).
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top consulted products */}
      {topProducts.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-ink">
            Productos más consultados
          </h2>
          <div className="rounded-md border border-ink/10 bg-white shadow-sm">
            <div className="grid gap-2 p-3 md:hidden">
              {topProducts.map(([id, { name, count }], i) => (
                <article
                  key={id}
                  className="flex items-center justify-between gap-3 rounded-md border border-ink/10 bg-paper px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linen font-mono text-xs font-semibold text-ink/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="truncate text-sm font-semibold text-ink">
                      {name}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-moss/10 px-2.5 py-1 text-xs font-semibold text-moss">
                    {count} lead{count !== 1 ? "s" : ""}
                  </span>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
                  <tr>
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">Producto</th>
                    <th className="px-5 py-3 text-right">Consultas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {topProducts.map(([id, { name, count }], i) => (
                    <tr key={id}>
                      <td className="px-5 py-3 font-mono text-xs text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3 font-medium text-ink">{name}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/10 px-2.5 py-1 text-xs font-semibold text-moss">
                          {count} lead{count !== 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no data at all */}
      {topProducts.length === 0 && leads.length === 0 && (
        <div className="rounded-md border border-dashed border-ink/20 bg-white px-5 py-12 text-center shadow-sm">
          <p className="text-sm font-medium text-ink/50">
            Aún no hay leads registrados.
          </p>
          <p className="mt-1 text-xs text-ink/40">
            Cuando un cliente consulte por WhatsApp aparecerá aquí.
          </p>
        </div>
      )}
    </div>
  );
}
