import type { Category } from "./category";
import type { Store } from "./store";

export type ProductVariant = {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  price?: number | null;
};

export type ProductStockStatus = "in_stock" | "out_of_stock" | "preorder";

export type Product = {
  id: string;
  storeId?: string | null;
  categoryId?: string | null;
  name: string;
  slug?: string;
  sku?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  stock: number;
  trackInventory?: boolean;
  stockStatus?: ProductStockStatus;
  images: string[];
  category?: string | null;
  categoryDetails?: Category | null;
  store?: Store | null;
  isActive?: boolean;
  isFeatured?: boolean;
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
};
