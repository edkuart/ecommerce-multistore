import { Skeleton } from "@/components/ui";

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[4/5] rounded bg-linen" />
      <div className="h-3 w-2/3 rounded bg-linen" />
      <div className="h-4 w-full rounded bg-linen" />
      <div className="h-3 w-1/2 rounded bg-linen" />
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="bg-paper">
      {/* Hero skeleton */}
      <div className="animate-pulse px-6 py-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="h-3 w-24 rounded bg-linen" />
          <div className="h-10 w-3/4 rounded bg-linen" />
          <div className="h-10 w-1/2 rounded bg-linen" />
          <div className="h-4 w-64 rounded bg-linen" />
        </div>
      </div>

      {/* Catalog skeleton */}
      <section className="px-6 py-16 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-3 animate-pulse">
            <div className="h-3 w-32 rounded bg-linen" />
            <div className="h-8 w-56 rounded bg-linen" />
          </div>
          {/* Category chips */}
          <div className="mb-8 flex gap-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-11 w-24 rounded-full bg-linen" />
            ))}
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
