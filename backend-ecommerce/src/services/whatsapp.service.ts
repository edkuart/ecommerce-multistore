import crypto from "crypto";
import { env } from "../config/env";
import { Lead } from "../models/Lead";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";
import { PurchaseIntent } from "../models/PurchaseIntent";
import { Store } from "../models/Store";
import { WhatsAppClick } from "../models/WhatsAppClick";
import { sequelize } from "../config/db";

type CreateIntentInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  message?: string | null;
  source?: string | null;
  productUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
};

function cleanPhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(message)}`;
}

function formatProductPrice(product: Product, variant?: ProductVariant | null): string {
  const price = Number(variant?.price ?? product.price);
  const currency = product.currency || "GTQ";
  return `${currency} ${price.toFixed(2)}`;
}

function hashIp(ip?: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function buildMessage(input: {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  message?: string | null;
  productUrl?: string | null;
}): string {
  const lines = [
    "Hola, me interesa este producto.",
    "",
    `Producto: ${input.product.name}`,
    input.product.sku ? `SKU: ${input.product.sku}` : null,
    `Precio: ${formatProductPrice(input.product, input.variant)}`,
    input.variant?.size ? `Talla: ${input.variant.size}` : null,
    input.variant?.color ? `Color: ${input.variant.color}` : null,
    `Cantidad: ${input.quantity}`,
    input.productUrl ? `Link: ${input.productUrl}` : null,
    "",
    `Nombre: ${input.customerName}`,
    `Teléfono: ${input.customerPhone}`,
    input.customerEmail ? `Email: ${input.customerEmail}` : null,
    input.message ? `Mensaje: ${input.message}` : null,
    "",
    "¿Me pueden confirmar disponibilidad y precio final?",
  ];

  return lines.filter(Boolean).join("\n");
}

export async function createWhatsAppIntent(input: CreateIntentInput): Promise<{
  lead: Lead;
  purchaseIntent: PurchaseIntent;
  whatsappUrl: string;
  whatsappMessage: string;
}> {
  const product = await Product.findByPk(input.productId);

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const variant = input.variantId
    ? await ProductVariant.findOne({
        where: { id: input.variantId, productId: product.id },
      })
    : null;

  if (input.variantId && !variant) {
    throw new Error("VARIANT_NOT_FOUND");
  }

  if (!env.whatsappBusinessPhone) {
    throw new Error("WHATSAPP_BUSINESS_PHONE_REQUIRED");
  }

  return sequelize.transaction(async (transaction) => {
    const store = product.storeId ? await Store.findByPk(product.storeId) : null;
    const targetPhone = store?.whatsappPhone || env.whatsappBusinessPhone;
    const lead = await Lead.create(
      {
        storeId: product.storeId ?? null,
        productId: product.id,
        name: input.customerName.trim(),
        phone: cleanPhone(input.customerPhone),
        email: input.customerEmail?.trim() || null,
        message: input.message?.trim() || null,
        source: input.source || "product_page",
        utmSource: input.utmSource ?? null,
        utmMedium: input.utmMedium ?? null,
        utmCampaign: input.utmCampaign ?? null,
        referrer: input.referrer ?? null,
      },
      { transaction },
    );

    const whatsappMessage = buildMessage({
      product,
      variant,
      quantity: Math.max(1, input.quantity || 1),
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      message: input.message,
      productUrl: input.productUrl,
    });
    const whatsappUrl = buildWhatsAppUrl(
      targetPhone,
      whatsappMessage,
    );

    const purchaseIntent = await PurchaseIntent.create(
      {
        leadId: lead.id,
        storeId: product.storeId ?? null,
        productId: product.id,
        variantId: variant?.id ?? null,
        quantity: Math.max(1, input.quantity || 1),
        status: "whatsapp_opened",
        channel: "whatsapp",
        whatsappMessage,
        whatsappUrl,
      },
      { transaction },
    );

    await WhatsAppClick.create(
      {
        purchaseIntentId: purchaseIntent.id,
        productId: product.id,
        leadId: lead.id,
        phoneTarget: cleanPhone(targetPhone),
        userAgent: input.userAgent ?? null,
        ipHash: hashIp(input.ip),
      },
      { transaction },
    );

    return {
      lead,
      purchaseIntent,
      whatsappUrl,
      whatsappMessage,
    };
  });
}
