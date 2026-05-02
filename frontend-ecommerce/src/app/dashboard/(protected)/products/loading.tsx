function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-linen ${className ?? ""}`} />;
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-md border border-ink/10 bg-paper p-3 shadow-sm">
      <div className="flex gap-3">
        <SkeletonBlock className="h-24 w-20 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="h-3 w-1/2" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <SkeletonBlock className="h-11" />
        <SkeletonBlock className="h-11" />
        <SkeletonBlock className="h-11" />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="rounded-md border border-ink/10 bg-white shadow-sm">
        <div className="animate-pulse flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-28" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
          <SkeletonBlock className="h-11 w-20" />
        </div>
        <div className="grid gap-3 p-3 md:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-2">
              <SkeletonBlock className="h-12 w-10 rounded-md" />
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
              <div className="ml-auto flex gap-2">
                <SkeletonBlock className="h-11 w-11" />
                <SkeletonBlock className="h-11 w-11" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-4">
        <SkeletonBlock className="h-6 w-36" />
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-11" />
        ))}
        <SkeletonBlock className="h-11" />
      </div>
    </div>
  );
}
