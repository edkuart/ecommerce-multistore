import Link from "next/link";
import type { Product } from "@/types/product";
import type { Store, StoreType } from "@/types/store";

const storeMeta: Record<
  StoreType,
  { swatch: string; anchor: string; description: string }
> = {
  girls_clothing: {
    swatch: "#d86f8d",
    anchor: "#girls",
    description: "Prendas suaves, bien hechas, pensadas para que no se queden chicas en una semana.",
  },
  general_clothing: {
    swatch: "#273f32",
    anchor: "#general",
    description: "Selección curada para el día a día — básicos honestos y piezas con personalidad.",
  },
  shoes: {
    swatch: "#2f405f",
    anchor: "#shoes",
    description: "Zapatos que aguantan banqueta, mercado y oficina.",
  },
  wholesale: {
    swatch: "#9c5f3f",
    anchor: "#wholesale",
    description: "Para revendedores. Cotización personalizada, precios por volumen reales.",
  },
  other: {
    swatch: "#6b7280",
    anchor: "#catalogo",
    description: "",
  },
};

export function CategoriesIndex({
  stores,
  products,
}: {
  stores: Store[];
  products: Product[];
}) {
  const visible = stores.filter(
    (s) => s.isActive && s.type !== "other" && storeMeta[s.type],
  );
  const productCountByStore = products.reduce<Record<string, number>>(
    (current, product) => {
      if (product.storeId) {
        current[product.storeId] = (current[product.storeId] ?? 0) + 1;
      }
      return current;
    },
    {},
  );

  if (!visible.length) return null;

  return (
    <section className="px-6 py-20 md:px-8 md:py-24 lg:px-12" id="cats">
      <div className="mx-auto max-w-7xl">
        {/* Head */}
        <div className="mb-14 grid grid-cols-1 gap-6 border-b border-ink/10 pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest-label text-clay">
              — Mini-tiendas
            </p>
            <h2 className="font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1] tracking-[-0.015em] text-ink">
              Cuatro{" "}
              <em className="italic text-clay">tiendas</em>,
              <br />
              un mismo equipo.
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.6] text-ink/60 md:pb-1">
            Cada mini-tienda tiene su propia curaduría y precio. Saltá directo a
            la que te interesa — todo se cotiza por el mismo WhatsApp.
          </p>
        </div>

        {/* Typographic index list */}
        <div>
          {visible.map((store, i) => {
            const meta = storeMeta[store.type];
            return (
              <Link
                key={store.id}
                href={meta.anchor}
                className="cat-row flex items-center gap-6 border-b border-ink/10 py-7"
              >
                <span className="w-14 shrink-0 font-mono text-[13px] tabular-nums text-ink/40">
                  0{i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="cat-row-name block font-serif text-[clamp(28px,3.5vw,44px)] leading-[1.1] text-ink">
                    {store.name}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-5">
                  <span
                    className="hidden h-3.5 w-3.5 rounded-full sm:block"
                    style={{ background: meta.swatch }}
                  />
                  <span className="hidden font-mono text-[12px] tabular-nums text-ink/55 sm:block">
                    {productCountByStore[store.id] ?? 0} ref.
                  </span>
                  <span className="cat-row-arrow font-serif text-2xl text-ink">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
