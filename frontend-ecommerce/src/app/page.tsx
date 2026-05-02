import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoriesIndex } from "@/components/home/CategoriesIndex";
import { StoreProductSections } from "@/components/home/StoreProductSections";
import { CTABand } from "@/components/home/CTABand";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchBar } from "@/components/product/SearchBar";
import { getCategories, getProducts, getStores } from "@/lib/api";

export const metadata: Metadata = {
  title: "Catálogo familiar — Moda, calzado y mayoreo en Guatemala",
};

type HomePageProps = {
  searchParams?: { category?: string; search?: string };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const activeCategory = searchParams?.category;
  const searchQuery = searchParams?.search?.trim() || undefined;
  const isFiltering = Boolean(activeCategory || searchQuery);

  const [products, categories, stores] = await Promise.all([
    getProducts({ category: activeCategory, active: true, search: searchQuery }),
    getCategories(),
    getStores(),
  ]);

  const activeCategoryName =
    categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory;

  return (
    <div className="bg-paper">
      {/* ── Hero ── */}
      <HeroSection
        productCount={products.length}
        storeCount={stores.filter((store) => store.isActive).length}
      />

      {/* ── Trust strip ── */}
      <TrustStrip />

      {/* ── Typographic store index + store sections (only when no filter active) ── */}
      {!isFiltering && (
        <>
          <CategoriesIndex stores={stores} products={products} />
          <StoreProductSections stores={stores} products={products} />
          <CTABand />
        </>
      )}

      {/* ── Full catalog with filter + search ── */}
      <section
        id="catalogo"
        className="scroll-mt-24 px-6 py-16 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b border-ink/10 pb-6">
            <p className="font-mono text-[11px] uppercase tracking-widest-label text-clay">
              — Catálogo completo
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-normal leading-[1.05] tracking-[-0.015em] text-ink">
                {searchQuery ? (
                  <>
                    Resultados:{" "}
                    <em className="italic text-clay">{searchQuery}</em>
                  </>
                ) : activeCategory ? (
                  <>
                    Categoría:{" "}
                    <em className="italic text-clay">{activeCategoryName}</em>
                  </>
                ) : (
                  "Todos los productos"
                )}
              </h2>
              <p className="shrink-0 font-mono text-[13px] tabular-nums text-ink/55">
                {products.length} ref.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-6">
            <Suspense>
              <SearchBar initialValue={searchQuery} />
            </Suspense>
          </div>

          {/* Category chips — hidden when a search query is active */}
          {!searchQuery && (
            <div className="mb-8">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
              />
            </div>
          )}

          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
