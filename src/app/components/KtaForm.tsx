'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitKta } from '@/src/app/actions/submit-kta';
import { ktaSchema, type KtaInput } from '@/src/validations/kta';
import { KECAMATAN } from '@/src/validations/index';
import { useAccessibility } from '@/src/hooks/useAccessibility';

export default function KtaForm() {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { isHighContrast } = useAccessibility();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<KtaInput>({
    resolver: zodResolver(ktaSchema),
    mode: 'onChange',
  });

  const nikValue = useWatch({ control, name: 'nik' });
  const phoneValue = useWatch({ control, name: 'nomor_whatsapp' });

  const fieldBorder = (field: keyof KtaInput) => {
    if (errors[field]) return 'border-red-500';
    const val = field === 'nik' ? nikValue : field === 'nomor_whatsapp' ? phoneValue : undefined;
    if (val && val.length > 0 && !errors[field]) return isHighContrast ? 'border-[#FFFF00]' : 'border-green-500';
    return '';
  };

  const inputClass = (field: keyof KtaInput) => {
    const extra = fieldBorder(field);
    if (isHighContrast) {
      return `w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 bg-[#000000] border-2 ${extra || 'border-[#FFFF00]'} text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]`;
    }
    return `w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 bg-white border-2 ${extra || 'border-gray-300'} text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200`;
  };

  const onSubmit = async (data: KtaInput) => {
    setErrorMsg(null);
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.set('nama_lengkap', data.nama_lengkap);
      formData.set('nik', data.nik);
      formData.set('nomor_whatsapp', data.nomor_whatsapp);
      formData.set('kecamatan', data.kecamatan);

      const response = await submitKta(formData);

      if (response.success) {
        setSuccessMsg(response.message || null);
      } else {
        setErrorMsg(response.error || 'Terjadi kesalahan saat memproses pendaftaran.');
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Terjadi kesalahan tidak terduga.';
      setErrorMsg(message);
    } finally {
      setIsPending(false);
    }
  };

  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';



  const labelClass = isHighContrast
    ? 'text-[#FFFF00] font-bold'
    : 'text-gray-800 font-bold';

  const btnClass = isHighContrast
    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
    : 'bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-300';

  const errorBannerClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-red-50 border-2 border-red-300 text-red-800';

  const successBannerClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-green-50 border-2 border-green-300 text-green-900';

  if (successMsg) {
    return (
      <div className={`rounded-xl p-6 sm:p-8 ${cardClass}`}>
        <div
          className={`p-6 rounded-lg ${successBannerClass}`}
          role="alert"
          aria-live="polite"
        >
          <div className="text-center">
            <div className="text-[3em] mb-4" aria-hidden="true">✅</div>
            <h2 className="text-[1.5em] font-bold mb-4">Pendaftaran KTA Berhasil!</h2>
            <p className="text-[1.125em] mb-4">{successMsg}</p>
            <p className="opacity-80 mb-8">
              Data NIK Anda telah dienkripsi dengan standar AES-256-GCM sebelum disimpan.
              Tim verifikasi DPD PKS Pamekasan akan menghubungi Anda melalui WhatsApp
              untuk proses selanjutnya.
            </p>
            <button
              type="button"
              onClick={() => setSuccessMsg(null)}
              className={`min-h-[44px] min-w-[44px] px-8 py-3 font-bold rounded-lg transition-all focus:outline-none focus:ring-4 ${btnClass}`}
            >
              Daftar Kader Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 sm:p-8 ${cardClass}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[2em] font-extrabold mb-2 leading-tight">
          Registrasi KTA Online Mandiri
        </h1>
        <p className="text-[1.125em] opacity-90">
          Daftarkan diri Anda sebagai kader resmi DPD PKS Kabupaten Pamekasan.
          Identitas Anda dilindungi enkripsi AES-256-GCM sebelum masuk ke database.
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div
          className={`mb-6 p-4 rounded-lg ${errorBannerClass}`}
          role="alert"
          aria-live="assertive"
        >
          <p className="font-bold text-[1.125em]">Pendaftaran Gagal</p>
          <p className="mt-1">{errorMsg}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <label htmlFor="kta_nama_lengkap" className={`block ${labelClass}`}>
            Nama Lengkap <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="kta_nama_lengkap"
            autoComplete="name"
            placeholder="Masukkan nama lengkap sesuai KTP"
            className={`w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200'}`}
            {...register('nama_lengkap')}
          />
          {errors.nama_lengkap && (
            <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap.message}</p>
          )}
        </div>

        {/* NIK */}
        <div className="space-y-2">
          <label htmlFor="kta_nik" className={`block ${labelClass}`}>
            NIK (16 Digit) <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="kta_nik"
            inputMode="numeric"
            maxLength={16}
            title="NIK harus berupa tepat 16 digit angka"
            placeholder="Masukkan 16 digit NIK Anda"
            autoComplete="off"
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
          <p className="text-sm opacity-70 mt-2">
            NIK akan dienkripsi dengan AES-256-GCM sebelum disimpan ke database.
          </p>
        </div>

        {/* Nomor WhatsApp */}
        <div className="space-y-2">
          <label htmlFor="kta_nomor_whatsapp" className={`block ${labelClass}`}>
            Nomor WhatsApp Aktif <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            type="tel"
            id="kta_nomor_whatsapp"
            placeholder="Contoh: 628123456789"
            autoComplete="tel"
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
          <p className="text-sm opacity-70 mt-2">
            Digunakan tim DPD untuk konfirmasi verifikasi keanggotaan.
          </p>
        </div>

        {/* Kecamatan */}
        <div className="space-y-2">
          <label htmlFor="kta_kecamatan" className={`block ${labelClass}`}>
            Kecamatan Domisili <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="kta_kecamatan"
            className={`w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200'}`}
            {...register('kecamatan')}
          >
            <option value="">-- Pilih Kecamatan di Pamekasan --</option>
            {KECAMATAN.map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>
          {errors.kecamatan && (
            <p className="text-red-500 text-sm mt-1">{errors.kecamatan.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full min-h-[44px] px-6 py-4 font-bold text-[1.125em] rounded-lg transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
          >
            {isPending ? 'Mengenkripsi & Mengirim...' : 'Daftarkan KTA Saya'}
          </button>
        </div>
      </form>

      {/* Privacy Footer */}
      <div className="mt-8 pt-6 border-t border-current opacity-70">
        <p className="text-sm text-center leading-relaxed">
          Dengan mengirimkan formulir ini, Anda menyetujui bahwa data akan diproses
          sesuai kebijakan privasi DPD PKS Kabupaten Pamekasan. NIK dienkripsi dengan
          algoritma AES-256-GCM dan tidak dapat diakses oleh pihak yang tidak berwenang.
        </p>
      </div>
    </div>
  );
}
