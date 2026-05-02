import Link from "next/link";
import type { Store } from "@/types/store";

type StoreFilterProps = {
  stores: Store[];
  activeStoreId?: string;
  basePath: string;
};

export function StoreFilter({
  stores,
  activeStoreId,
  basePath,
}: StoreFilterProps) {
  if (!stores.length) return null;

  return (
    <div className="mb-5 rounded-md border border-ink/10 bg-white p-3 shadow-sm">
      <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
        Contexto de tienda
      </p>
      <nav className="flex gap-2 overflow-x-auto">
        <Link
          href={basePath}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
            !activeStoreId
              ? "border-moss bg-moss text-white"
              : "border-ink/10 bg-white text-ink/65 hover:border-moss/40 hover:text-ink"
          }`}
        >
          Todas
        </Link>
        {stores.map((store) => {
          const href = `${basePath}?storeId=${encodeURIComponent(store.id)}`;
          const isActive = activeStoreId === store.id;

          return (
            <Link
              key={store.id}
              href={href}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-moss bg-moss text-white"
                  : "border-ink/10 bg-white text-ink/65 hover:border-moss/40 hover:text-ink"
              }`}
            >
              {store.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
