'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { submitAspirasi } from '@/src/app/actions/submit-aspirasi';

const KECAMATAN_LIST = [
  'Batumarmar',
  'Galis',
  'Kadur',
  'Larangan',
  'Pademawu',
  'Pakong',
  'Palengaan',
  'Pamekasan',
  'Pasean',
  'Pegantenan',
  'Proppo',
  'Tlanakan',
  'Waru',
];

export default function AspirasiForm() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [formResult, setFormResult] = useState<{
    routing: string;
    nama_pelapor: string;
    kecamatan: string;
    isi_aspirasi: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const savedContrast = localStorage.getItem('accessibility_high_contrast');
    if (savedContrast === 'true') setIsHighContrast(true);

    const savedFontSize = localStorage.getItem('accessibility_font_size');
    if (savedFontSize) setFontSizeScale(parseFloat(savedFontSize));
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('accessibility_high_contrast', String(newValue));
  };

  const increaseFontSize = () => {
    setFontSizeScale((prev) => {
      const next = Math.min(prev + 0.2, 1.6);
      localStorage.setItem('accessibility_font_size', String(next));
      return next;
    });
  };

  const decreaseFontSize = () => {
    setFontSizeScale((prev) => {
      const next = Math.max(prev - 0.2, 0.8);
      localStorage.setItem('accessibility_font_size', String(next));
      return next;
    });
  };

  const handleAction = (formData: FormData) => {
    setErrorMsg(null);
    setFormResult(null);

    const nama_pelapor = formData.get('nama_pelapor')?.toString() || '';
    const kecamatan = formData.get('kecamatan')?.toString() || '';
    const isi_aspirasi = formData.get('isi_aspirasi')?.toString() || '';

    startTransition(async () => {
      try {
        const response = await submitAspirasi(formData);
        if (response.success) {
          setFormResult({
            routing: response.routing || 'Humas DPD PKS Pamekasan (Default)',
            nama_pelapor,
            kecamatan,
            isi_aspirasi,
          });
        } else {
          setErrorMsg(response.error || response.message || 'Gagal mengirim aspirasi.');
        }
      } catch (e: any) {
        setErrorMsg(e.message || 'Terjadi kesalahan tidak terduga');
      }
    });
  };

  const getWhatsAppLink = () => {
    if (!formResult) return '#';
    const phone = '6281234567890'; // Default representative number
    const encodedMessage = encodeURIComponent(
      `Halo, saya ${formResult.nama_pelapor} dari kecamatan ${formResult.kecamatan}. Saya baru saja mengirimkan aspirasi via sistem: "${formResult.isi_aspirasi}". Mohon info tindak lanjutnya.`
    );
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  // Set colors based on High Contrast Mode (#000000 background, #FFFF00 for text/borders)
  const wrapperClass = isHighContrast
    ? 'bg-[#000000] text-[#FFFF00] min-h-screen transition-colors duration-200'
    : 'bg-gray-50 text-gray-900 min-h-screen transition-colors duration-200';

  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm';

  const btnClass = isHighContrast
    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
    : 'bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-blue-300';

  const inputClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
    : 'bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-900';

  return (
    <div className={wrapperClass} style={{ fontSize: `${fontSizeScale}rem` }}>
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
            <form action={handleAction} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="nama_pelapor" className="block font-bold">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama_pelapor"
                  name="nama_pelapor"
                  required
                  className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nik" className="block font-bold">
                  NIK (16 Digit)
                </label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  required
                  pattern="\d{16}"
                  title="Harus berisi tepat 16 digit angka"
                  className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nomor_whatsapp" className="block font-bold">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  id="nomor_whatsapp"
                  name="nomor_whatsapp"
                  required
                  className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="kecamatan" className="block font-bold">
                  Kecamatan
                </label>
                <select
                  id="kecamatan"
                  name="kecamatan"
                  required
                  className={`w-full min-h-[44px] px-4 rounded outline-none transition-all ${inputClass}`}
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {KECAMATAN_LIST.map((kecamatan) => (
                    <option key={kecamatan} value={kecamatan}>
                      {kecamatan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="isi_aspirasi" className="block font-bold">
                  Isi Aspirasi
                </label>
                <textarea
                  id="isi_aspirasi"
                  name="isi_aspirasi"
                  required
                  rows={5}
                  className={`w-full min-h-[44px] p-4 rounded outline-none resize-y transition-all ${inputClass}`}
                />
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
