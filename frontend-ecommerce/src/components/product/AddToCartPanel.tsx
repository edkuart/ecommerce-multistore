"use client";

import { useMemo, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCurrency, resolveImageUrl } from "@/lib/api";
import { env } from "@/config/env";
import { buildWhatsAppUrl, createWhatsAppIntent } from "@/lib/whatsapp";
import type { Product, ProductVariant } from "@/types/product";
import { StockBadge } from "./StockBadge";
import { VariantSelector } from "./VariantSelector";

export function AddToCartPanel({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const firstAvailableVariant =
    variants.find((variant) => variant.stock > 0) ?? null;
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(firstAvailableVariant);
  const [quantity, setQuantity] = useState(1);
  const [leadForm, setLeadForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    message: "",
  });
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const { addItem } = useCart();

  const hasVariants = variants.length > 0;
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectivePriceText = formatCurrency(effectivePrice);
  const targetWhatsAppPhone = product.store?.whatsappPhone || env.whatsappPhone;
  const availableStock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;
  const canAdd = availableStock > 0 && (!hasVariants || selectedVariant);

  const cartId = useMemo(
    () => `${product.id}:${selectedVariant?.id ?? "base"}`,
    [product.id, selectedVariant?.id],
  );
  async function handleWhatsAppSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWhatsappLoading(true);
    setWhatsappError(null);

    const fallbackUrl = buildWhatsAppUrl({
      phone: targetWhatsAppPhone,
      productName: product.name,
      priceText: effectivePriceText,
      variant: selectedVariant
        ? { size: selectedVariant.size, color: selectedVariant.color }
        : null,
      quantity,
      customerName: leadForm.customerName,
      customerPhone: leadForm.customerPhone,
      productUrl: window.location.href,
      note: leadForm.message,
    });

    try {
      const intent = await createWhatsAppIntent({
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        quantity,
        customerName: leadForm.customerName,
        customerPhone: leadForm.customerPhone,
        customerEmail: leadForm.customerEmail || undefined,
        message: leadForm.message || undefined,
        productUrl: window.location.href,
      });

      window.open(intent.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      setWhatsappError(
        "Abrimos WhatsApp, pero no se pudo registrar el lead en este momento.",
      );
    } finally {
      setWhatsappLoading(false);
    }
  }

  return (
    <div
      id="cotizar"
      className="scroll-mt-24 space-y-5 rounded-md border border-ink/10 bg-white p-5 shadow-sm"
    >
      <VariantSelector
        variants={variants}
        selectedVariantId={selectedVariant?.id ?? null}
        onChange={setSelectedVariant}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/55">Precio</p>
          <p className="text-2xl font-semibold text-moss">
            {effectivePriceText}
          </p>
          <p className="mt-2 text-sm font-medium text-clay">
            Descuentos por volumen. Escríbenos para cotización.
          </p>
        </div>

        <label className="grid gap-1 text-sm font-medium text-ink">
          Cant.
          <input
            type="number"
            min={1}
            max={Math.max(availableStock, 1)}
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value) || 1))
            }
            className="h-12 w-24 rounded-md border border-ink/15 px-3 text-base"
          />
        </label>
      </div>

      <div className="flex items-center justify-between rounded-md bg-linen/60 px-3 py-2">
        <span className="text-sm font-medium text-ink/60">Disponibilidad</span>
        <StockBadge stock={availableStock} />
      </div>

      <form onSubmit={handleWhatsAppSubmit} className="grid gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Datos de contacto</p>
          <p className="mt-1 text-xs leading-5 text-ink/50">
            Se usarán para preparar el mensaje de WhatsApp.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Nombre"
            value={leadForm.customerName}
            onChange={(event) =>
              setLeadForm((current) => ({
                ...current,
                customerName: event.target.value,
              }))
            }
            className="h-12 rounded-md border border-ink/15 px-3 text-base sm:text-sm"
          />
          <input
            required
            inputMode="tel"
            placeholder="Teléfono"
            value={leadForm.customerPhone}
            onChange={(event) =>
              setLeadForm((current) => ({
                ...current,
                customerPhone: event.target.value,
              }))
            }
            className="h-12 rounded-md border border-ink/15 px-3 text-base sm:text-sm"
          />
        </div>
        <input
          type="email"
          placeholder="Email opcional"
          value={leadForm.customerEmail}
          onChange={(event) =>
            setLeadForm((current) => ({
              ...current,
              customerEmail: event.target.value,
            }))
          }
          className="h-12 rounded-md border border-ink/15 px-3 text-base sm:text-sm"
        />
        <textarea
          placeholder="Mensaje opcional"
          value={leadForm.message}
          onChange={(event) =>
            setLeadForm((current) => ({
              ...current,
              message: event.target.value,
            }))
          }
          className="min-h-20 rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        {whatsappError && (
          <p className="text-sm font-medium text-amber-700">{whatsappError}</p>
        )}
        <button
          type="submit"
          disabled={whatsappLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-whats px-4 text-sm font-semibold text-white transition hover:bg-whats-deep disabled:opacity-50"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {whatsappLoading ? "Abriendo WhatsApp..." : "Comprar por WhatsApp"}
        </button>

        <button
          type="button"
          disabled={!canAdd}
          onClick={() => {
            if (!canAdd) return;
            addItem(
              {
                id: cartId,
                productId: product.id,
                variantId: selectedVariant?.id ?? null,
                name: product.name,
                image: resolveImageUrl(product.images?.[0]),
                price: effectivePrice,
                variant: selectedVariant
                  ? {
                      size: selectedVariant.size,
                      color: selectedVariant.color,
                    }
                  : null,
              },
              quantity,
            );
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-moss/20 bg-white px-4 text-sm font-semibold text-moss transition hover:border-moss hover:bg-moss/5 disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/30"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
          {canAdd ? "Agregar al carrito" : "Sin inventario"}
        </button>
      </form>
    </div>
  );
}
