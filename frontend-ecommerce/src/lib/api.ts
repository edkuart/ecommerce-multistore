import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { Category } from "@/types/category";
import type { Store } from "@/types/store";
import { env } from "@/config/env";

const API_URL = env.apiUrl;

function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

function sellerHeaders(): HeadersInit {
  const token = process.env.SELLER_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function resolveImageUrl(src?: string | null): string {
  if (!src) return "/placeholder-product.svg";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${API_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: env.currency,
  }).format(value);
}

type ProductQuery = {
  storeId?: string;
  category?: string;
  categoryId?: string;
  featured?: boolean;
  active?: boolean;
  search?: string;
};

function withQuery(path: string, query: ProductQuery = {}): string {
  const params = new URLSearchParams();

  if (query.category) params.set("category", query.category);
  if (query.storeId) params.set("storeId", query.storeId);
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.featured !== undefined) params.set("featured", String(query.featured));
  if (query.active !== undefined) params.set("active", String(query.active));
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  try {
    const response = await fetch(apiUrl(withQuery("/products", query)), {
      cache: "no-store",
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(apiUrl(`/products/${id}`), {
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getCategories(options: { includeInactive?: boolean } = {}): Promise<Category[]> {
  try {
    const path = options.includeInactive
      ? "/categories?includeInactive=true"
      : "/categories";
    const response = await fetch(apiUrl(path), {
      cache: "no-store",
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function getStores(
  options: { includeInactive?: boolean } = {},
): Promise<Store[]> {
  try {
    const path = options.includeInactive
      ? "/stores?includeInactive=true"
      : "/stores";
    const response = await fetch(apiUrl(path), {
      cache: "no-store",
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(apiUrl("/orders"), {
      cache: "no-store",
      headers: sellerHeaders(),
    });

    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const response = await fetch(apiUrl(`/orders/${id}`), {
      cache: "no-store",
      headers: sellerHeaders(),
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function createProduct(input: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
}): Promise<Product> {
  const response = await fetch(apiUrl("/products"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...sellerHeaders(),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Could not create product");
  }

  return response.json();
}
