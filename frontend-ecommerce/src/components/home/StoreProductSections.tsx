import Link from "next/link";
import type { Product } from "@/types/product";
import type { Store, StoreType } from "@/types/store";
import { ProductCard } from "@/components/product/ProductCard";

const sectionConfig: Array<{
  type: StoreType;
  title: string;
  description: string;
  anchor: string;
  tag: string;
}> = [
  {
    type: "girls_clothing",
    title: "Ropa niñas",
    description:
      "Prendas suaves, bien hechas, pensadas para que no se queden chicas en una semana.",
    anchor: "girls",
    tag: "Mini-tienda",
  },
  {
    type: "general_clothing",
    title: "Ropa general",
    description:
      "Selección curada para el día a día — básicos honestos y piezas con personalidad.",
    anchor: "general",
    tag: "Mini-tienda",
  },
  {
    type: "shoes",
    title: "Calzado",
    description:
      "Zapatos que aguantan banqueta, mercado y oficina. Cómodos sin sacrificar estilo.",
    anchor: "shoes",
    tag: "Mini-tienda",
  },
  {
    type: "wholesale",
    title: "Mayoreo",
    description:
      "Para revendedores y tiendas. Cotización personalizada, precios por volumen reales.",
    anchor: "wholesale",
    tag: "Mini-tienda",
  },
];

type StoreProductSectionsProps = {
  stores: Store[];
  products: Product[];
};

export function StoreProductSections({
  stores,
  products,
}: StoreProductSectionsProps) {
  const sections = sectionConfig
    .map((config, index) => {
      const storeIds = stores
        .filter((s) => s.type === config.type && s.isActive)
        .map((s) => s.id);
      const sectionProducts = products
        .filter((p) => p.storeId && storeIds.includes(p.storeId))
        .slice(0, 4);
      return { ...config, products: sectionProducts, index };
    })
    .filter((s) => s.products.length > 0);

  if (!sections.length) return null;

  const total = sectionConfig.length;

  return (
    <div>
      {sections.map((section) => (
        <section
          key={section.type}
          id={section.anchor}
          className={`border-t border-ink/10 px-6 py-20 md:px-8 md:py-24 lg:px-12 ${
            section.index % 2 !== 0 ? "bg-paper-deep" : "bg-paper"
          }`}
        >
          <div className="mx-auto max-w-7xl">
            {/* Section head */}
            <div className="mb-12 grid grid-cols-1 items-end gap-6 md:grid-cols-[1fr_auto] md:gap-8">
              <div className="max-w-2xl">
                {/* Numbered index */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">
                    0{section.index + 1} / 0{total}
                  </span>
                  <span className="h-px w-6 bg-ink/20" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-clay">
                    {section.tag}
                  </span>
                </div>
                <h2 className="mb-4 font-serif text-[clamp(36px,5vw,60px)] font-normal leading-[1] tracking-[-0.015em] text-ink">
                  {section.title}
                </h2>
                <p className="max-w-xl text-[16px] leading-[1.55] text-ink/65">
                  {section.description}
                </p>
              </div>

              <Link
                href="#catalogo"
                className="inline-flex shrink-0 items-center gap-2.5 border-b border-ink/20 pb-2 font-mono text-[12px] uppercase tracking-wide-label text-ink transition duration-180 ease-commerce hover:border-clay hover:text-clay"
              >
                <span>Ver catálogo completo</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
