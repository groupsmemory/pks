'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <div
          role="alert"
          className="flex-1 flex items-center justify-center p-4 bg-red-50"
        >
          <div className="max-w-md w-full text-center">
            <span aria-hidden="true" className="text-5xl block mb-4">
              ⚠️
            </span>
            <h1 className="text-2xl font-bold text-red-800 mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-red-600 mb-6">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
            </p>
            <button
              type="button"
              onClick={reset}
              className="min-h-[44px] min-w-[44px] px-6 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
