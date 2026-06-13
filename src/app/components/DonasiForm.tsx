'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDonation } from '@/src/app/actions/create-donation';
import { donasiSchema, type DonasiInput } from '@/src/validations/donasi';
import { KECAMATAN, JENIS_DONASI } from '@/src/validations/index';
import { JENIS_DONASI_LABEL, NOMINAL_PRESETS } from '@/src/lib/constants';
import { formatRupiah } from '@/src/lib/utils';
import { useAccessibility } from '@/src/hooks/useAccessibility';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: unknown) => void;
        onPending?: (result: unknown) => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

export default function DonasiForm() {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'pending' | 'error'>('idle');
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState('');

  const { isHighContrast } = useAccessibility();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<DonasiInput>({
    resolver: zodResolver(donasiSchema),
    defaultValues: { jumlah_donasi: undefined },
    mode: 'onChange',
  });

  const phoneValue = useWatch({ control, name: 'nomor_whatsapp' });

  const fieldBorder = (field: keyof DonasiInput) => {
    if (errors[field]) return isHighContrast ? 'border-red-400' : 'border-red-500';
    const val = field === 'nomor_whatsapp' ? phoneValue : undefined;
    if (val && val.length > 0 && !errors[field]) return isHighContrast ? 'border-[#FFFF00]' : 'border-green-500';
    return '';
  };

  const inputClass = (field: keyof DonasiInput) => {
    const extra = fieldBorder(field);
    if (isHighContrast) {
      return `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 ${extra || 'border-[#FFFF00]'} text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]`;
    }
    return `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${extra || 'border-gray-300'} focus:border-green-500 focus:ring-green-200 text-gray-900`;
  };

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    if (clientKey && !document.querySelector(`script[src="${snapUrl}"]`)) {
      const script = document.createElement('script');
      script.src = snapUrl;
      script.setAttribute('data-client-key', clientKey);
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleNominalSelect = (nominal: number) => {
    setSelectedNominal(nominal);
    setCustomNominal('');
    setValue('jumlah_donasi', nominal);
  };

  const handleCustomNominalChange = (value: string) => {
    setCustomNominal(value);
    setSelectedNominal(null);
    const parsed = parseInt(value, 10);
    setValue('jumlah_donasi', isNaN(parsed) ? undefined as any : parsed);
  };

  const getFinalNominal = (): number => {
    if (selectedNominal) return selectedNominal;
    return parseInt(customNominal, 10) || 0;
  };

  const onSubmit = async (data: DonasiInput) => {
    setErrorMsg(null);
    setPaymentStatus('idle');
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.set('nama_donatur', data.nama_donatur);
      formData.set('email', data.email || '');
      formData.set('nomor_whatsapp', data.nomor_whatsapp);
      formData.set('kecamatan', data.kecamatan);
      formData.set('jenis_donasi', data.jenis_donasi);
      formData.set('jumlah_donasi', String(data.jumlah_donasi));
      formData.set('pesan_donatur', data.pesan_donatur || '');

      const response = await createDonation(formData);

      if (response.success && response.snap_token) {
        if (window.snap) {
          window.snap.pay(response.snap_token, {
            onSuccess: () => setPaymentStatus('success'),
            onPending: () => setPaymentStatus('pending'),
            onError: () => setPaymentStatus('error'),
            onClose: () => {},
          });
        } else {
          if (response.snap_redirect_url) {
            window.location.href = response.snap_redirect_url;
          }
        }
      } else {
        setErrorMsg(response.error || 'Gagal membuat transaksi donasi.');
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



  const btnPrimaryClass = isHighContrast
    ? 'bg-[#FFFF00] text-[#000000] hover:bg-[#cccc00] focus:ring-[#FFFF00]'
    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300';

  const nominalBtnClass = (isActive: boolean) =>
    isHighContrast
      ? `border-2 ${isActive ? 'bg-[#FFFF00] text-[#000000] border-[#FFFF00]' : 'bg-[#000000] text-[#FFFF00] border-[#FFFF00]'}`
      : `border-2 ${isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'}`;

  if (paymentStatus === 'success') {
    return (
      <div className={`rounded-xl p-6 sm:p-8 ${cardClass}`}>
        <div className="text-center py-8">
          <div className="text-[3em] mb-4">✅</div>
          <h2 className="text-[1.5em] font-bold mb-4">Jazakallahu Khairan!</h2>
          <p className="text-[1.125em] mb-2">
            Donasi Anda telah berhasil diterima.
          </p>
          <p className="opacity-80">
            Semoga menjadi amal jariyah dan berkah bagi pembangunan umat di Kabupaten Pamekasan.
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <div className={`rounded-xl p-6 sm:p-8 ${cardClass}`}>
        <div className="text-center py-8">
          <div className="text-[3em] mb-4">⏳</div>
          <h2 className="text-[1.5em] font-bold mb-4">Menunggu Pembayaran</h2>
          <p className="text-[1.125em]">
            Silakan selesaikan pembayaran sesuai instruksi yang diberikan.
            Status akan diperbarui otomatis setelah pembayaran dikonfirmasi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 sm:p-8 ${cardClass}`}>
      <div className="mb-8">
        <h1 className="text-[2em] font-extrabold mb-2 leading-tight">
          Donasi &amp; Infak Kader
        </h1>
        <p className="text-[1.125em] opacity-90">
          Salurkan infak Anda untuk mendukung program dakwah dan sosial DPD PKS Kabupaten Pamekasan.
        </p>
      </div>

      {errorMsg && (
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            isHighContrast ? 'border-[#FFFF00] text-[#FFFF00]' : 'bg-red-50 border-red-300 text-red-800'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <p className="font-bold">Gagal Memproses Donasi</p>
          <p className="mt-1">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nama Donatur */}
        <div className="space-y-2">
          <label htmlFor="nama_donatur" className="block font-bold">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama_donatur"
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900'}`}
            {...register('nama_donatur')}
          />
          {errors.nama_donatur && <p className="text-red-500 text-sm mt-1">{errors.nama_donatur.message}</p>}
        </div>

        {/* Email (opsional) */}
        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold">
            Email <span className="font-normal opacity-70">(opsional, untuk bukti transfer)</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="contoh@email.com"
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900'}`}
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Nomor WhatsApp */}
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

        {/* Kecamatan */}
        <div className="space-y-2">
          <label htmlFor="kecamatan" className="block font-bold">
            Kecamatan Domisili
          </label>
          <select
            id="kecamatan"
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900'}`}
            {...register('kecamatan')}
          >
            <option value="">-- Pilih Kecamatan --</option>
            {KECAMATAN.map((kec) => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
          {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan.message}</p>}
        </div>

        {/* Jenis Donasi */}
        <div className="space-y-2">
          <label htmlFor="jenis_donasi" className="block font-bold">
            Jenis Donasi
          </label>
          <select
            id="jenis_donasi"
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900'}`}
            {...register('jenis_donasi')}
          >
            <option value="">-- Pilih Jenis Donasi --</option>
            {JENIS_DONASI.map((opt) => (
              <option key={opt} value={opt}>{JENIS_DONASI_LABEL[opt]}</option>
            ))}
          </select>
          {errors.jenis_donasi && <p className="text-red-500 text-sm mt-1">{errors.jenis_donasi.message}</p>}
        </div>

        {/* Nominal Donasi */}
        <div className="space-y-3">
          <label className="block font-bold">Nominal Donasi</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NOMINAL_PRESETS.map((nominal) => (
              <button
                key={nominal}
                type="button"
                onClick={() => handleNominalSelect(nominal)}
                className={`min-h-[44px] px-3 py-2 rounded font-semibold transition-all focus:outline-none focus:ring-4 ${nominalBtnClass(selectedNominal === nominal)}`}
              >
                {formatRupiah(nominal)}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label htmlFor="custom_nominal" className="block text-sm font-medium mb-1">
              Atau masukkan nominal lain (min. Rp 10.000):
            </label>
            <input
              type="number"
              id="custom_nominal"
              min="10000"
              max="100000000"
              step="1000"
              value={customNominal}
              onChange={(e) => handleCustomNominalChange(e.target.value)}
              placeholder="Contoh: 75000"
              className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900'}`}
            />
          </div>
          <input type="hidden" {...register('jumlah_donasi')} />
          {errors.jumlah_donasi && <p className="text-red-500 text-sm mt-1">{errors.jumlah_donasi.message}</p>}
        </div>

        {/* Pesan Donatur */}
        <div className="space-y-2">
          <label htmlFor="pesan_donatur" className="block font-bold">
            Pesan / Doa <span className="font-normal opacity-70">(opsional)</span>
          </label>
          <textarea
            id="pesan_donatur"
            rows={3}
            placeholder="Semoga berkah dan bermanfaat..."
            className={`w-full min-h-[44px] p-4 rounded outline-none resize-y transition-all ${isHighContrast ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]' : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900'}`}
            {...register('pesan_donatur')}
          />
          {errors.pesan_donatur && <p className="text-red-500 text-sm mt-1">{errors.pesan_donatur.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || getFinalNominal() < 10000}
          className={`w-full min-h-[44px] px-6 py-3 font-bold text-[1.125em] rounded transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${btnPrimaryClass}`}
        >
          {isPending ? 'Memproses...' : `Donasi ${getFinalNominal() >= 10000 ? formatRupiah(getFinalNominal()) : ''}`}
        </button>
      </form>
    </div>
  );
}
