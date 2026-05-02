function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-linen ${className ?? ""}`} />;
}

export default function ProductLoading() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-4 w-32" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.75fr)] lg:gap-12">
          {/* Gallery skeleton */}
          <div className="grid gap-3 lg:grid-cols-[72px_minmax(0,1fr)]">
            <div className="order-2 flex gap-2 lg:order-1 lg:flex-col">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-16 shrink-0 sm:h-24 sm:w-20" />
              ))}
            </div>
            <Skeleton className="order-1 aspect-[4/5] lg:order-2" />
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="h-20 rounded-md" />
            </div>
            <Skeleton className="h-px" />
            <Skeleton className="h-48 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
