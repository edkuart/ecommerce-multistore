import type { ProductVariant } from "./product";

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: Pick<ProductVariant, "size" | "color"> | null;
};
