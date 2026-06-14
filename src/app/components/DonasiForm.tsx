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
import FormField from './shared/FormField';
import SelectField from './shared/SelectField';
import TextAreaField from './shared/TextAreaField';
import ErrorAlert from './shared/ErrorAlert';

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

function PhoneField({
  value,
  error,
  highContrast,
  register,
}: {
  value: string | undefined;
  error?: string;
  highContrast?: boolean;
  register: ReturnType<typeof useForm<DonasiInput>>['register'];
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
            : `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${error ? 'border-red-500' : 'border-gray-300'} focus:border-green-500 focus:ring-green-200 text-gray-900`
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

function NominalSelector({
  selectedNominal,
  customNominal,
  onSelectNominal,
  onCustomChange,
  highContrast,
}: {
  selectedNominal: number | null;
  customNominal: string;
  onSelectNominal: (nominal: number) => void;
  onCustomChange: (value: string) => void;
  highContrast?: boolean;
}) {
  const btnClass = (isActive: boolean) =>
    highContrast
      ? `border-2 ${isActive ? 'bg-[#FFFF00] text-[#000000] border-[#FFFF00]' : 'bg-[#000000] text-[#FFFF00] border-[#FFFF00]'}`
      : `border-2 ${isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'}`;

  const customCls = highContrast
    ? 'w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
    : 'w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900';

  return (
    <div className="space-y-3">
      <label className="block font-bold">Nominal Donasi</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {NOMINAL_PRESETS.map((nominal) => (
          <button
            key={nominal}
            type="button"
            onClick={() => onSelectNominal(nominal)}
            className={`min-h-[44px] px-3 py-2 rounded font-semibold transition-all focus:outline-none focus:ring-4 ${btnClass(selectedNominal === nominal)}`}
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
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Contoh: 75000"
          className={customCls}
        />
      </div>
    </div>
  );
}

function PaymentSuccess({ highContrast }: { highContrast?: boolean }) {
  const cardClass = highContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

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

function PaymentPending({ highContrast }: { highContrast?: boolean }) {
  const cardClass = highContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

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

  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

  const btnPrimaryClass = isHighContrast
    ? 'bg-[#FFFF00] text-[#000000] hover:bg-[#cccc00] focus:ring-[#FFFF00]'
    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300';

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

  if (paymentStatus === 'success') {
    return <PaymentSuccess highContrast={isHighContrast} />;
  }

  if (paymentStatus === 'pending') {
    return <PaymentPending highContrast={isHighContrast} />;
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
        <ErrorAlert
          title="Gagal Memproses Donasi"
          message={errorMsg}
          highContrast={isHighContrast}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          id="nama_donatur"
          label="Nama Lengkap"
          error={errors.nama_donatur?.message}
          highContrast={isHighContrast}
          {...register('nama_donatur')}
        />

        <FormField
          id="email"
          label="Email (opsional, untuk bukti transfer)"
          error={errors.email?.message}
          highContrast={isHighContrast}
          placeholder="contoh@email.com"
          {...register('email')}
        />

        <PhoneField
          value={phoneValue}
          error={errors.nomor_whatsapp?.message}
          highContrast={isHighContrast}
          register={register}
        />

        <SelectField
          id="kecamatan"
          label="Kecamatan Domisili"
          error={errors.kecamatan?.message}
          highContrast={isHighContrast}
          placeholder="-- Pilih Kecamatan --"
          options={KECAMATAN.map((k) => ({ value: k, label: k }))}
          {...register('kecamatan')}
        />

        <SelectField
          id="jenis_donasi"
          label="Jenis Donasi"
          error={errors.jenis_donasi?.message}
          highContrast={isHighContrast}
          placeholder="-- Pilih Jenis Donasi --"
          options={JENIS_DONASI.map((opt) => ({ value: opt, label: JENIS_DONASI_LABEL[opt] || opt }))}
          {...register('jenis_donasi')}
        />

        <NominalSelector
          selectedNominal={selectedNominal}
          customNominal={customNominal}
          onSelectNominal={handleNominalSelect}
          onCustomChange={handleCustomNominalChange}
          highContrast={isHighContrast}
        />

        <input type="hidden" {...register('jumlah_donasi')} />
        {errors.jumlah_donasi && <p className="text-red-500 text-sm mt-1">{errors.jumlah_donasi.message}</p>}

        <TextAreaField
          id="pesan_donatur"
          label="Pesan / Doa (opsional)"
          error={errors.pesan_donatur?.message}
          highContrast={isHighContrast}
          rows={3}
          placeholder="Semoga berkah dan bermanfaat..."
          {...register('pesan_donatur')}
        />

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
