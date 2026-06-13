import { SkeletonLine, SkeletonTable } from '@/src/components/Skeleton';

export default function KtaLoading() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <SkeletonLine className="h-7 w-56 mb-2" />
          <SkeletonLine className="h-4 w-64" />
        </div>
      </div>

      <SkeletonTable
        rows={6}
        cols={[
          { width: 'w-32' },
          { width: 'w-32' },
          { width: 'w-24' },
          { width: 'w-20' },
          { width: 'w-28' },
        ]}
      />
    </div>
  );
}
