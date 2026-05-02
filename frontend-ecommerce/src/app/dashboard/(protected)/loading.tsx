function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-linen ${className ?? ""}`} />;
}

function SummaryCardSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-3">
      <SkeletonBlock className="h-3 w-28" />
      <SkeletonBlock className="h-8 w-16" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-3">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-7 w-56" />
        <SkeletonBlock className="h-4 w-80" />
        <div className="flex gap-2 pt-1">
          <SkeletonBlock className="h-11 w-36" />
          <SkeletonBlock className="h-11 w-28" />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>

      {/* Alerts + aside */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-4">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-4 w-64" />
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10" />
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-3">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-5/6" />
          <SkeletonBlock className="h-3 w-4/6" />
        </div>
      </div>

      {/* Store cards */}
      <div className="space-y-4">
        <SkeletonBlock className="h-5 w-28" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-4">
              <SkeletonBlock className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-3 border-t border-ink/8 pt-4">
                <SkeletonBlock className="h-8" />
                <SkeletonBlock className="h-8" />
              </div>
              <div className="flex gap-2 border-t border-ink/8 pt-3">
                <SkeletonBlock className="h-8 flex-1" />
                <SkeletonBlock className="h-8 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
