'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface ModulItem {
  id: string;
  judul: string;
  kategori: string;
  ringkasan: string;
  poinPembelajaran: string[];
  narasumber: string;
  durasi: string;
}

interface JadwalItem {
  id: string;
  judul: string;
  hari: string;
  waktu: string;
  lokasi: string;
  metode: string;
  konselor: string;
}

interface RkiClientProps {
  modulData: ModulItem[];
  jadwalData: JadwalItem[];
}

const KATEGORI_OPTIONS = [
  { value: '', label: 'Semua Kategori' },
  { value: 'PARENTING', label: 'Parenting Islami' },
  { value: 'EKONOMI', label: 'Ekonomi Keluarga' },
  { value: 'KONSELING', label: 'Konseling' },
  { value: 'KESEHATAN', label: 'Kesehatan' },
];

const KATEGORI_BADGE: Record<string, string> = {
  PARENTING: 'bg-pink-100 text-pink-800',
  EKONOMI: 'bg-green-100 text-green-800',
  KONSELING: 'bg-blue-100 text-blue-800',
  KESEHATAN: 'bg-purple-100 text-purple-800',
};

export default function RkiClient({ modulData, jadwalData }: RkiClientProps) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [filterKategori, setFilterKategori] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'modul' | 'jadwal'>('modul');

  useEffect(() => {
    const rootHasContrast = document.documentElement.classList.contains('high-contrast');
    setIsHighContrast(rootHasContrast);

    const observer = new MutationObserver(() => {
      setIsHighContrast(document.documentElement.classList.contains('high-contrast'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const filteredModul = useMemo(() => {
    return modulData.filter((item) => {
      const matchesKategori = filterKategori === '' || item.kategori === filterKategori;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        item.judul.toLowerCase().includes(query) ||
        item.ringkasan.toLowerCase().includes(query) ||
        item.poinPembelajaran.some((p) => p.toLowerCase().includes(query));

      return matchesKategori && matchesSearch;
    });
  }, [modulData, filterKategori, searchQuery]);

  // Styling
  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

  const inputClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00]'
    : 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200';

  const tabActiveClass = isHighContrast
    ? 'bg-[#FFFF00] text-[#000000] font-bold'
    : 'bg-blue-600 text-white font-bold';

  const tabInactiveClass = isHighContrast
    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000]'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  const badgeClass = (kategori: string) =>
    isHighContrast
      ? 'bg-[#000000] border border-[#FFFF00] text-[#FFFF00]'
      : KATEGORI_BADGE[kategori] || 'bg-gray-100 text-gray-800';

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8" role="tablist" aria-label="Navigasi konten RKI">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'modul'}
          onClick={() => setActiveTab('modul')}
          className={`min-h-[44px] px-6 py-3 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            activeTab === 'modul' ? tabActiveClass : tabInactiveClass
          }`}
        >
          📚 Modul Edukasi
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'jadwal'}
          onClick={() => setActiveTab('jadwal')}
          className={`min-h-[44px] px-6 py-3 rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            activeTab === 'jadwal' ? tabActiveClass : tabInactiveClass
          }`}
        >
          📅 Jadwal Konsultasi
        </button>
      </div>

      {/* Tab: Modul Edukasi */}
      {activeTab === 'modul' && (
        <div role="tabpanel" aria-label="Modul Edukasi">
          {/* Filter Controls */}
          <div className="mb-6 space-y-4" role="search" aria-label="Filter modul edukasi">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="search-modul" className="block font-bold text-sm">
                  Cari Modul
                </label>
                <input
                  type="search"
                  id="search-modul"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik judul atau topik..."
                  className={`w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 ${inputClass}`}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="filter-kategori" className="block font-bold text-sm">
                  Kategori
                </label>
                <select
                  id="filter-kategori"
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className={`w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 ${inputClass}`}
                >
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm opacity-70" aria-live="polite" aria-atomic="true">
              Menampilkan {filteredModul.length} dari {modulData.length} modul
            </p>
          </div>

          {/* Modul Cards */}
          {filteredModul.length === 0 ? (
            <div className={`rounded-xl p-8 text-center ${cardClass}`} role="status">
              <p className="font-bold mb-2">Tidak Ada Hasil</p>
              <p className="opacity-80">Coba ubah kata kunci atau kategori filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredModul.map((modul) => (
                <article
                  key={modul.id}
                  className={`rounded-xl p-6 sm:p-8 ${cardClass}`}
                  aria-labelledby={`modul-title-${modul.id}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h2
                      id={`modul-title-${modul.id}`}
                      className="text-[1.25em] font-bold leading-tight flex-1"
                    >
                      {modul.judul}
                    </h2>
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${badgeClass(modul.kategori)}`}>
                      {modul.kategori}
                    </span>
                  </div>

                  <p className="leading-relaxed mb-4 opacity-90">{modul.ringkasan}</p>

                  <div className="mb-4">
                    <h3 className="font-bold text-sm mb-2 uppercase tracking-wide opacity-70">
                      Poin Pembelajaran
                    </h3>
                    <ul className="space-y-2">
                      {modul.poinPembelajaran.map((poin, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-600 mt-0.5 font-bold" aria-hidden="true">{index + 1}.</span>
                          <p className="leading-relaxed">{poin}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm opacity-70 pt-4 border-t border-current">
                    <span>👤 {modul.narasumber}</span>
                    <span>⏱ {modul.durasi}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Jadwal Konsultasi */}
      {activeTab === 'jadwal' && (
        <div role="tabpanel" aria-label="Jadwal Konsultasi">
          <div className="mb-6">
            <h2 className="text-[1.5em] font-bold mb-2">Jadwal Konsultasi Keluarga</h2>
            <p className="opacity-80">
              Layanan konsultasi gratis oleh BIPEKA DPD PKS Pamekasan. Terbuka untuk seluruh
              warga Kabupaten Pamekasan tanpa memandang latar belakang.
            </p>
          </div>

          <div className="space-y-4">
            {jadwalData.map((jadwal) => (
              <article
                key={jadwal.id}
                className={`rounded-xl p-6 ${cardClass}`}
                aria-labelledby={`jadwal-title-${jadwal.id}`}
              >
                <h3
                  id={`jadwal-title-${jadwal.id}`}
                  className="text-[1.125em] font-bold mb-3"
                >
                  {jadwal.judul}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">📅</span>
                    <span><strong>Hari:</strong> {jadwal.hari}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">🕐</span>
                    <span><strong>Waktu:</strong> {jadwal.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">📍</span>
                    <span><strong>Lokasi:</strong> {jadwal.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">💬</span>
                    <span><strong>Metode:</strong> {jadwal.metode}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <span aria-hidden="true">👤</span>
                    <span><strong>Konselor:</strong> {jadwal.konselor}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className={`rounded-xl p-6 mt-8 text-center ${cardClass}`}>
            <p className="font-bold mb-3">Butuh konsultasi segera?</p>
            <a
              href="https://wa.me/6284444444444?text=Assalamualaikum%2C%20saya%20ingin%20mendaftar%20konsultasi%20keluarga%20BIPEKA%20PKS%20Pamekasan."
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center min-h-[44px] px-8 py-3 font-bold rounded-lg transition-all focus:outline-none focus:ring-4 ${
                isHighContrast
                  ? 'bg-[#FFFF00] text-[#000000] hover:bg-[#cccc00] focus:ring-[#FFFF00]'
                  : 'bg-[#25D366] text-white hover:bg-[#1DA851] focus:ring-green-400'
              }`}
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
