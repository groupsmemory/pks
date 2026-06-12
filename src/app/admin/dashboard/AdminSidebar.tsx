'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface AdminSidebarProps {
  userName: string;
}

const MENU_ITEMS = [
  { href: '/admin/dashboard', label: 'Ringkasan', icon: '📊' },
  { href: '/admin/dashboard/aspirasi', label: 'Log Aspirasi', icon: '📝' },
  { href: '/admin/dashboard/kta', label: 'Pendaftar KTA', icon: '🪪' },
  { href: '/admin/dashboard/donasi', label: 'Riwayat Donasi', icon: '💰' },
];

export default function AdminSidebar({ userName }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 min-h-[44px] min-w-[44px] px-4 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label={isMobileOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-gray-900 text-gray-200 flex flex-col
          transform transition-transform duration-200
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Sidebar navigasi admin"
      >
        {/* User Info */}
        <div className="p-6 border-b border-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-400">Masuk sebagai</p>
          <p className="font-bold text-white mt-1 truncate">{userName}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1" aria-label="Menu admin">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full min-h-[44px] px-4 py-3 rounded-lg text-sm font-bold text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors focus:outline-none focus:ring-4 focus:ring-red-400 flex items-center gap-3"
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
