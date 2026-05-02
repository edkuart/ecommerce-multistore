function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-linen ${className ?? ""}`} />;
}

function MetricCardSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-2">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-7 w-16" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  );
}

function MovementCardSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-ink/10 bg-paper px-3 py-3 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="h-4 w-48" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
        <div className="text-right space-y-1">
          <SkeletonBlock className="h-6 w-12" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </div>
      <div className="flex gap-2">
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Fixed bar heights avoid SSR / hydration mismatch
const BAR_HEIGHTS = ["40%", "65%", "30%", "80%", "55%", "90%", "45%", "70%", "35%", "60%", "75%", "50%", "85%", "40%"];

export default function InventoryLoading() {
  return (
    <div className="grid gap-6">
      {/* Period + metric cards */}
      <div className="space-y-3">
        <div className="animate-pulse flex items-center gap-3">
          <SkeletonBlock className="h-3 w-32" />
          <div className="flex gap-1">
            <SkeletonBlock className="h-7 w-16 rounded-full" />
            <SkeletonBlock className="h-7 w-20 rounded-full" />
            <SkeletonBlock className="h-7 w-12 rounded-full" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-4">
          <SkeletonBlock className="h-4 w-28" />
          <div className="flex items-end gap-1.5 h-28">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="flex-1 animate-pulse rounded-t-sm bg-linen"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-3">
          <SkeletonBlock className="h-4 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <SkeletonBlock className="h-3 w-32" />
                <SkeletonBlock className="h-3 w-12" />
              </div>
              <SkeletonBlock className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Movements list */}
      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="animate-pulse flex flex-wrap gap-3 border-b border-ink/10 px-5 py-4">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <SkeletonBlock className="h-11 w-52" />
            <SkeletonBlock className="h-11 w-28" />
          </div>
        </div>
        <div className="grid gap-2 p-3 md:hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <MovementCardSkeleton key={i} />
          ))}
        </div>
        <div className="hidden md:block p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-1.5">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
              <SkeletonBlock className="h-4 w-10 ml-auto" />
              <SkeletonBlock className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
