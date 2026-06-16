'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';


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

const SOSMED = [
  { label: 'YouTube', href: '#', icon: '▶' },
  { label: 'Instagram', href: '#', icon: '📷' },
  { label: 'TikTok', href: '#', icon: '🎵' },
  { label: 'X / Twitter', href: '#', icon: '🐦' },
  { label: 'Facebook', href: '#', icon: '📘' },
  { label: 'Telegram', href: '#', icon: '✈' },
  { label: 'WhatsApp', href: 'https://wa.me/6284444444444', icon: '💬' },
];

export default function Footer() {
  const isHighContrast = useHighContrast();


  if (isHighContrast) {
    return (
      <footer className="bg-[#000000] border-t-2 border-[#FFFF00] text-[#FFFF00] mt-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Image src="/icons/icon-yellow.svg" alt="Logo PKS" width={36} height={36} className="shrink-0" />
                <p className="font-bold mb-0">DPD PKS Pamekasan</p>
              </div>
              <p className="text-sm opacity-80">Dewan Pengurus Daerah PKS Kabupaten Pamekasan.</p>
            </div>
            <div>
              <p className="font-bold mb-2">Hubungi Kami</p>
              <p className="text-sm">WA: +62 844-4444-4444</p>
              <p className="text-sm">Email: humas@pkspamekasan.id</p>
            </div>
            <div>
              <p className="font-bold mb-2">Navigasi</p>
              <Link href="/" className="block text-sm hover:underline">Beranda</Link>
              <Link href="/berita" className="block text-sm hover:underline">Berita</Link>
              <Link href="/kontak" className="block text-sm hover:underline">Kontak</Link>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-[#FFFF00]/40 text-center text-sm">
            &copy; {new Date().getFullYear()} DPD PKS Kabupaten Pamekasan
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-12" role="contentinfo">
      {/* Top Banner — Orange */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo + Nama */}
            <div className="flex items-center gap-4">
              <Image src="/icons/icon-192.svg" alt="Logo PKS" width={48} height={48} className="shrink-0" />
              <div>
                <p className="font-bold text-[1.125em]">DPD PKS Kabupaten Pamekasan</p>
                <p className="text-sm text-orange-100">Dewan Pengurus Daerah Partai Keadilan Sejahtera</p>
              </div>
            </div>

            {/* Sosial Media */}
            <div className="flex items-center gap-2">
              {SOSMED.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm transition focus:outline-none focus:ring-4 focus:ring-white/50"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer — Black */}
      <div className="bg-black text-gray-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Kolom 1: Alamat & Kontak */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-bold text-white mb-4">DPD PKS Pamekasan</p>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5" aria-hidden="true">📍</span>
                  <span>Jl. Patemon, Kabupaten Pamekasan, Jawa Timur 69351</span>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">📱</span>
                  <a
                    href="https://wa.me/6284444444444"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition focus:outline-none focus:ring-4 focus:ring-orange-500/50 rounded px-1"
                  >
                    +62 844-4444-4444 (WhatsApp)
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">📧</span>
                  <a
                    href="mailto:humas@pkspamekasan.id"
                    className="hover:text-orange-400 transition focus:outline-none focus:ring-4 focus:ring-orange-500/50 rounded px-1"
                  >
                    humas@pkspamekasan.id
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom 2: Navigasi */}
            <div>
              <p className="font-bold text-white mb-4 text-[1.0625em]">Navigasi</p>
              <ul className="space-y-3">
                {[
                  { href: '/', label: 'Beranda' },
                  { href: '/profil', label: 'Profil Partai' },
                  { href: '/berita', label: 'Berita' },
                  { href: '/agenda', label: 'Agenda' },
                  { href: '/galeri', label: 'Galeri' },
                  { href: '/kontak', label: 'Kontak' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-orange-400 transition focus:outline-none focus:ring-4 focus:ring-orange-500/50 rounded px-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 3: Layanan */}
            <div>
              <p className="font-bold text-white mb-4 text-[1.0625em]">Layanan</p>
              <ul className="space-y-3">
                {[
                  { href: '/sowan-kyai', label: 'Sowan Kyai' },
                  { href: '/rki', label: 'RKI BIPEKA' },
                  { href: '/donasi', label: 'Donasi & Infak' },
                  { href: '#heading-aspirasi', label: 'E-Aspirasi' },
                  { href: '#heading-kta', label: 'KTA Online' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-orange-400 transition focus:outline-none focus:ring-4 focus:ring-orange-500/50 rounded px-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom 4: Info */}
            <div>
              <p className="font-bold text-white mb-4 text-[1.0625em]">Informasi</p>
              <ul className="space-y-3">
                {[
                  { href: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
                  { href: '/syarat-ketentuan', label: 'Syarat & Ketentuan' },
                  { href: '/admin/login', label: 'Admin Panel' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-orange-400 transition focus:outline-none focus:ring-4 focus:ring-orange-500/50 rounded px-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright — Dark */}
      <div className="bg-[#111] text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} DPD PKS Kabupaten Pamekasan. Hak cipta dilindungi.</p>
            <p className="text-xs text-gray-600">
              Dibangun dengan prinsip aksesibilitas inklusif (WCAG 2.1 AA)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
