import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/api";
import { AddToCartPanel } from "./AddToCartPanel";
import { ProductGallery } from "./ProductGallery";
import { StockBadge } from "./StockBadge";

export function ProductDetail({ product }: { product: Product }) {
  const totalVariantStock = (product.variants ?? []).reduce(
    (sum, variant) => sum + variant.stock,
    0,
  );
  const stock = product.variants?.length ? totalVariantStock : product.stock;
  const categoryName = product.categoryDetails?.name ?? product.category;
  const storeName = product.store?.name;

  return (
    <section className="grid gap-8 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.75fr)] lg:gap-12 lg:pb-0">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ProductGallery images={product.images ?? []} title={product.name} />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          {categoryName && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
              {categoryName}
            </p>
          )}
          {storeName && (
            <p className="text-sm font-medium text-ink/50">
              Tienda: {storeName}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="max-w-2xl text-base leading-7 text-ink/65">
              {product.shortDescription}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <StockBadge stock={stock} />
            <p className="text-sm font-medium text-ink/55">
              {stock > 0 ? `${stock} unidades disponibles` : "Sin inventario"}
            </p>
            {product.sku && (
              <p className="text-sm font-medium text-ink/45">SKU {product.sku}</p>
            )}
          </div>
          <div className="rounded-md bg-white px-4 py-3 ring-1 ring-ink/10">
            <p className="text-2xl font-semibold text-moss">
              {formatCurrency(product.price)}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <p className="mt-1 text-sm text-ink/45">
                Antes{" "}
                <span className="line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              </p>
            )}
            <p className="mt-2 text-sm font-medium text-clay">
              Precios especiales por mayoreo disponibles
            </p>
          </div>
        </div>

        {product.description && (
          <div className="border-y border-ink/10 py-5">
            <p className="leading-7 text-ink/75">{product.description}</p>
          </div>
        )}

        <AddToCartPanel product={product} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_rgba(23,21,17,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-ink/50">
              {product.name}
            </p>
            <p className="text-base font-semibold text-moss">
              {formatCurrency(product.price)}
            </p>
          </div>
          <a
            href="#cotizar"
            className="inline-flex min-h-12 shrink-0 items-center rounded-md bg-whats px-4 text-sm font-semibold text-white"
          >
            Cotizar
          </a>
        </div>
      </div>
    </section>
  );
}
