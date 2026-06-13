import { SkeletonBlock, SkeletonCard, SkeletonLine } from '@/src/components/Skeleton';

export default function GaleriLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <SkeletonLine className="h-7 w-40 mb-2" />
          <SkeletonLine className="h-4 w-16" />
        </div>
      </div>

      <SkeletonCard className="p-6 mb-8">
        <SkeletonLine className="h-5 w-40 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-full" />
          ))}
        </div>
        <SkeletonBlock className="h-11 w-32 mt-4 rounded-lg" />
      </SkeletonCard>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <SkeletonBlock className="aspect-square w-full rounded-none" />
            <div className="p-3 space-y-2">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="h-3 w-16" />
              <SkeletonLine className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
