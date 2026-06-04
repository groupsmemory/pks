'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil Ketua' },
  { href: '/sowan-kyai', label: 'Sowan Kyai' },
  { href: '/rki', label: 'RKI BIPEKA' },
  { href: '/donasi', label: 'Donasi' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const headerBg = isHighContrast
    ? 'bg-[#000000] border-b-2 border-[#FFFF00]'
    : 'bg-white border-b border-gray-200 shadow-sm';

  const linkClass = isHighContrast
    ? 'text-[#FFFF00] hover:underline focus:ring-[#FFFF00]'
    : 'text-gray-700 hover:text-blue-600 focus:ring-blue-300';

  const activeLinkClass = isHighContrast
    ? 'text-[#FFFF00] font-bold underline'
    : 'text-blue-600 font-bold';

  const mobileMenuBg = isHighContrast
    ? 'bg-[#000000] border-t-2 border-[#FFFF00]'
    : 'bg-white border-t border-gray-200';

  const hamburgerClass = isHighContrast
    ? 'text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000]'
    : 'text-gray-700 border border-gray-300 hover:bg-gray-100';

  return (
    <header className={`sticky top-0 z-50 ${headerBg}`} role="banner">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            href="/"
            className={`flex items-center gap-3 font-extrabold text-[1.125em] focus:outline-none focus:ring-4 rounded px-2 py-1 ${linkClass}`}
            aria-label="Beranda DPD PKS Pamekasan"
          >
            <span aria-hidden="true" className="text-[1.5em]">☪</span>
            <span className="hidden sm:inline">DPD PKS Pamekasan</span>
            <span className="sm:hidden">PKS Pamekasan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 flex items-center ${linkClass}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            className={`md:hidden min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${hamburgerClass}`}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className={`md:hidden ${mobileMenuBg}`}
          aria-label="Navigasi mobile"
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block min-h-[44px] px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${linkClass}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
