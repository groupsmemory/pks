'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [isHighContrast, setIsHighContrast] = useState(false);

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

  const footerBg = isHighContrast
    ? 'bg-[#000000] border-t-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-gray-900 text-gray-300';

  const linkClass = isHighContrast
    ? 'text-[#FFFF00] hover:underline focus:ring-[#FFFF00]'
    : 'text-gray-300 hover:text-white focus:ring-blue-300';

  const headingClass = isHighContrast
    ? 'text-[#FFFF00] font-bold'
    : 'text-white font-bold';

  return (
    <footer className={`${footerBg} mt-12`} role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Kolom 1: Tentang */}
          <div>
            <h2 className={`text-[1.125em] mb-4 ${headingClass}`}>DPD PKS Pamekasan</h2>
            <p className="text-sm leading-relaxed opacity-80">
              Dewan Pengurus Daerah Partai Keadilan Sejahtera Kabupaten Pamekasan.
              Berkhidmat untuk rakyat, berdakwah melalui politik yang bersih dan bermartabat.
            </p>
            <p className="text-sm mt-3 opacity-70">
              📍 Jl. Patemon, Kabupaten Pamekasan, Jawa Timur
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h2 className={`text-[1.125em] mb-4 ${headingClass}`}>Navigasi</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`text-sm min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}>
                  Beranda &amp; E-Aspirasi
                </Link>
              </li>
              <li>
                <Link href="/profil" className={`text-sm min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}>
                  Profil Partai
                </Link>
              </li>
              <li>
                <Link href="/berita" className={`text-sm min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}>
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/agenda" className={`text-sm min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}>
                  Agenda
                </Link>
              </li>
              <li>
                <Link href="/galeri" className={`text-sm min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}>
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/kontak" className={`text-sm min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}>
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Sosial */}
          <div>
            <h2 className={`text-[1.125em] mb-4 ${headingClass}`}>Hubungi Kami</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📱</span>
                <a
                  href="https://wa.me/6284444444444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-1 ${linkClass}`}
                >
                  WhatsApp Humas
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">📧</span>
                <span>humas@pkspamekasan.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-current opacity-60 text-center text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-3">
            <Link href="/kebijakan-privasi" className={`min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-2 ${linkClass}`}>
              Kebijakan Privasi
            </Link>
            <Link href="/syarat-ketentuan" className={`min-h-[44px] inline-flex items-center focus:outline-none focus:ring-4 rounded px-2 ${linkClass}`}>
              Syarat &amp; Ketentuan
            </Link>
          </div>
          <p>
            &copy; {new Date().getFullYear()} DPD PKS Kabupaten Pamekasan. Hak cipta dilindungi.
          </p>
          <p className="mt-1">
            Dibangun dengan prinsip aksesibilitas inklusif (WCAG 2.1 AA) untuk seluruh warga Pamekasan.
          </p>
        </div>
      </div>
    </footer>
  );
}
