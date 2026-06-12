'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-[2.5em] mb-3" aria-hidden="true">🔐</div>
            <h1 className="text-[1.5em] font-extrabold text-gray-900">
              CMS Admin Login
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Masuk ke dasbor pengelolaan DPD PKS Pamekasan
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="mb-6 p-4 rounded-lg bg-red-50 border-2 border-red-300 text-red-800"
              role="alert"
              aria-live="assertive"
            >
              <p className="font-bold text-sm">Login Gagal</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block font-bold text-sm text-gray-800">
                Email Admin
              </label>
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@pkspamekasan.id"
                className="w-full min-h-[44px] px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="block font-bold text-sm text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="w-full min-h-[44px] px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Akses terbatas untuk pengurus DPD PKS Pamekasan yang berwenang.
          </p>
        </div>
      </div>
    </main>
  );
}
