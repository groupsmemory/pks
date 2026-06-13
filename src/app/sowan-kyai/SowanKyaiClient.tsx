'use client';

import React, { useState, useMemo } from 'react';
import { PAMEKASAN_KECAMATAN } from '@/src/lib/constants';
import { useAccessibility } from '@/src/hooks/useAccessibility';
import type { SowanItem } from '@/src/data/sowan-kyai';

interface SowanKyaiClientProps {
  data: SowanItem[];
}

export default function SowanKyaiClient({ data }: SowanKyaiClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('');

  const { isHighContrast } = useAccessibility();

  // Filter array real-time di sisi klien (sesuai PRD: tanpa reload halaman)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesKecamatan = filterKecamatan === '' || item.kecamatan === filterKecamatan;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === '' ||
        item.namaKiai.toLowerCase().includes(query) ||
        item.namaPesantren.toLowerCase().includes(query) ||
        item.kecamatan.toLowerCase().includes(query) ||
        item.tausiyah.some((t) => t.toLowerCase().includes(query));

      return matchesKecamatan && matchesSearch;
    });
  }, [data, filterKecamatan, searchQuery]);

  // Styling
  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

  const inputClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]'
    : 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200';

  const badgeClass = isHighContrast
    ? 'bg-[#000000] border border-[#FFFF00] text-[#FFFF00]'
    : 'bg-blue-100 text-blue-800';

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-8 space-y-4" role="search" aria-label="Filter dokumentasi sowan kyai">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <label htmlFor="search-sowan" className="block font-bold text-sm">
              Cari Nama Kiai / Pesantren
            </label>
            <input
              type="search"
              id="search-sowan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama kiai atau pesantren..."
              className={`w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 ${inputClass}`}
            />
          </div>

          {/* Kecamatan Filter */}
          <div className="space-y-2">
            <label htmlFor="filter-kecamatan" className="block font-bold text-sm">
              Filter Kecamatan
            </label>
            <select
              id="filter-kecamatan"
              value={filterKecamatan}
              onChange={(e) => setFilterKecamatan(e.target.value)}
              className={`w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 ${inputClass}`}
            >
              <option value="">Semua Kecamatan</option>
              {PAMEKASAN_KECAMATAN.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Count */}
        <p className="text-sm opacity-70" aria-live="polite" aria-atomic="true">
          Menampilkan {filteredData.length} dari {data.length} dokumentasi sowan
        </p>
      </div>

      {/* Cards Grid */}
      {filteredData.length === 0 ? (
        <div
          className={`rounded-xl p-8 text-center ${cardClass}`}
          role="status"
          aria-live="polite"
        >
          <p className="text-[1.125em] font-bold mb-2">Tidak Ada Hasil</p>
          <p className="opacity-80">
            Tidak ditemukan dokumentasi sowan kyai yang sesuai dengan filter Anda.
            Coba ubah kata kunci atau pilih kecamatan lain.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredData.map((item) => (
            <article
              key={item.id}
              className={`rounded-xl p-6 sm:p-8 ${cardClass}`}
              aria-labelledby={`sowan-title-${item.id}`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h2
                    id={`sowan-title-${item.id}`}
                    className="text-[1.25em] font-bold leading-tight"
                  >
                    {item.namaKiai}
                  </h2>
                  <p className="text-[1em] opacity-80 mt-1">{item.namaPesantren}</p>
                </div>
                <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full ${badgeClass}`}>
                  {item.kecamatan}
                </span>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm opacity-70 mb-4">
                <span>📅 {item.tanggalSowan}</span>
                <span>👥 {item.delegasi}</span>
              </div>

              {/* Tausiyah / Nasihat */}
              <div className="mt-4">
                <h3 className="font-bold text-sm mb-2 uppercase tracking-wide opacity-70">
                  Poin-Poin Tausiyah &amp; Nasihat
                </h3>
                <ul className="space-y-2">
                  {item.tausiyah.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-600 mt-0.5" aria-hidden="true">•</span>
                      <p className="leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
