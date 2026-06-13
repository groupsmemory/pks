'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AdminDashboardError]', error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex items-center justify-center p-8 min-h-[60vh]"
    >
      <div className="max-w-md w-full text-center">
        <span aria-hidden="true" className="text-5xl block mb-4">
          ⚠️
        </span>
        <h1 className="text-2xl font-bold text-red-800 mb-2">
          Gagal Memuat Dashboard
        </h1>
        <p className="text-red-600 mb-6">
          Terjadi kesalahan saat memuat halaman dashboard. Silakan coba lagi
          atau hubungi administrator.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-[44px] min-w-[44px] px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Coba Lagi
          </button>
          <Link
            href="/admin/login"
            className="min-h-[44px] min-w-[44px] px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 inline-flex items-center"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
