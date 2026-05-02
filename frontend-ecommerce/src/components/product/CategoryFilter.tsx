import Link from "next/link";
import type { Category } from "@/types/category";

type CategoryFilterProps = {
  categories: Category[];
  activeCategory?: string;
};

export function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  if (!categories.length) return null;

  return (
    <nav
      aria-label="Categorías"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0"
    >
      <Link
        href="/"
        className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
          !activeCategory
            ? "border-moss bg-moss text-white"
            : "border-ink/10 bg-white text-ink/65 hover:border-moss/40 hover:text-ink"
        }`}
      >
        Todos
      </Link>
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;

        return (
          <Link
            key={category.id}
            href={`/?category=${encodeURIComponent(category.slug)}`}
            className={`flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-moss bg-moss text-white"
                : "border-ink/10 bg-white text-ink/65 hover:border-moss/40 hover:text-ink"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
