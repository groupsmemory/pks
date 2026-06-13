import { SkeletonLine, SkeletonTable } from '@/src/components/Skeleton';

export default function AspirasiLoading() {
  return (
    <div>
      <div className="mb-6">
        <SkeletonLine className="h-7 w-56 mb-2" />
        <SkeletonLine className="h-4 w-72" />
      </div>

      <SkeletonTable
        rows={6}
        cols={[
          { width: 'w-28' },
          { width: 'w-24' },
          { width: 'w-48' },
          { width: 'w-20' },
          { width: 'w-24' },
          { width: 'w-28' },
        ]}
      />
    </div>
  );
}
