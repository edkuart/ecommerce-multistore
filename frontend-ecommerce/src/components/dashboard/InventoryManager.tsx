"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  InventoryMetrics,
  InventoryMovement,
  MovementType,
  SalesByDayMetric,
  TopProductMetric,
} from "@/types/inventory";
import type { Product } from "@/types/product";

// ─── Constantes ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<MovementType, string> = {
  CREATION:   "Alta inicial",
  RESTOCK:    "Entrada",
  SALE:       "Venta",
  ADJUSTMENT: "Ajuste",
  RETURN:     "Devolución",
  DAMAGE:     "Daño",
};

const TYPE_STYLES: Record<MovementType, string> = {
  CREATION:   "bg-indigo/10 text-indigo",
  RESTOCK:    "bg-moss/10 text-moss",
  SALE:       "bg-clay/10 text-clay",
  ADJUSTMENT: "bg-amber-50 text-amber-700",
  RETURN:     "bg-emerald-50 text-emerald-700",
  DAMAGE:     "bg-red-50 text-red-700",
};

type FilterGroup = "all" | "in" | "sale" | "adjustment" | "damage";
type Period = "week" | "month" | "all";

const FILTER_GROUPS: { value: FilterGroup; label: string; types?: MovementType[] }[] = [
  { value: "all",        label: "Todos" },
  { value: "in",         label: "Entradas",  types: ["CREATION", "RESTOCK", "RETURN"] },
  { value: "sale",       label: "Ventas",    types: ["SALE"] },
  { value: "adjustment", label: "Ajustes",   types: ["ADJUSTMENT"] },
  { value: "damage",     label: "Daños",     types: ["DAMAGE"] },
];

const PERIODS: { value: Period; label: string }[] = [
  { value: "week",  label: "7 días" },
  { value: "month", label: "Este mes" },
  { value: "all",   label: "Todo" },
];

const PERIOD_LABELS: Record<Period, string> = {
  week: "7 días",
  month: "este mes",
  all: "todo",
};

// ─── Utilidades ──────────────────────────────────────────────────────────────

function getPeriodStart(period: Period): Date | null {
  if (period === "all") return null;
  const now = new Date();
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMetricDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildSalesByDay(movements: InventoryMovement[]): SalesByDayMetric[] {
  const sales = new Map<string, number>();

  for (const movement of movements) {
    if (movement.type !== "SALE") continue;
    const date = formatMetricDate(new Date(movement.createdAt));
    sales.set(date, (sales.get(date) ?? 0) + Math.abs(movement.quantity));
  }

  return Array.from(sales.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, units]) => ({ date, units }));
}

function buildTopProducts(movements: InventoryMovement[]): TopProductMetric[] {
  const products = new Map<string, TopProductMetric>();

  for (const movement of movements) {
    if (movement.type !== "SALE") continue;
    const productId = movement.productId;
    const current = products.get(productId) ?? {
      productId,
      name: movement.product?.name ?? "Producto",
      unitsSold: 0,
    };

    current.unitsSold += Math.abs(movement.quantity);
    products.set(productId, current);
  }

  return Array.from(products.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/40">
        {label}
      </p>
      <p className="mt-1.5 font-mono text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink/40">{sub}</p>}
    </div>
  );
}

