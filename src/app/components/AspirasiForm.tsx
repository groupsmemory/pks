'use client';

import React, { useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitAspirasi } from '@/src/app/actions/submit-aspirasi';
import { aspirasiSchema, type AspirasiInput } from '@/src/validations/aspirasi';
import { KECAMATAN } from '@/src/validations/index';
import { useAccessibility } from '@/src/hooks/useAccessibility';
import AccessibilityToolbar from './shared/AccessibilityToolbar';
import FormField from './shared/FormField';
import SelectField from './shared/SelectField';
import TextAreaField from './shared/TextAreaField';
import ErrorAlert from './shared/ErrorAlert';

interface FormResult {
  routing: string;
  staff_phone: string;
  nama_pelapor: string;
  kecamatan: string;
  isi_aspirasi: string;
}

function NIKField({
  value,
  error,
  highContrast,
  register,
}: {
  value: string | undefined;
  error?: string;
  highContrast?: boolean;
  register: ReturnType<typeof useForm<AspirasiInput>>['register'];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="nik" className="block font-bold">
        NIK (16 Digit)
      </label>
      <input
        type="text"
        id="nik"
        inputMode="numeric"
        maxLength={16}
        className={
          highContrast
            ? 'w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
            : `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${error ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-200 text-gray-900`
        }
        {...register('nik')}
      />
      <div className="flex items-center gap-2 text-xs mt-1">
        <span className={highContrast ? 'text-[#FFFF00]' : 'text-gray-500'}>
          {(value || '').length}/16 digit
        </span>
        {(value || '').length === 16 && !error && (
          <span className={highContrast ? 'text-[#FFFF00]' : 'text-green-600'}>✓ NIK valid</span>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
}

function PhoneField({
  value,
  error,
  highContrast,
  register,
}: {
  value: string | undefined;
  error?: string;
  highContrast?: boolean;
  register: ReturnType<typeof useForm<AspirasiInput>>['register'];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="nomor_whatsapp" className="block font-bold">
        Nomor WhatsApp
      </label>
      <input
        type="tel"
        id="nomor_whatsapp"
        placeholder="628xxxxxxxxxx"
        className={
          highContrast
            ? 'w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
            : `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${error ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-200 text-gray-900`
        }
        {...register('nomor_whatsapp')}
      />
      <div className="flex items-center gap-2 text-xs mt-1">
        <span className={highContrast ? 'text-[#FFFF00]' : 'text-gray-500'}>
          Format: 62 diikuti 10-15 digit angka
        </span>
        {value && value.length > 0 && !error && (
          <span className={highContrast ? 'text-[#FFFF00]' : 'text-green-600'}>✓</span>
        )}
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
}

function SuccessResult({ result, highContrast }: { result: FormResult; highContrast?: boolean }) {
  const encoded = encodeURIComponent(
    `BISMILLAH - ASPIRASI WARGA PAMEKASAN\n\n*Nama Pelapor*: ${result.nama_pelapor}\n*Domisili*: Kecamatan ${result.kecamatan}\n*Isi Pengaduan*: "${result.isi_aspirasi}"\n\n_Aspirasi dikirim resmi melalui Portal E-Aspirasi DPD PKS Pamekasan._`
  );
  const waLink = `https://wa.me/${result.staff_phone}?text=${encoded}`;

  return (
    <div
      className={`p-6 rounded-lg border-2 ${
        highContrast ? 'bg-[#000000] border-[#FFFF00] text-[#FFFF00]' : 'bg-green-50 border-green-300 text-green-900'
      }`}
      role="status"
      aria-live="polite"
    >
      <h2 className="text-[1.5em] font-bold mb-4">Pengiriman Berhasil!</h2>
      <p className="mb-4 text-[1.125em]">
        Aspirasi Anda berhasil diteruskan ke <strong>{result.routing}</strong>.
      </p>
      <div className="mt-8">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center w-full sm:w-auto min-h-[44px] px-8 py-3 font-bold rounded transition-all focus:outline-none focus:ring-4 ${
            highContrast
              ? 'bg-[#FFFF00] text-[#000000] hover:bg-[#cccc00] focus:ring-[#FFFF00]'
              : 'bg-[#25D366] text-white hover:bg-[#1DA851] focus:ring-green-400'
          }`}
        >
          Lanjutkan ke WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function AspirasiForm() {
  const [isPending, startTransition] = useTransition();
  const [formResult, setFormResult] = useState<FormResult | null>(null);
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
    control,
    formState: { errors },
  } = useForm<AspirasiInput>({
    resolver: zodResolver(aspirasiSchema),
    mode: 'onChange',
  });

  const nikValue = useWatch({ control, name: 'nik' });
  const phoneValue = useWatch({ control, name: 'nomor_whatsapp' });

  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm';

  const btnClass = isHighContrast
    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
    : 'bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-300';

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

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className={`rounded-xl p-6 sm:p-8 mb-8 ${cardClass}`}>
          <AccessibilityToolbar
            isHighContrast={isHighContrast}
            onToggleHighContrast={toggleHighContrast}
            onDecreaseFont={decreaseFontSize}
            onIncreaseFont={increaseFontSize}
          />

          <div className="mb-8">
            <h1 className="text-[2em] font-extrabold mb-2 leading-tight">
              Formulir Pengaduan Aspirasi
            </h1>
            <p className="text-[1.125em] opacity-90">
              Sampaikan aspirasi dan laporan Anda untuk pembangunan Kabupaten Pamekasan secara inklusif.
            </p>
          </div>

          {errorMsg && (
            <ErrorAlert
              title="Gagal Mengirim Aspirasi"
              message={errorMsg}
              highContrast={isHighContrast}
            />
          )}

          {!formResult ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                id="nama_pelapor"
                label="Nama Lengkap"
                error={errors.nama_pelapor?.message}
                highContrast={isHighContrast}
                {...register('nama_pelapor')}
              />

              <NIKField
                value={nikValue}
                error={errors.nik?.message}
                highContrast={isHighContrast}
                register={register}
              />

              <PhoneField
                value={phoneValue}
                error={errors.nomor_whatsapp?.message}
                highContrast={isHighContrast}
                register={register}
              />

              <SelectField
                id="kecamatan"
                label="Kecamatan"
                error={errors.kecamatan?.message}
                highContrast={isHighContrast}
                placeholder="-- Pilih Kecamatan --"
                options={KECAMATAN.map((k) => ({ value: k, label: k }))}
                {...register('kecamatan')}
              />

              <TextAreaField
                id="isi_aspirasi"
                label="Isi Aspirasi"
                error={errors.isi_aspirasi?.message}
                highContrast={isHighContrast}
                rows={5}
                {...register('isi_aspirasi')}
              />

              <button
                type="submit"
                disabled={isPending}
                className={`w-full min-h-[44px] px-6 py-3 font-bold text-[1.125em] rounded transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
              >
                {isPending ? 'Sedang Memproses...' : 'Kirim Aspirasi'}
              </button>
            </form>
          ) : (
            <SuccessResult result={formResult} highContrast={isHighContrast} />
          )}
        </div>
      </div>
    </div>
  );
}
