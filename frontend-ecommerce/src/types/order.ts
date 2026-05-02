import type { Product, ProductVariant } from "./product";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant | null;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: OrderStatus;
  items?: OrderItem[];
  createdAt?: string;
};
