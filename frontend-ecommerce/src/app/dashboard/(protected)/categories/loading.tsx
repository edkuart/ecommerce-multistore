import { Skeleton as SkeletonBlock } from "@/components/ui";


export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-7 w-36" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-md border border-ink/10 bg-white shadow-sm">
          <div className="animate-pulse border-b border-ink/10 px-5 py-4">
            <SkeletonBlock className="h-5 w-28" />
          </div>
          <div className="p-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between px-3 py-3 border border-ink/10 rounded-md">
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <SkeletonBlock className="h-9 w-9" />
                  <SkeletonBlock className="h-9 w-9" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-4">
          <SkeletonBlock className="h-6 w-36" />
          <SkeletonBlock className="h-11" />
          <SkeletonBlock className="h-11" />
          <SkeletonBlock className="h-11" />
        </div>
      </div>
    </div>
  );
}
