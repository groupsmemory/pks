'use client';

import { useState } from 'react';
import { createAgenda, deleteAgenda } from '@/src/app/actions/cms/agenda';

export function AgendaForm() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createAgenda(formData);

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
      <h2 className="font-bold text-[1.125em] mb-4">Tambah Agenda Baru</h2>
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
            <input type="date" name="date" id="date" required
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input type="text" name="location" id="location"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
            <input type="time" name="time_start" id="time_start"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
            <input type="time" name="time_end" id="time_end"
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
          <input type="url" name="image_url" id="image_url"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea name="description" id="description" rows={4}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" disabled={pending}
          className="min-h-[44px] px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors">
          {pending ? 'Menyimpan...' : 'Tambah Agenda'}
        </button>
      </form>
    </div>
  );
}

export function AgendaDeleteForm({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('Hapus agenda ini?')) return;
    const fd = new FormData();
    fd.append('id', id);
    await deleteAgenda(fd);
  }

  return (
    <button onClick={handleDelete}
      className="text-red-600 hover:text-red-800 text-xs font-medium min-h-[44px] px-2">
      Hapus
    </button>
  );
}
