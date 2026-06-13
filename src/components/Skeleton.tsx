export function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-4 rounded bg-gray-200 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-gray-200 animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  cols,
}: {
  rows?: number;
  cols: { width: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm" aria-hidden="true">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {cols.map((col, i) => (
              <th key={i} scope="col" className="px-4 py-3">
                <SkeletonLine className={`${col.width} h-3`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {cols.map((col, c) => (
                <td key={c} className="px-4 py-3">
                  <SkeletonLine className={col.width} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
