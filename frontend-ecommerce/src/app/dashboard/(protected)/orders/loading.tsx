function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-linen ${className ?? ""}`} />;
}

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-7 w-24" />
      </div>
      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="animate-pulse border-b border-ink/10 px-5 py-4 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-24" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid gap-2 p-3 md:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-md border border-ink/10 bg-paper px-3 py-3 space-y-2">
              <div className="flex justify-between">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-3 w-40" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="hidden md:block p-4 space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-2">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-5 w-20 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
