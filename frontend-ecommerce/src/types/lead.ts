import type { Product, ProductVariant } from "./product";
import type { Store } from "./store";

export type PurchaseIntentStatus =
  | "created"
  | "whatsapp_opened"
  | "contacted"
  | "converted"
  | "lost";

export type WhatsAppClick = {
  id: string;
  purchaseIntentId: string;
  productId: string;
  leadId: string;
  phoneTarget: string;
  userAgent?: string | null;
  ipHash?: string | null;
  clickedAt?: string;
};

export type PurchaseIntent = {
  id: string;
  leadId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  status: PurchaseIntentStatus;
  channel: string;
  whatsappMessage: string;
  whatsappUrl: string;
  notes?: string | null;
  product?: Product | null;
  variant?: ProductVariant | null;
  whatsappClicks?: WhatsAppClick[];
  createdAt?: string;
  updatedAt?: string;
};

export type Lead = {
  id: string;
  storeId?: string | null;
  productId?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  store?: Store | null;
  purchaseIntents?: PurchaseIntent[];
  createdAt?: string;
  updatedAt?: string;
};
