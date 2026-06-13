'use client';

import React, { useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitAspirasi } from '@/src/app/actions/submit-aspirasi';
import { aspirasiSchema, type AspirasiInput } from '@/src/validations/aspirasi';
import { KECAMATAN } from '@/src/validations/index';
import { useAccessibility } from '@/src/hooks/useAccessibility';

export default function AspirasiForm() {
  const [isPending, startTransition] = useTransition();

  const [formResult, setFormResult] = useState<{
    routing: string;
    staff_phone: string;
    nama_pelapor: string;
    kecamatan: string;
    isi_aspirasi: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    isHighContrast,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
  } = useAccessibility();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<AspirasiInput>({
    resolver: zodResolver(aspirasiSchema),
    mode: 'onChange',
  });

  const nikValue = useWatch({ control, name: 'nik' });
  const phoneValue = useWatch({ control, name: 'nomor_whatsapp' });

  const fieldBorder = (field: keyof AspirasiInput) => {
    if (errors[field]) return isHighContrast ? 'border-red-400' : 'border-red-500';
    const val = field === 'nik' ? nikValue : field === 'nomor_whatsapp' ? phoneValue : undefined;
    if (val && val.length > 0 && !errors[field]) return isHighContrast ? 'border-[#FFFF00]' : 'border-green-500';
    return '';
  };

  const onSubmit = (formData: AspirasiInput) => {
    setErrorMsg(null);
    setFormResult(null);

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set('nama_pelapor', formData.nama_pelapor);
        fd.set('nik', formData.nik);
        fd.set('nomor_whatsapp', formData.nomor_whatsapp);
        fd.set('kecamatan', formData.kecamatan);
        fd.set('isi_aspirasi', formData.isi_aspirasi);

        const response = await submitAspirasi(fd);
        if (response.success) {
          setFormResult({
            routing: response.routing || 'Humas DPD PKS Pamekasan (Default)',
            staff_phone: response.staff_phone || '6284444444444',
            nama_pelapor: formData.nama_pelapor,
            kecamatan: formData.kecamatan,
            isi_aspirasi: formData.isi_aspirasi,
          });
        } else {
          setErrorMsg(response.error || response.message || 'Gagal mengirim aspirasi.');
        }
      } catch (e: unknown) {
        setErrorMsg(e instanceof Error ? e.message : 'Terjadi kesalahan tidak terduga');
      }
    });
  };

  const getWhatsAppLink = () => {
    if (!formResult) return '#';
    const encodedMessage = encodeURIComponent(
      `BISMILLAH - ASPIRASI WARGA PAMEKASAN\n\n*Nama Pelapor*: ${formResult.nama_pelapor}\n*Domisili*: Kecamatan ${formResult.kecamatan}\n*Isi Pengaduan*: "${formResult.isi_aspirasi}"\n\n_Aspirasi dikirim resmi melalui Portal E-Aspirasi DPD PKS Pamekasan._`
    );
    return `https://wa.me/${formResult.staff_phone}?text=${encodedMessage}`;
  };

  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm';

  const btnClass = isHighContrast
    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
    : 'bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-300';

  const inputClass = (field: keyof AspirasiInput) => {
    const extra = fieldBorder(field);
    if (isHighContrast) {
      return `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 ${extra || 'border-[#FFFF00]'} text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]`;
    }
    return `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${extra || 'border-gray-300'} focus:border-blue-500 focus:ring-blue-200 text-gray-900`;
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className={`rounded-xl p-6 sm:p-8 mb-8 ${cardClass}`}>
          {/* Accessibility Toolbar */}
          <div className="flex flex-wrap gap-4 justify-end mb-8 border-b pb-4 border-current">
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`min-h-[44px] min-w-[44px] px-4 font-bold rounded focus:ring-4 focus:outline-none transition-colors ${
                isHighContrast
                  ? 'bg-[#FFFF00] text-[#000000] focus:ring-[#FFFF00]'
                  : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-300'
              }`}
              aria-label="Toggle High Contrast Mode"
            >
              {isHighContrast ? 'Matikan Kontras Tinggi' : 'Kontras Tinggi'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={decreaseFontSize}
                className={`min-h-[44px] min-w-[44px] px-4 font-bold rounded focus:ring-4 focus:outline-none transition-colors ${
                  isHighContrast
                    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] focus:ring-[#FFFF00]'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400'
                }`}
                aria-label="Perkecil Ukuran Teks"
              >
                A-
              </button>
              <button
                type="button"
                onClick={increaseFontSize}
                className={`min-h-[44px] min-w-[44px] px-4 font-bold rounded focus:ring-4 focus:outline-none transition-colors ${
                  isHighContrast
                    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] focus:ring-[#FFFF00]'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400'
                }`}
                aria-label="Perbesar Ukuran Teks"
              >
                A+
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-[2em] font-extrabold mb-2 leading-tight">
              Formulir Pengaduan Aspirasi
            </h1>
            <p className="text-[1.125em] opacity-90">
              Sampaikan aspirasi dan laporan Anda untuk pembangunan Kabupaten Pamekasan secara inklusif.
            </p>
          </div>

          {errorMsg && (
            <div
              className={`mb-8 p-6 rounded-lg border-2 ${
                isHighContrast ? 'bg-[#000000] border-[#FFFF00] text-[#FFFF00]' : 'bg-red-50 border-red-300 text-red-800'
              }`}
              role="alert"
              aria-live="assertive"
            >
              <p className="font-bold text-[1.125em]">Gagal Mengirim Aspirasi</p>
              <p className="mt-2">{errorMsg}</p>
            </div>
          )}

          {!formResult ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="nama_pelapor" className="block font-bold">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama_pelapor"
                  className={inputClass('nama_pelapor')}
                  {...register('nama_pelapor')}
                />
                {errors.nama_pelapor && <p className="text-red-500 text-sm mt-1">{errors.nama_pelapor.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="nik" className="block font-bold">
                  NIK (16 Digit)
                </label>
                <input
                  type="text"
                  id="nik"
                  inputMode="numeric"
                  maxLength={16}
                  className={inputClass('nik')}
                  {...register('nik')}
                />
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className={isHighContrast ? 'text-[#FFFF00]' : 'text-gray-500'}>
                    {(nikValue || '').length}/16 digit
                  </span>
                  {(nikValue || '').length === 16 && !errors.nik && (
                    <span className={isHighContrast ? 'text-[#FFFF00]' : 'text-green-600'}>✓ NIK valid</span>
                  )}
                  {errors.nik && (
                    <span className="text-red-500">{errors.nik.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="nomor_whatsapp" className="block font-bold">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  id="nomor_whatsapp"
                  placeholder="628xxxxxxxxxx"
                  className={inputClass('nomor_whatsapp')}
                  {...register('nomor_whatsapp')}
                />
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className={isHighContrast ? 'text-[#FFFF00]' : 'text-gray-500'}>
                    Format: 62 diikuti 10-15 digit angka
                  </span>
                  {phoneValue && phoneValue.length > 0 && !errors.nomor_whatsapp && (
                    <span className={isHighContrast ? 'text-[#FFFF00]' : 'text-green-600'}>✓</span>
                  )}
                  {errors.nomor_whatsapp && (
                    <span className="text-red-500">{errors.nomor_whatsapp.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="kecamatan" className="block font-bold">
                  Kecamatan
                </label>
                <select
                  id="kecamatan"
                  className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-900'}`}
                  {...register('kecamatan')}
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {KECAMATAN.map((kecamatan) => (
                    <option key={kecamatan} value={kecamatan}>
                      {kecamatan}
                    </option>
                  ))}
                </select>
                {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="isi_aspirasi" className="block font-bold">
                  Isi Aspirasi
                </label>
                <textarea
                  id="isi_aspirasi"
                  rows={5}
                  className={`w-full min-h-[44px] p-4 rounded outline-none resize-y transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-900'}`}
                  {...register('isi_aspirasi')}
                />
                {errors.isi_aspirasi && <p className="text-red-500 text-sm mt-1">{errors.isi_aspirasi.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full min-h-[44px] px-6 py-3 font-bold text-[1.125em] rounded transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
              >
                {isPending ? 'Sedang Memproses...' : 'Kirim Aspirasi'}
              </button>
            </form>
          ) : (
            <div
              className={`p-6 rounded-lg border-2 ${
                isHighContrast ? 'bg-[#000000] border-[#FFFF00] text-[#FFFF00]' : 'bg-green-50 border-green-300 text-green-900'
              }`}
              role="status"
              aria-live="polite"
            >
              <h2 className="text-[1.5em] font-bold mb-4">Pengiriman Berhasil!</h2>
              <p className="mb-4 text-[1.125em]">
                Aspirasi Anda berhasil diteruskan ke <strong>{formResult.routing}</strong>.
              </p>
              
              <div className="mt-8">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full sm:w-auto min-h-[44px] px-8 py-3 font-bold rounded transition-all focus:outline-none focus:ring-4 ${
                    isHighContrast
                      ? 'bg-[#FFFF00] text-[#000000] hover:bg-[#cccc00] focus:ring-[#FFFF00]'
                      : 'bg-[#25D366] text-white hover:bg-[#1DA851] focus:ring-green-400'
                  }`}
                >
                  Lanjutkan ke WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
