import Link from "next/link";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProduct } from "@/lib/api";

type ProductPageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Producto no disponible",
    };
  }

  return {
    title: `${product.name} | Ecommerce`,
    description:
      product.shortDescription ||
      product.description ||
      "Producto disponible para cotización por WhatsApp.",
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
          Producto no encontrado
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">
          Este producto no está disponible.
        </h1>
        <Link
          href="/"
          className="mt-6 rounded-md bg-moss px-5 py-3 text-sm font-semibold text-white"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-semibold text-ink/60 transition hover:text-ink"
        >
          Volver al catálogo
        </Link>
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
