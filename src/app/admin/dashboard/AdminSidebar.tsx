'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useAccessibility } from '@/src/hooks/useAccessibility';

interface AdminSidebarProps {
  userName: string;
  userRole: 'ADMIN' | 'SUPER_ADMIN';
}

const MENU_ITEMS = [
  { href: '/admin/dashboard', label: 'Ringkasan', icon: '📊', role: null as 'ADMIN' | 'SUPER_ADMIN' | null },
  { href: '/admin/dashboard/aspirasi', label: 'Log Aspirasi', icon: '📝', role: null },
  { href: '/admin/dashboard/kta', label: 'Pendaftar KTA', icon: '🪪', role: null },
  { href: '/admin/dashboard/donasi', label: 'Riwayat Donasi', icon: '💰', role: null },
  { href: '/admin/dashboard/berita', label: 'Kelola Berita', icon: '📰', role: null },
  { href: '/admin/dashboard/agenda', label: 'Kelola Agenda', icon: '🗓️', role: null },
  { href: '/admin/dashboard/galeri', label: 'Kelola Galeri', icon: '🖼️', role: null },
  { href: '/admin/dashboard/admin-users', label: 'Kelola Admin', icon: '👤', role: 'SUPER_ADMIN' as const },
];

export default function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const {
    isHighContrast,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    canIncreaseFont,
    canDecreaseFont,
  } = useAccessibility();

  const linkClass = isHighContrast
    ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
    : 'text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-blue-400';

  const sidebarBg = isHighContrast
    ? 'bg-[#000000] border-r-2 border-[#FFFF00]'
    : 'bg-gray-900';

  const borderCls = isHighContrast
    ? 'border-[#FFFF00]'
    : 'border-gray-700';

  const accBtn = isHighContrast
    ? 'border-[#FFFF00] text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
    : 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-blue-400';

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed bottom-4 right-4 z-50 min-h-[44px] min-w-[44px] px-4 py-3 font-bold rounded-full shadow-lg focus:outline-none focus:ring-4 ${
          isHighContrast
            ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
            : 'bg-blue-600 text-white focus:ring-blue-300'
        }`}
        aria-label={isMobileOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 ${sidebarBg} text-gray-200 flex flex-col
          transform transition-transform duration-200
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Sidebar navigasi admin"
      >
        {/* User Info */}
        <div className={`p-6 border-b ${borderCls}`}>
          <p className={`text-xs uppercase tracking-wide ${isHighContrast ? 'text-[#FFFF00]' : 'text-gray-400'}`}>
            Masuk sebagai
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className={`font-bold truncate ${isHighContrast ? 'text-[#FFFF00]' : 'text-white'}`}>
              {userName}
            </p>
            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
              userRole === 'SUPER_ADMIN'
                ? 'bg-purple-600 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {userRole === 'SUPER_ADMIN' ? 'Super' : 'Admin'}
            </span>
          </div>
        </div>

        {/* Accessibility Toggle */}
        <div className={`border-b ${borderCls}`}>
          <button
            type="button"
            onClick={() => setShowAccessibility(!showAccessibility)}
            className={`flex items-center gap-2 w-full min-h-[44px] px-4 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-4 ${
              isHighContrast
                ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-blue-400'
            }`}
            aria-expanded={showAccessibility}
          >
            <span aria-hidden="true">♿</span>
            Aksesibilitas
            <span className="ml-auto" aria-hidden="true">
              {showAccessibility ? '▲' : '▼'}
            </span>
          </button>

          {showAccessibility && (
            <div className="px-4 pb-4 space-y-2">
              <button
                type="button"
                onClick={toggleHighContrast}
                className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-4 ${accBtn}`}
              >
                {isHighContrast ? '◉ Kontras Tinggi' : '○ Kontras Tinggi'}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={decreaseFontSize}
                  disabled={!canDecreaseFont}
                  className={`flex-1 min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-4 disabled:opacity-30 ${accBtn}`}
                  aria-label="Perkecil ukuran teks"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={increaseFontSize}
                  disabled={!canIncreaseFont}
                  className={`flex-1 min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-4 disabled:opacity-30 ${accBtn}`}
                  aria-label="Perbesar ukuran teks"
                >
                  A+
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Menu admin">
          {MENU_ITEMS
            .filter((item) => !item.role || item.role === userRole)
            .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 ${linkClass}`}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t ${borderCls}`}>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={`w-full min-h-[44px] px-4 py-3 rounded-lg text-sm font-bold transition-colors focus:outline-none focus:ring-4 flex items-center gap-3 ${
              isHighContrast
                ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
                : 'text-red-400 hover:bg-red-900/30 hover:text-red-300 focus:ring-red-400'
            }`}
          >
            <span aria-hidden="true">🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
