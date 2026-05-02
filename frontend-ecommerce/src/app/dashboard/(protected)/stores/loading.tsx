import { Skeleton as SkeletonBlock } from "@/components/ui";

export default function StoresLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-2">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-7 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-md border border-ink/10 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5 flex-1">
                <SkeletonBlock className="h-5 w-36" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-ink/8 pt-4">
              <SkeletonBlock className="h-12" />
              <SkeletonBlock className="h-12" />
            </div>
            <div className="flex gap-2 border-t border-ink/8 pt-3">
              <SkeletonBlock className="h-9 flex-1" />
              <SkeletonBlock className="h-9 flex-1" />
              <SkeletonBlock className="h-9 w-9" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
