'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadButton } from '@uploadthing/react';
import { createGaleriSchema, type CreateGaleriInput } from '@/src/validations/cms/galeri';
import { createGaleri, deleteGaleri } from '@/src/app/actions/cms/galeri';
import type { OurFileRouter } from '@/src/lib/uploadthing';
import ConfirmModal from '@/src/components/ConfirmModal';
import LoadingOverlay from '@/src/components/LoadingOverlay';

export function GaleriForm() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateGaleriInput>({
    resolver: zodResolver(createGaleriSchema),
    defaultValues: { category: 'Umum' },
  });

  async function onSubmit(data: CreateGaleriInput) {
    setPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('image_url', data.image_url);
    if (data.description) formData.set('description', data.description);
    if (data.category) formData.set('category', data.category);

    const result = await createGaleri(formData);

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
      {pending && <LoadingOverlay label="Menyimpan foto..." />}
      <h2 className="font-bold text-[1.125em] mb-4">Tambah Foto Baru</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar *</label>
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
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input type="text" id="category" disabled={pending} {...register('category')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea id="description" rows={2} disabled={pending} {...register('description')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
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
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const fd = new FormData();
    fd.append('id', id);
    await deleteGaleri(fd);
    setPending(false);
    setShowModal(false);
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 text-xs font-medium min-h-[44px]">
        Hapus
      </button>
      <ConfirmModal
        open={showModal}
        title="Hapus Foto"
        message="Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="danger"
        loading={pending}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
