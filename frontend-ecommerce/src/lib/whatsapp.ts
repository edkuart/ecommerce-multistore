type WhatsAppVariant = {
  size?: string | null;
  color?: string | null;
} | null;

type BuildWhatsAppUrlInput = {
  phone: string;
  productName: string;
  priceText?: string;
  variant?: WhatsAppVariant;
  quantity: number;
  customerName?: string;
  customerPhone?: string;
  productUrl?: string;
  note?: string;
};

export function buildWhatsAppUrl({
  phone,
  productName,
  priceText,
  variant,
  quantity,
  customerName,
  customerPhone,
  productUrl,
  note,
}: BuildWhatsAppUrlInput): string {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  const lines = [
    "Hola, me interesa hacer un pedido por WhatsApp.",
    "",
    `Producto: ${productName}`,
    priceText ? `Precio: ${priceText}` : null,
    variant?.size ? `Talla: ${variant.size}` : null,
    variant?.color ? `Color: ${variant.color}` : null,
    `Cantidad: ${quantity}`,
    productUrl ? `Link: ${productUrl}` : null,
    customerName ? `Nombre: ${customerName}` : null,
    customerPhone ? `Teléfono: ${customerPhone}` : null,
    note ? `Mensaje: ${note}` : null,
    "",
    "¿Me pueden compartir precio especial por mayoreo y disponibilidad?",
  ].filter(Boolean);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

type CreateWhatsAppIntentInput = {
  productId: string;
  variantId?: string | null;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message?: string;
  productUrl?: string;
};

type CreateWhatsAppIntentResponse = {
  leadId: string;
  purchaseIntentId: string;
  whatsappUrl: string;
  whatsappMessage: string;
};

export async function createWhatsAppIntent(
  input: CreateWhatsAppIntentInput,
): Promise<CreateWhatsAppIntentResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8800"}/whatsapp/intents`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        source: "product_page",
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      }),
    },
  );

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.message || "Could not create WhatsApp intent");
  }

  return body as CreateWhatsAppIntentResponse;
}
