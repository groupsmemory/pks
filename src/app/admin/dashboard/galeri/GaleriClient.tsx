'use client';

import { useState } from 'react';
import { createGaleri, deleteGaleri } from '@/src/app/actions/cms/galeri';

export function GaleriForm() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createGaleri(formData);

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Berhasil disimpan.' });
      e.currentTarget.reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'Gagal menyimpan.' });
    }
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <h2 className="font-bold text-[1.125em] mb-4">Tambah Foto Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message.text}
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
          <input type="text" name="title" id="title" required
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar *</label>
            <input type="url" name="image_url" id="image_url" required
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input type="text" name="category" id="category" defaultValue="Umum"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="description" id="description" rows={2}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" disabled={pending}
          className="min-h-[44px] px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors">
          {pending ? 'Menyimpan...' : 'Tambah Foto'}
        </button>
      </form>
    </div>
  );
}

export function GaleriDeleteForm({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('Hapus foto ini?')) return;
    const fd = new FormData();
    fd.append('id', id);
    await deleteGaleri(fd);
  }

  return (
    <button onClick={handleDelete}
      className="text-red-600 hover:text-red-800 text-xs font-medium min-h-[44px]">
      Hapus
    </button>
  );
}