function LowStockAlerts({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-amber-600"
          aria-hidden
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
        </svg>
        <p className="text-sm font-semibold text-amber-800">
          {products.length === 1
            ? "1 producto con stock bajo"
            : `${products.length} productos con stock bajo`}
        </p>
      </div>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-2 rounded-md bg-white px-3 py-2 shadow-sm"
          >
            <span className="truncate text-sm font-medium text-ink">{p.name}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-semibold ${
                p.stock === 0
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {p.stock === 0 ? "Agotado" : `${p.stock} uds.`}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-amber-700">
        Registrá una entrada desde{" "}
        <Link
          href="/dashboard/products"
          className="font-semibold underline underline-offset-2 hover:text-amber-900"
        >
          Productos
        </Link>{" "}
        para reponer el stock.
      </p>
    </div>
  );
}

function ProductInventorySnapshot({ products }: { products: Product[] }) {
  if (!products.length) return null;

  const sortedProducts = [...products].sort((a, b) => a.stock - b.stock);

  return (
    <div className="rounded-md border border-ink/10 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">Stock actual</h2>
          <p className="mt-1 text-xs text-ink/45">
            Vista operativa basada en los productos existentes.
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="rounded-md border border-moss/20 px-3 py-2 text-sm font-semibold text-moss transition hover:border-moss hover:bg-moss/5"
        >
          Ajustar stock
        </Link>
      </div>

      <div className="grid gap-2 p-3 md:hidden">
        {sortedProducts.map((product) => {
          const isLow = product.stock > 0 && product.stock <= 5;
          const isEmpty = product.stock <= 0;

          return (
            <article
              key={product.id}
              className="rounded-md border border-ink/10 bg-paper px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-ink/45">
                    {product.store?.name ?? "Sin tienda"}
                  </p>
                  {product.sku && (
                    <p className="mt-0.5 font-mono text-[11px] text-ink/35">
                      {product.sku}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-semibold text-ink">
                    {product.stock}
                  </p>
                  <p className="text-[11px] text-ink/35">uds.</p>
                </div>
              </div>
              <span
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isEmpty
                    ? "bg-red-50 text-red-600"
                    : isLow
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isEmpty ? "Agotado" : isLow ? "Bajo stock" : "Disponible"}
              </span>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
            <tr>
              <th className="px-5 py-3">Producto</th>
              <th className="px-5 py-3">Tienda</th>
              <th className="px-5 py-3 text-right">Stock</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {sortedProducts.map((product) => {
              const isLow = product.stock > 0 && product.stock <= 5;
              const isEmpty = product.stock <= 0;

              return (
                <tr key={product.id} className="transition hover:bg-linen/30">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{product.name}</p>
                    {product.sku && (
                      <p className="mt-0.5 font-mono text-xs text-ink/35">
                        {product.sku}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-ink/55">
                    {product.store?.name ?? "Sin tienda"}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-ink">
                    {product.stock}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isEmpty
                          ? "bg-red-50 text-red-600"
                          : isLow
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isEmpty ? "Agotado" : isLow ? "Bajo stock" : "Disponible"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TopProducts({
  topProducts,
  label,
}: {
  topProducts: TopProductMetric[];
  label: string;
}) {
  if (!topProducts.length) return null;

  const maxUnits = topProducts[0].unitsSold || 1;

  return (
    <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">
          Más vendidos
        </h2>
        <span className="font-mono text-xs text-ink/40">{label}</span>
      </div>

      <ul className="mt-4 grid gap-3">
        {topProducts.map((item, i) => (
          <li key={item.productId} className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 font-mono text-[11px] text-ink/35">
                  0{i + 1}
                </span>
                <span className="truncate text-sm text-ink">{item.name}</span>
              </div>
              <span className="shrink-0 font-mono text-xs font-semibold text-clay">
                {item.unitsSold} uds.
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-linen">
              <div
                className="h-full rounded-full bg-clay/60"
                style={{ width: `${Math.round((item.unitsSold / maxUnits) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SalesByDay({ data, label }: { data: SalesByDayMetric[]; label: string }) {
  if (!data.length) return null;

  const maxUnits = Math.max(...data.map((item) => item.units), 1);

  return (
    <div className="rounded-md border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Ventas por día</h2>
        <span className="font-mono text-xs text-ink/40">{label}</span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-1.5">
        {data.slice(-14).map((item) => (
          <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-sm bg-moss/70"
              style={{
                height: `${Math.max(8, Math.round((item.units / maxUnits) * 96))}px`,
              }}
              title={`${item.date}: ${item.units} uds.`}
            />
            <span className="w-full truncate text-center font-mono text-[10px] text-ink/35">
              {item.date.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Props = {
  initialMovements: InventoryMovement[];
  products: Product[];
  metrics: InventoryMetrics;
  salesByDay: SalesByDayMetric[];
  topProducts: TopProductMetric[];
  lowStockProducts?: Product[];
  selectedStoreId?: string;
};

export function InventoryManager({
  initialMovements,
  products,
  metrics: _metrics,
  salesByDay: _salesByDay,
  topProducts: _topProducts,
  lowStockProducts = [],
  selectedStoreId,
}: Props) {
  const [period, setPeriod]           = useState<Period>("month");
  const [filterGroup, setFilterGroup] = useState<FilterGroup>("all");
  const [query, setQuery] = useState("");

  const periodStart = useMemo(() => getPeriodStart(period), [period]);

  const movementsInPeriod = useMemo(() => {
    if (!periodStart) return initialMovements;
    return initialMovements.filter((m) => new Date(m.createdAt) >= periodStart);
  }, [initialMovements, periodStart]);

  const periodMetrics = useMemo(() => {
    const totalSales = movementsInPeriod
      .filter((movement) => movement.type === "SALE")
      .reduce((sum, movement) => sum + Math.abs(movement.quantity), 0);
    const totalRestock = movementsInPeriod
      .filter((movement) => ["CREATION", "RESTOCK", "RETURN"].includes(movement.type))
      .reduce((sum, movement) => sum + Math.max(movement.quantity, 0), 0);
    const currentUnits = products.reduce((sum, product) => sum + product.stock, 0);
    const lowStockCount = products.filter(
      (product) => product.stock > 0 && product.stock <= 5,
    ).length;
    const outOfStockCount = products.filter((product) => product.stock <= 0).length;

    return {
      totalMovements: movementsInPeriod.length,
      totalSales,
      totalRestock,
      currentUnits,
      lowStockCount,
      outOfStockCount,
    };
  }, [movementsInPeriod, products]);

  const periodSalesByDay = useMemo(
    () => buildSalesByDay(movementsInPeriod),
    [movementsInPeriod],
  );
  const periodTopProducts = useMemo(
    () => buildTopProducts(movementsInPeriod),
    [movementsInPeriod],
  );
  const periodLabel = PERIOD_LABELS[period];

  const filtered = useMemo(() => {
    const group = FILTER_GROUPS.find((g) => g.value === filterGroup);
    const normalizedQuery = query.trim().toLowerCase();
    const byType = group?.types
      ? movementsInPeriod.filter((m) => group.types!.includes(m.type))
      : movementsInPeriod;

    if (!normalizedQuery) return byType;

    return byType.filter((movement) => {
      const productName = movement.product?.name?.toLowerCase() ?? "";
      const note = movement.note?.toLowerCase() ?? "";
      const sku = movement.product?.sku?.toLowerCase() ?? "";

      return (
        productName.includes(normalizedQuery) ||
        note.includes(normalizedQuery) ||
        sku.includes(normalizedQuery)
      );
    });
  }, [movementsInPeriod, filterGroup, query]);

  function exportInventoryCsv() {
    const params = new URLSearchParams();
    const group = FILTER_GROUPS.find((item) => item.value === filterGroup);

    if (selectedStoreId) params.set("storeId", selectedStoreId);
    if (periodStart) params.set("from", periodStart.toISOString());
    if (group?.types?.length === 1) params.set("type", group.types[0]);

    const path = params.toString()
      ? `/api/dashboard/inventory/export?${params.toString()}`
      : "/api/dashboard/inventory/export";

    window.location.href = path;
  }

  return (
    <div className="grid gap-6">
      {/* Selector de período + tarjetas de métricas */}
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/40">
            Periodo del historial
          </p>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  period === p.value
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/10 text-ink/50 hover:border-ink/25 hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Movimientos"
            value={String(periodMetrics.totalMovements)}
            sub={periodLabel}
          />
          <SummaryCard
            label="Stock actual"
            value={String(periodMetrics.currentUnits)}
            sub="ahora"
          />
          <SummaryCard
            label="Unidades vendidas"
            value={String(periodMetrics.totalSales)}
            sub={`${periodMetrics.totalRestock} entradas`}
          />
          <SummaryCard
            label="Alertas"
            value={String(periodMetrics.lowStockCount + periodMetrics.outOfStockCount)}
            sub={`${periodMetrics.lowStockCount} bajo stock · ${periodMetrics.outOfStockCount} agotados`}
          />
        </div>
      </div>

      {/* Alertas de stock bajo */}
      <LowStockAlerts products={lowStockProducts} />

      <ProductInventorySnapshot products={products} />

      <div className="grid gap-5 lg:grid-cols-2">
        <SalesByDay data={periodSalesByDay} label={periodLabel} />
        <TopProducts topProducts={periodTopProducts} label={periodLabel} />
      </div>

      {/* Top productos + tabla en grid */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Tabla de movimientos */}
        <div className="rounded-md border border-ink/10 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {FILTER_GROUPS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setFilterGroup(g.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    filterGroup === g.value
                      ? "border-moss bg-moss text-white"
                      : "border-ink/10 text-ink/55 hover:border-moss/30 hover:text-ink"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto o nota"
                className="h-11 w-full rounded-md border border-ink/15 px-3 text-sm outline-none transition focus:border-moss sm:w-52"
              />
              <button
                type="button"
                onClick={exportInventoryCsv}
                disabled={filtered.length === 0}
                className="inline-flex items-center gap-2 rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink/60 transition hover:border-ink/30 hover:text-ink disabled:opacity-40"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="grid gap-2 p-3 md:hidden">
            {filtered.map((m) => (
              <article
                key={m.id}
                className="rounded-md border border-ink/10 bg-paper px-3 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-ink/45">
                      {formatDate(m.createdAt)}
                    </p>
                    <h3 className="mt-1 truncate text-sm font-semibold text-ink">
                      {m.product?.name ?? `${m.productId.slice(0, 8)}...`}
                    </h3>
                    {m.product?.sku && (
                      <p className="font-mono text-[11px] text-ink/35">
                        {m.product.sku}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-mono text-xl font-semibold ${
                        m.quantity > 0 ? "text-moss" : "text-clay"
                      }`}
                    >
                      {m.quantity > 0 ? `+${m.quantity}` : String(m.quantity)}
                    </p>
                    <p className="text-[11px] text-ink/35">
                      Stock {m.stockAfter}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[m.type]}`}
                  >
                    {TYPE_LABELS[m.type]}
                  </span>
                  {m.note && (
                    <span className="min-w-0 flex-1 truncate text-xs text-ink/50">
                      {m.note}
                    </span>
                  )}
                </div>
              </article>
            ))}

            {!filtered.length && (
              <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linen">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ink/40"
                    aria-hidden
                  >
                    <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v10a2 2 0 01-2 2h-4M9 17v4m0-4h6m0 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-ink/70">
                    Sin movimientos registrados.
                  </p>
                  <p className="mt-1 text-sm text-ink/45">
                    {selectedStoreId
                      ? "Registrá el primer movimiento desde Productos."
                      : "Seleccioná una tienda o registrá movimientos desde Productos."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-linen/70 text-xs uppercase tracking-[0.14em] text-ink/50">
                <tr>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Producto</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3 text-right">Cantidad</th>
                  <th className="px-5 py-3 text-right">Stock</th>
                  <th className="px-5 py-3">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {filtered.map((m) => (
                  <tr key={m.id} className="transition hover:bg-linen/30">
                    <td className="px-5 py-3.5 font-mono text-xs text-ink/55">
                      {formatDate(m.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-ink">
                      {m.product?.name ?? (
                        <span className="font-mono text-xs text-ink/40">
                          {m.productId.slice(0, 8)}&hellip;
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_STYLES[m.type]}`}
                      >
                        {TYPE_LABELS[m.type]}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-right font-mono font-semibold ${
                        m.quantity > 0 ? "text-moss" : "text-clay"
                      }`}
                    >
                      {m.quantity > 0 ? `+${m.quantity}` : String(m.quantity)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-ink/70">
                      {m.stockAfter}
                    </td>
                    <td className="px-5 py-3.5 text-ink/50">
                      {m.note ?? <span className="text-ink/25">—</span>}
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linen">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-ink/40"
                            aria-hidden
                          >
                            <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v10a2 2 0 01-2 2h-4M9 17v4m0-4h6m0 0v4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-ink/70">
                            Sin movimientos registrados.
                          </p>
                          <p className="mt-1 text-sm text-ink/45">
                            {selectedStoreId
                              ? "Registrá el primer movimiento desde Productos."
                              : "Seleccioná una tienda o registrá movimientos desde Productos."}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-md border border-ink/10 bg-white p-5 text-sm text-ink/55 shadow-sm">
          <p className="font-semibold text-ink">Lectura rápida</p>
          <p className="mt-2 leading-6">
            Las tarjetas, la gráfica y el ranking usan el mismo periodo que el
            historial. Cambiá entre 7 días, este mes o todo para revisar la operación
            sin recargar.
          </p>
        </div>
      </div>
    </div>
  );
}
