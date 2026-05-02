import { cookies } from "next/headers";
import { StoreFilter } from "@/components/dashboard/StoreFilter";
import { InventoryManager } from "@/components/dashboard/InventoryManager";
import { getDashboardProducts, getDashboardStores } from "@/lib/dashboardApi";
import { dashboardApiUrl } from "@/lib/dashboardProxy";
import type {
  InventoryMetrics,
  InventoryMovement,
  SalesByDayMetric,
  TopProductMetric,
} from "@/types/inventory";
import type { Product } from "@/types/product";

async function fetchMovements(
  options: { storeId?: string } = {},
): Promise<InventoryMovement[]> {
  try {
    const token = cookies().get("seller_token")?.value;
    const params = new URLSearchParams();
    if (options.storeId) params.set("storeId", options.storeId);
    const qs = params.toString();
    const path = qs ? `/inventory/movements?${qs}` : "/inventory/movements";

    const response = await fetch(dashboardApiUrl(path), {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function fetchInventoryJson<T>(
  path: string,
  options: { storeId?: string; period?: string } = {},
  fallback: T,
): Promise<T> {
  try {
    const token = cookies().get("seller_token")?.value;
    const params = new URLSearchParams();
    if (options.storeId) params.set("storeId", options.storeId);
    if (options.period) params.set("period", options.period);

    const response = await fetch(
      dashboardApiUrl(`${path}?${params.toString()}`),
      {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    if (!response.ok) return fallback;
    return response.json();
  } catch {
    return fallback;
  }
}

const LOW_STOCK_THRESHOLD = 5;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams?: { storeId?: string };
}) {
  const selectedStoreId = searchParams?.storeId;
  const metricsPeriod = "30d";
  const fallbackMetrics: InventoryMetrics = {
    totalMovements: 0,
    totalSales: 0,
    totalRestock: 0,
    totalUnitsIn: 0,
    totalUnitsOut: 0,
    currentUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  };

  const [movements, stores, products, metrics, salesByDay, topProducts] =
    await Promise.all([
    fetchMovements({ storeId: selectedStoreId }),
    getDashboardStores({ includeInactive: true }),
    getDashboardProducts({ storeId: selectedStoreId }),
    fetchInventoryJson<InventoryMetrics>(
      "/inventory/metrics",
      { storeId: selectedStoreId, period: metricsPeriod },
      fallbackMetrics,
    ),
    fetchInventoryJson<SalesByDayMetric[]>(
      "/inventory/metrics/sales-by-day",
      { storeId: selectedStoreId, period: metricsPeriod },
      [],
    ),
    fetchInventoryJson<TopProductMetric[]>(
      "/inventory/metrics/top-products",
      { storeId: selectedStoreId, period: metricsPeriod },
      [],
    ),
  ]);

  const lowStockProducts: Product[] = products.filter(
    (p) => p.stock >= 0 && p.stock <= LOW_STOCK_THRESHOLD,
  );

  return (
    <>
      <StoreFilter
        stores={stores}
        activeStoreId={selectedStoreId}
        basePath="/dashboard/inventory"
      />
      <div className="mb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-clay">
          Control
        </p>
        <h1 className="text-2xl font-semibold text-ink">Inventario</h1>
      </div>
      <InventoryManager
        initialMovements={movements}
        products={products}
        metrics={metrics}
        salesByDay={salesByDay}
        topProducts={topProducts}
        lowStockProducts={lowStockProducts}
        selectedStoreId={selectedStoreId}
      />
    </>
  );
}
