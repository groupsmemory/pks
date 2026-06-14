'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'aspirasi_baru' | 'kta_baru';
  title: string;
  message: string;
  reference_id: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  isHighContrast?: boolean;
}

export default function NotificationBell({ isHighContrast = false }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchInitial = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=10');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread || 0);
      }
    } catch (err) {
      console.error('[Notif] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectSSE = useCallback(() => {
    if (eventSourceRef.current) return;

    const es = new EventSource('/api/admin/notifications/stream');
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'notification') {
          const notif = parsed.data as Notification;
          setNotifications((prev) => [notif, ...prev].slice(0, 50));
          setUnreadCount((prev) => prev + 1);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      setTimeout(connectSSE, 5000);
    };
  }, []);

  useEffect(() => {
    fetchInitial();
    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [fetchInitial, connectSSE]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[Notif] Mark read error:', err);
    }
  };

  const getTargetLink = (notif: Notification) => {
    if (notif.type === 'aspirasi_baru') return '/admin/dashboard/aspirasi';
    if (notif.type === 'kta_baru') return '/admin/dashboard/kta';
    return '/admin/dashboard';
  };

  const getIcon = (type: string) => {
    if (type === 'aspirasi_baru') return '📝';
    if (type === 'kta_baru') return '🪪';
    return '🔔';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-4 ${
          isHighContrast
            ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-blue-400'
        }`}
        aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl border z-50 max-h-[70vh] flex flex-col ${
          isHighContrast
            ? 'bg-[#000000] border-[#FFFF00]'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
            isHighContrast ? 'border-[#FFFF00]' : 'border-gray-100'
          }`}>
            <h3 className={`font-bold text-sm ${isHighContrast ? 'text-[#FFFF00]' : 'text-gray-900'}`}>
              Notifikasi
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className={`text-xs font-medium min-h-[32px] px-2 py-1 rounded focus:outline-none focus:ring-2 ${
                  isHighContrast
                    ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
                    : 'text-blue-600 hover:text-blue-800 focus:ring-blue-400'
                }`}
              >
                Tandai dibaca
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className={`animate-spin h-5 w-5 border-2 rounded-full ${
                  isHighContrast ? 'border-[#FFFF00] border-t-transparent' : 'border-blue-600 border-t-transparent'
                }`} role="status">
                  <span className="sr-only">Memuat...</span>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className={`text-center py-8 text-sm ${isHighContrast ? 'text-[#FFFF00]' : 'text-gray-400'}`}>
                <p className="text-2xl mb-2">🔔</p>
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              <ul className={`divide-y ${isHighContrast ? 'divide-[#FFFF00]' : 'divide-gray-100'}`} role="list">
                {notifications.map((notif) => (
                  <li key={notif.id}>
                    <Link
                      href={getTargetLink(notif)}
                      onClick={() => {
                        setIsOpen(false);
                        if (!notif.is_read) {
                          fetch('/api/admin/notifications', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ids: [notif.id] }),
                          }).catch(() => {});
                          setUnreadCount((prev) => Math.max(0, prev - 1));
                          setNotifications((prev) =>
                            prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
                          );
                        }
                      }}
                      className={`flex items-start gap-3 px-4 py-3 min-h-[48px] transition-colors focus:outline-none focus:ring-2 focus:ring-inset ${
                        isHighContrast
                          ? 'text-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
                          : notif.is_read
                            ? 'hover:bg-gray-50'
                            : 'bg-blue-50 hover:bg-blue-100 focus:ring-blue-400'
                      }`}
                    >
                      <span className="text-lg mt-0.5 shrink-0" aria-hidden="true">
                        {getIcon(notif.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.is_read ? (isHighContrast ? '' : 'text-gray-700') : (isHighContrast ? 'font-bold' : 'text-gray-900 font-semibold')}`}>
                          {notif.title}
                        </p>
                        <p className={`text-xs mt-0.5 truncate ${isHighContrast ? 'opacity-80' : (notif.is_read ? 'text-gray-400' : 'text-gray-500')}`}>
                          {notif.message}
                        </p>
                        <p className={`text-[10px] mt-1 ${isHighContrast ? 'opacity-60' : 'text-gray-400'}`}>
                          {formatTime(notif.created_at)}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                          isHighContrast ? 'bg-[#FFFF00]' : 'bg-blue-500'
                        }`} aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
