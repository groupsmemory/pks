'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  search: string;
  searchPlaceholder?: string;
  kecamatan: string;
  kecamatanOptions?: FilterOption[];
  status: string;
  statusOptions: FilterOption[];
  statusLabel?: string;
}

export default function FilterBar({
  search,
  searchPlaceholder = 'Cari nama...',
  kecamatan,
  kecamatanOptions,
  status,
  statusOptions,
  statusLabel = 'Status',
}: FilterBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const submit = useCallback(
    (formData: FormData) => {
      const params = new URLSearchParams();
      const s = formData.get('search') as string;
      const st = formData.get('status') as string;
      const k = formData.get('kecamatan') as string;
      if (s) params.set('search', s);
      if (st) params.set('status', st);
      if (k) params.set('kecamatan', k);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router],
  );

  return (
    <form action={submit} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[180px] flex-1">
        <label htmlFor="filter-search" className="block text-xs font-bold text-gray-600 mb-1">
          Cari Nama
        </label>
        <input
          id="filter-search"
          name="search"
          type="text"
          defaultValue={search}
          placeholder={searchPlaceholder}
          className="w-full min-h-[44px] px-3 py-2 text-sm border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
        />
      </div>

      {kecamatanOptions && (
        <div className="min-w-[150px]">
          <label htmlFor="filter-kecamatan" className="block text-xs font-bold text-gray-600 mb-1">
            Kecamatan
          </label>
          <select
            id="filter-kecamatan"
            name="kecamatan"
            defaultValue={kecamatan}
            className="w-full min-h-[44px] px-3 py-2 text-sm border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all bg-white"
          >
            <option value="">Semua</option>
            {kecamatanOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="min-w-[150px]">
        <label htmlFor="filter-status" className="block text-xs font-bold text-gray-600 mb-1">
          {statusLabel}
        </label>
        <select
          id="filter-status"
          name="status"
          defaultValue={status}
          className="w-full min-h-[44px] px-3 py-2 text-sm border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all bg-white"
        >
          <option value="">Semua</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="min-h-[44px] px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
      >
        Filter
      </button>

      {(search || status || kecamatan) && (
        <a
          href={pathname}
          className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors inline-flex items-center"
        >
          Reset
        </a>
      )}
    </form>
  );
}
