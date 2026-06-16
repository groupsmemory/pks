'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadButton } from '@uploadthing/react';
import { createBeritaSchema, type CreateBeritaInput } from '@/src/validations/cms/berita';
import { createBerita, deleteBerita } from '@/src/app/actions/cms/berita';
import type { OurFileRouter } from '@/src/lib/uploadthing';
import ConfirmModal from '@/src/components/ConfirmModal';
import LoadingOverlay from '@/src/components/LoadingOverlay';

export function BeritaForm() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateBeritaInput>({
    resolver: zodResolver(createBeritaSchema),
  });

  async function onSubmit(data: CreateBeritaInput) {
    setPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('content', data.content);
    if (data.author) formData.set('author', data.author);
    if (data.image_url) formData.set('image_url', data.image_url);
    if (data.excerpt) formData.set('excerpt', data.excerpt);

    const result = await createBerita(formData);

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Berhasil disimpan.' });
      reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'Gagal menyimpan.' });
    }
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-8 relative">
      {pending && <LoadingOverlay label="Menyimpan berita..." />}
      <h2 className="font-bold text-[1.125em] mb-4">Tambah Berita Baru</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message.text}
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
          <input type="text" id="title" disabled={pending} {...register('title')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
            <input type="text" id="author" disabled={pending} {...register('author')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {errors.author && <p className="text-red-600 text-xs mt-1">{errors.author.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="url" id="image_url" disabled={pending} placeholder="URL gambar (atau upload di samping)" {...register('image_url')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <div className="shrink-0">
                <UploadButton<OurFileRouter, "cmsImage">
                  endpoint="cmsImage"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) setValue("image_url", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error", error);
                  }}
                  appearance={{
                    button: "bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors",
                    allowedContent: "hidden",
                  }}
                />
              </div>
            </div>
            {errors.image_url && <p className="text-red-600 text-xs mt-1">{errors.image_url.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
          <input type="text" id="tags" disabled={pending} placeholder="contoh: politik, daerah, pemilu" {...register('tags')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          {errors.tags && <p className="text-red-600 text-xs mt-1">{errors.tags.message}</p>}
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
          <textarea id="excerpt" rows={2} disabled={pending} {...register('excerpt')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          {errors.excerpt && <p className="text-red-600 text-xs mt-1">{errors.excerpt.message}</p>}
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Konten *</label>
          <textarea id="content" rows={10} disabled={pending} {...register('content')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono" />
          {errors.content && <p className="text-red-600 text-xs mt-1">{errors.content.message}</p>}
        </div>
        <button type="submit" disabled={pending}
          className="min-h-[44px] px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors">
          {pending ? 'Menyimpan...' : 'Terbitkan Berita'}
        </button>
      </form>
    </div>
  );
}

export function BeritaDeleteForm({ id }: { id: string }) {
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const fd = new FormData();
    fd.append('id', id);
    await deleteBerita(fd);
    setPending(false);
    setShowModal(false);
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 text-xs font-medium min-h-[44px] px-2">
        Hapus
      </button>
      <ConfirmModal
        open={showModal}
        title="Hapus Berita"
        message="Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="danger"
        loading={pending}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
