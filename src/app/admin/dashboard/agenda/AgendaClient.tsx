'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadButton } from '@uploadthing/react';
import { createAgendaSchema, type CreateAgendaInput } from '@/src/validations/cms/agenda';
import { createAgenda, deleteAgenda } from '@/src/app/actions/cms/agenda';
import type { OurFileRouter } from '@/src/lib/uploadthing';
import ConfirmModal from '@/src/components/ConfirmModal';
import LoadingOverlay from '@/src/components/LoadingOverlay';

export function AgendaForm() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAgendaInput>({
    resolver: zodResolver(createAgendaSchema),
  });

  async function onSubmit(data: CreateAgendaInput) {
    setPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('date', data.date);
    if (data.description) formData.set('description', data.description);
    if (data.time_start) formData.set('time_start', data.time_start);
    if (data.time_end) formData.set('time_end', data.time_end);
    if (data.location) formData.set('location', data.location);
    if (data.image_url) formData.set('image_url', data.image_url);

    const result = await createAgenda(formData);

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
      {pending && <LoadingOverlay label="Menyimpan agenda..." />}
      <h2 className="font-bold text-[1.125em] mb-4">Tambah Agenda Baru</h2>
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
            <input type="date" id="date" disabled={pending} {...register('date')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input type="text" id="location" disabled={pending} {...register('location')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
            <input type="time" id="time_start" disabled={pending} {...register('time_start')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {errors.time_start && <p className="text-red-600 text-xs mt-1">{errors.time_start.message}</p>}
          </div>
          <div>
            <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
            <input type="time" id="time_end" disabled={pending} {...register('time_end')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            {errors.time_end && <p className="text-red-600 text-xs mt-1">{errors.time_end.message}</p>}
          </div>
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
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea id="description" rows={4} disabled={pending} {...register('description')}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
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
  const [showModal, setShowModal] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const fd = new FormData();
    fd.append('id', id);
    await deleteAgenda(fd);
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
        title="Hapus Agenda"
        message="Apakah Anda yakin ingin menghapus agenda ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="danger"
        loading={pending}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
