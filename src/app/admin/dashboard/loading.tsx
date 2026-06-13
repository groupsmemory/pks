import { SkeletonBlock, SkeletonCard, SkeletonLine } from '@/src/components/Skeleton';

export default function AdminDashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <SkeletonLine className="h-8 w-64 mb-2" />
        <SkeletonLine className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-32" />
        ))}
      </div>

      <SkeletonCard className="p-6">
        <SkeletonLine className="h-5 w-24 mb-4" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-11 w-40 rounded-lg" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}
