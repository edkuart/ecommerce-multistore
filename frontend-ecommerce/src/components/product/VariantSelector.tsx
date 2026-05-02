"use client";

import type { ProductVariant } from "@/types/product";
import { formatCurrency } from "@/lib/api";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onChange: (variant: ProductVariant | null) => void;
};

export function VariantSelector({
  variants,
  selectedVariantId,
  onChange,
}: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-ink">Size / Color</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {variants.map((variant) => {
          const selected = selectedVariantId === variant.id;
          const disabled = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(variant)}
              className={`rounded-md border p-3 text-left transition ${
                selected
                  ? "border-moss bg-moss text-white"
                  : "border-ink/10 bg-white text-ink hover:border-moss/50"
              } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
            >
              <span className="block text-sm font-semibold">
                {variant.size} · {variant.color}
              </span>
              <span className="mt-1 block text-xs opacity-75">
                {variant.stock} in stock
                {variant.price ? ` · ${formatCurrency(variant.price)}` : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
