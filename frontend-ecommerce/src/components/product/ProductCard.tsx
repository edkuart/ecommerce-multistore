import Image from "next/image";
import Link from "next/link";
import { env } from "@/config/env";
import type { Product } from "@/types/product";
import { formatCurrency, resolveImageUrl } from "@/lib/api";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const imageSrc = resolveImageUrl(product.images?.[0]);
  const isRemote =
    imageSrc.startsWith("http://") || imageSrc.startsWith("https://");
  const variantCount = product.variants?.length ?? 0;
  const productHref = `/product/${product.slug || product.id}`;
  const productUrl = `${env.appUrl}${productHref}`;
  const categoryName = product.categoryDetails?.name ?? product.category;
  const priceText = formatCurrency(product.price);
  const stock = variantCount
    ? product.variants!.reduce((sum, v) => sum + v.stock, 0)
    : product.stock;

  const whatsappUrl = buildWhatsAppUrl({
    phone: product.store?.whatsappPhone || env.whatsappPhone,
    productName: product.name,
    priceText,
    quantity: 1,
    productUrl,
  });

  return (
    <article className="product-card group flex flex-col transition-transform duration-280 ease-commerce hover:-translate-y-[3px]">
      {/* Image */}
      <div className="p-img-wrap relative mb-3 aspect-[4/5] overflow-hidden rounded bg-linen sm:mb-4">
        {isRemote ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-[520ms] ease-commerce group-hover:scale-[1.04]"
            style={{ transition: "transform 520ms cubic-bezier(.2,.7,.2,1)" }}
          />
        ) : (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition duration-[520ms] ease-commerce group-hover:scale-[1.04]"
            style={{ transition: "transform 520ms cubic-bezier(.2,.7,.2,1)" }}
          />
        )}
        {/* Inner shadow ring */}
        <div className="pointer-events-none absolute inset-0 rounded shadow-[inset_0_0_0_1px_rgba(23,21,17,0.04)]" />

        {/* Badge */}
        <div
          className={`absolute left-2 top-2 rounded-[2px] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1.5 sm:text-[10px] sm:tracking-[0.14em] ${
            product.isFeatured
              ? "bg-clay text-paper"
              : "bg-paper text-ink"
          }`}
        >
          {product.isFeatured ? "Destacado" : `${stock} disp.`}
        </div>

        {/* Quick actions overlay */}
        <div className="p-quick absolute inset-x-2 bottom-2 flex gap-2 sm:inset-x-3 sm:bottom-3">
          <Link
            href={productHref}
            className="flex min-h-11 flex-1 items-center justify-center rounded border border-ink/10 bg-paper px-2 text-center text-[12px] font-semibold text-ink transition duration-180 ease-commerce hover:border-ink hover:bg-ink hover:text-paper sm:text-[12.5px]"
          >
            Ver
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-whats bg-whats text-white transition duration-180 ease-commerce hover:bg-whats-deep"
            title="Consultar por WhatsApp"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0a8 8 0 0 1 6.93 12.02L16 16l-4.11-1.05A8 8 0 1 1 8 0Zm0 1.6A6.4 6.4 0 1 0 12.3 12l-.23-.38.75-1.94-2.06.53-.4-.22A6.38 6.38 0 0 0 8 1.6ZM5.6 4.8h.6c.22 0 .45.16.53.37l.74 1.87c.09.22.03.48-.16.65l-.43.42c.4.8 1.15 1.54 1.95 1.95l.42-.43c.17-.19.43-.25.65-.16l1.87.74c.21.08.37.31.37.53v.6c0 .34-.28.62-.62.62A6.22 6.22 0 0 1 4.8 5.42c0-.34.28-.62.62-.62H5.6Z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1">
        {categoryName && (
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.08em] text-clay sm:text-[10px] sm:tracking-wide-label">
            {categoryName}
          </p>
        )}
        <Link href={productHref}>
          <h2 className="line-clamp-2 min-h-[2.4em] font-serif text-[16px] font-normal leading-[1.2] text-ink transition duration-180 ease-commerce hover:text-clay sm:text-[19px]">
            {product.name}
          </h2>
        </Link>
        <div className="mt-1.5 grid gap-1 sm:flex sm:items-baseline sm:justify-between sm:gap-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate font-mono text-[13px] font-semibold tabular-nums text-ink sm:text-[14px]">
              <span className="mr-1 font-medium text-ink/45">Q</span>
              {product.price.toLocaleString("es-GT")}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-mono text-[12px] tabular-nums text-ink/40 line-through">
                Q{product.compareAtPrice.toLocaleString("es-GT")}
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] tabular-nums text-ink/50 sm:text-[11px]">
            {variantCount > 0 ? `${variantCount} var.` : `${stock} uds.`}
          </span>
        </div>
      </div>
    </article>
  );
}
