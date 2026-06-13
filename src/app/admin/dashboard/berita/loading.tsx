import { SkeletonBlock, SkeletonCard, SkeletonLine, SkeletonTable } from '@/src/components/Skeleton';

export default function BeritaLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <SkeletonLine className="h-7 w-40 mb-2" />
          <SkeletonLine className="h-4 w-20" />
        </div>
      </div>

      <SkeletonCard className="p-6 mb-8">
        <SkeletonLine className="h-5 w-40 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-full" />
          ))}
        </div>
        <SkeletonBlock className="h-11 w-36 mt-4 rounded-lg" />
      </SkeletonCard>

      <SkeletonTable
        rows={5}
        cols={[
          { width: 'w-48' },
          { width: 'w-24' },
          { width: 'w-28' },
          { width: 'w-16' },
        ]}
      />
    </div>
  );
}
