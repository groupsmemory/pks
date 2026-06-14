'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAdminSchema, type CreateAdminInput } from '@/src/validations/cms/admin';
import { createAdminUser, toggleAdminActive } from '@/src/app/actions/cms/admin-users';

interface AdminUser {
  id: string;
  nama: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export default function AdminUsersClient({ users }: { users: AdminUser[] }) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminSchema),
  });

  async function onSubmit(data: CreateAdminInput) {
    setPending(true);
    setMessage(null);

    const fd = new FormData();
    fd.set('nama', data.nama);
    fd.set('email', data.email);
    fd.set('password', data.password);
    fd.set('role', data.role);

    const result = await createAdminUser(fd);
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Berhasil.' });
      reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'Gagal.' });
    }
    setPending(false);
  }

  async function handleToggle(id: string) {
    setMessage(null);
    const result = await toggleAdminActive(id);
    if (!result.success) {
      setMessage({ type: 'error', text: result.error || 'Gagal.' });
    }
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="font-bold text-[1.125em] mb-4">Tambah Admin Baru</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama *
              </label>
              <input
                type="text"
                id="nama"
                disabled={pending}
                {...register('nama')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nama && <p className="text-red-600 text-xs mt-1">{errors.nama.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                disabled={pending}
                {...register('email')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                disabled={pending}
                {...register('password')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                id="role"
                disabled={pending}
                {...register('role')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="min-h-[44px] px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
          >
            {pending ? 'Menyimpan...' : 'Tambah Admin'}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm" aria-label="Tabel admin users">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold text-gray-700">Nama</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-700">Email</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-700">Role</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-700">Aktif</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-700">Terakhir Login</th>
              <th scope="col" className="px-4 py-3 font-bold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{user.nama}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-bold uppercase rounded-full ${
                      user.role === 'SUPER_ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(user.id)}
                    className={`min-h-[44px] px-3 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-4 ${
                      user.is_active
                        ? 'text-red-600 hover:bg-red-50 focus:ring-red-200'
                        : 'text-green-600 hover:bg-green-50 focus:ring-green-200'
                    }`}
                  >
                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
