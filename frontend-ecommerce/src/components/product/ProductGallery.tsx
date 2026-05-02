"use client";

import { useMemo, useState } from "react";
import { resolveImageUrl } from "@/lib/api";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const normalizedImages = useMemo(
    () => [...new Set((images ?? []).filter(Boolean))],
    [images],
  );
  const [active, setActive] = useState(0);
  const visibleImages = normalizedImages.length ? normalizedImages : [null];
  const current = resolveImageUrl(visibleImages[active]);

  return (
    <div className="grid gap-3 lg:grid-cols-[72px_minmax(0,1fr)]">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
        {visibleImages.map((image, index) => (
          <button
            key={`${image ?? "placeholder"}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-md border bg-linen transition sm:h-24 sm:w-20 ${
              index === active ? "border-moss opacity-100" : "border-transparent opacity-60"
            }`}
            aria-label={`Show image ${index + 1}`}
          >
            <img
              src={resolveImageUrl(image)}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="order-1 aspect-[4/5] overflow-hidden rounded-md border border-ink/10 bg-linen lg:order-2">
        <img src={current} alt={title} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
