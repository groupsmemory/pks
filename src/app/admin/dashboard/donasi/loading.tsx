import { SkeletonLine, SkeletonTable } from '@/src/components/Skeleton';

export default function DonasiLoading() {
  return (
    <div>
      <div className="mb-6">
        <SkeletonLine className="h-7 w-48 mb-2" />
        <SkeletonLine className="h-4 w-72" />
      </div>

      <SkeletonTable
        rows={6}
        cols={[
          { width: 'w-28' },
          { width: 'w-24' },
          { width: 'w-20' },
          { width: 'w-20' },
          { width: 'w-20' },
          { width: 'w-20' },
          { width: 'w-28' },
        ]}
      />
    </div>
  );
}
