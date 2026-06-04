'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { createDonation } from '@/src/app/actions/create-donation';

const KECAMATAN_LIST = [
  'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
  'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
  'Proppo', 'Tlanakan', 'Waru',
];

const JENIS_DONASI_OPTIONS = [
  { value: 'INFAK_UMUM', label: 'Infak Umum' },
  { value: 'INFAK_DAKWAH', label: 'Infak Dakwah' },
  { value: 'INFAK_SOSIAL', label: 'Infak Sosial' },
  { value: 'INFAK_PENDIDIKAN', label: 'Infak Pendidikan' },
];

const NOMINAL_PRESETS = [25000, 50000, 100000, 250000, 500000, 1000000];

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
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'pending' | 'error'>('idle');
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [customNominal, setCustomNominal] = useState('');
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Sinkronisasi dengan state high-contrast dari root
    const hc = localStorage.getItem('accessibility_high_contrast');
    if (hc === 'true') setIsHighContrast(true);

    // Load Midtrans Snap.js
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
  };

  const handleCustomNominalChange = (value: string) => {
    setCustomNominal(value);
    setSelectedNominal(null);
  };

  const getFinalNominal = (): number => {
    if (selectedNominal) return selectedNominal;
    return parseInt(customNominal, 10) || 0;
  };

  const handleAction = (formData: FormData) => {
    setErrorMsg(null);
    setPaymentStatus('idle');

    const finalNominal = getFinalNominal();
    if (finalNominal < 10000) {
      setErrorMsg('Minimal donasi adalah Rp 10.000.');
      return;
    }

    // Set jumlah_donasi ke formData
    formData.set('jumlah_donasi', String(finalNominal));

    startTransition(async () => {
      try {
        const response = await createDonation(formData);

        if (response.success && response.snap_token) {
          // Buka Midtrans Snap popup
          if (window.snap) {
            window.snap.pay(response.snap_token, {
              onSuccess: () => setPaymentStatus('success'),
              onPending: () => setPaymentStatus('pending'),
              onError: () => setPaymentStatus('error'),
              onClose: () => {
                // User menutup popup tanpa menyelesaikan pembayaran
              },
            });
          } else {
            // Fallback: redirect ke Midtrans jika Snap.js belum loaded
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
      }
    });
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Styling classes
  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

  const inputClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
    : 'bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-green-200 text-gray-900';

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

      <form action={handleAction} className="space-y-6">
        {/* Nama Donatur */}
        <div className="space-y-2">
          <label htmlFor="nama_donatur" className="block font-bold">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="nama_donatur"
            name="nama_donatur"
            required
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
          />
        </div>

        {/* Email (opsional) */}
        <div className="space-y-2">
          <label htmlFor="email" className="block font-bold">
            Email <span className="font-normal opacity-70">(opsional, untuk bukti transfer)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
          />
        </div>

        {/* Nomor WhatsApp */}
        <div className="space-y-2">
          <label htmlFor="nomor_whatsapp" className="block font-bold">
            Nomor WhatsApp
          </label>
          <input
            type="tel"
            id="nomor_whatsapp"
            name="nomor_whatsapp"
            required
            placeholder="628xxxxxxxxxx"
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
          />
        </div>

        {/* Kecamatan */}
        <div className="space-y-2">
          <label htmlFor="kecamatan" className="block font-bold">
            Kecamatan Domisili
          </label>
          <select
            id="kecamatan"
            name="kecamatan"
            required
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
          >
            <option value="">-- Pilih Kecamatan --</option>
            {KECAMATAN_LIST.map((kec) => (
              <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
        </div>

        {/* Jenis Donasi */}
        <div className="space-y-2">
          <label htmlFor="jenis_donasi" className="block font-bold">
            Jenis Donasi
          </label>
          <select
            id="jenis_donasi"
            name="jenis_donasi"
            required
            className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
          >
            <option value="">-- Pilih Jenis Donasi --</option>
            {JENIS_DONASI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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
              className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
            />
          </div>
          {/* Hidden input untuk form submission */}
          <input type="hidden" name="jumlah_donasi" value={getFinalNominal() || ''} />
        </div>

        {/* Pesan Donatur */}
        <div className="space-y-2">
          <label htmlFor="pesan_donatur" className="block font-bold">
            Pesan / Doa <span className="font-normal opacity-70">(opsional)</span>
          </label>
          <textarea
            id="pesan_donatur"
            name="pesan_donatur"
            rows={3}
            placeholder="Semoga berkah dan bermanfaat..."
            className={`w-full min-h-[44px] p-4 rounded outline-none resize-y transition-all ${inputClass}`}
          />
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
