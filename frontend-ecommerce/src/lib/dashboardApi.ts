import { cookies } from "next/headers";
import type { Category } from "@/types/category";
import type { Lead } from "@/types/lead";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { Store } from "@/types/store";
import { dashboardApiUrl, DASHBOARD_AUTH_COOKIE } from "@/lib/dashboardProxy";

function authHeaders(): HeadersInit {
  const token = cookies().get(DASHBOARD_AUTH_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchDashboardJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(dashboardApiUrl(path), {
      cache: "no-store",
      headers: authHeaders(),
    });

    if (!response.ok) return fallback;
    return response.json();
  } catch {
    return fallback;
  }
}

type ProductQuery = {
  storeId?: string;
  category?: string;
  categoryId?: string;
  featured?: boolean;
  active?: boolean;
};

function withQuery(path: string, query: Record<string, string | boolean | undefined> = {}): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function getDashboardProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  return fetchDashboardJson<Product[]>(withQuery("/products", query), []);
}

export async function getDashboardCategories(
  options: { includeInactive?: boolean } = {},
): Promise<Category[]> {
  return fetchDashboardJson<Category[]>(
    withQuery("/categories", {
      includeInactive: options.includeInactive,
    }),
    [],
  );
}

export async function getDashboardStores(
  options: { includeInactive?: boolean } = {},
): Promise<Store[]> {
  return fetchDashboardJson<Store[]>(
    withQuery("/stores", {
      includeInactive: options.includeInactive,
    }),
    [],
  );
}

export async function getDashboardLeads(
  options: { storeId?: string } = {},
): Promise<Lead[]> {
  return fetchDashboardJson<Lead[]>(
    withQuery("/leads", { storeId: options.storeId }),
    [],
  );
}

export async function getDashboardOrders(): Promise<Order[]> {
  return fetchDashboardJson<Order[]>("/orders", []);
}

export async function getDashboardOrder(id: string): Promise<Order | null> {
  return fetchDashboardJson<Order | null>(
    `/orders/${encodeURIComponent(id)}`,
    null,
  );
}
