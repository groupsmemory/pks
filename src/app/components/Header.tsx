'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type MegaGroup = {
  category: string;
  links: { href: string; label: string }[];
};

type NavItem = {
  label: string;
  href?: string;
  megaMenu?: MegaGroup[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil Partai',
    megaMenu: [
      {
        category: 'Seputar Partai',
        links: [
          { href: '/profil', label: 'Sejarah Partai' },
          { href: '/profil', label: 'Visi & Misi' },
          { href: '/profil', label: 'Struktur Pengurus' },
          { href: '/profil', label: 'AD/ART' },
        ],
      },
      {
        category: 'Kebijakan',
        links: [
          { href: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
          { href: '/syarat-ketentuan', label: 'Syarat & Ketentuan' },
        ],
      },
    ],
  },
  {
    label: 'Berita',
    megaMenu: [
      {
        category: 'Terkini',
        links: [
          { href: '/berita', label: 'Berita PKS' },
          { href: '/berita', label: 'Berita Daerah' },
          { href: '/berita', label: 'Opini' },
        ],
      },
      {
        category: 'Multimedia',
        links: [
          { href: '/galeri', label: 'Galeri Foto' },
          { href: '/agenda', label: 'Agenda Kegiatan' },
        ],
      },
    ],
  },
  { label: 'Agenda', href: '/agenda' },
  {
    label: 'Layanan',
    megaMenu: [
      {
        category: 'Layanan Publik',
        links: [
          { href: '/sowan-kyai', label: 'Sowan Kyai' },
          { href: '/rki', label: 'RKI BIPEKA' },
          { href: '/donasi', label: 'Donasi & Infak' },
        ],
      },
    ],
  },
  { label: 'Kontak', href: '/kontak' },
];

function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const check = () => setIsHighContrast(
      document.documentElement.classList.contains('high-contrast')
    );
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return isHighContrast;
}

export default function Header() {
  const isHighContrast = useHighContrast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const headerBg = isHighContrast
    ? 'bg-[#000000] border-b-2 border-[#FFFF00]'
    : 'bg-white border-b border-gray-200 shadow-sm';

  const linkClass = isHighContrast
    ? 'text-[#FFFF00] hover:underline focus:ring-[#FFFF00]'
    : 'text-gray-700 hover:text-blue-600 focus:ring-blue-300';

  const mobileMenuBg = isHighContrast
    ? 'bg-[#000000] border-t-2 border-[#FFFF00]'
    : 'bg-white border-t border-gray-200';

  const hamburgerClass = isHighContrast
    ? 'text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000]'
    : 'text-gray-700 border border-gray-300 hover:bg-gray-100';

  const dropdownBg = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-xl';

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMega(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMega(null), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent, label: string) => {
    if (e.key === 'Escape') {
      setOpenMega(null);
      (e.currentTarget as HTMLElement)?.querySelector('button')?.focus();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const toggleMobileExpand = (label: string) => {
    setExpandedMobile((prev) => (prev === label ? null : label));
  };

  return (
    <header className={`sticky top-0 z-50 ${headerBg}`} role="banner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className={`flex items-center gap-3 font-extrabold text-[1.125em] focus:outline-none focus:ring-4 rounded px-2 py-1 ${linkClass}`}
            aria-label="Beranda Dewan Pengurus Daerah PKS Kabupaten Pamekasan"
          >
            {/* Ganti dengan <Image src="/logo.png" alt="Logo PKS" width={40} height={40} /> */}
            <span aria-hidden="true" className="text-[1.5em] font-mono tracking-widest">)|(</span>
            <span className="hidden lg:inline">DPD PKS Kabupaten Pamekasan</span>
            <span className="hidden sm:inline lg:hidden">DPD PKS Kab. Pamekasan</span>
            <span className="sm:hidden">DPD PKS Pamekasan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center gap-1"
            aria-label="Navigasi utama"
          >
            {NAV_ITEMS.map((item) =>
              item.megaMenu ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                  onKeyDown={(e) => handleKeyDown(e, item.label)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMega(openMega === item.label ? null : item.label)}
                    className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 flex items-center gap-1 ${linkClass} ${
                      openMega === item.label ? (isHighContrast ? 'bg-[#FFFF00] text-[#000000]' : 'bg-blue-50 text-blue-700') : ''
                    }`}
                    aria-expanded={openMega === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 transition-transform ${openMega === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openMega === item.label && (
                    <div
                      className={`absolute left-0 top-full mt-1 rounded-xl ${dropdownBg} overflow-hidden`}
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex gap-8 p-6 min-w-[480px]">
                        {item.megaMenu.map((group) => (
                          <div key={group.category} className="min-w-[160px]">
                            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                              isHighContrast ? 'text-[#FFFF00]' : 'text-gray-500'
                            }`}>
                              {group.category}
                            </p>
                            <ul className="space-y-1">
                              {group.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenMega(null)}
                                    className={`block min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 ${linkClass}`}
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 flex items-center ${linkClass}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`md:hidden min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${hamburgerClass}`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-menu"
          className={`md:hidden ${mobileMenuBg}`}
          aria-label="Navigasi mobile"
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) =>
              item.megaMenu ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMobileExpand(item.label)}
                    className={`flex items-center justify-between w-full min-h-[44px] px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${linkClass}`}
                    aria-expanded={expandedMobile === item.label}
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 transition-transform ${expandedMobile === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedMobile === item.label && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.megaMenu.map((group) => (
                        <div key={group.category} className="mb-3">
                          <p className={`px-4 py-1 text-xs font-bold uppercase tracking-wider ${
                            isHighContrast ? 'text-[#FFFF00]' : 'text-gray-500'
                          }`}>
                            {group.category}
                          </p>
                          {group.links.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setExpandedMobile(null);
                              }}
                              className={`block min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${linkClass}`}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block min-h-[44px] px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${linkClass}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
