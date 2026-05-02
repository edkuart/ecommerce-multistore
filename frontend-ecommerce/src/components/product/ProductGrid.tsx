import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-md border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-ink">
          No hay productos disponibles
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
          Pronto agregaremos productos a esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
