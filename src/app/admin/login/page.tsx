'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema, type LoginInput } from '@/src/validations/cms/login';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block font-bold text-sm text-gray-800">
                Email Admin
              </label>
              <input
                type="email"
                id="admin-email"
                {...register('email')}
                autoComplete="email"
                placeholder="admin@pkspamekasan.id"
                className="w-full min-h-[44px] px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="block font-bold text-sm text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="admin-password"
                {...register('password')}
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="w-full min-h-[44px] px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
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
