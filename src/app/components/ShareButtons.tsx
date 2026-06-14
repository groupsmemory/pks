'use client';

import { useCallback } from 'react';

const ICONS: Record<string, string> = {
  whatsapp: 'bg-[#25D366] hover:bg-[#1DA851]',
  telegram: 'bg-[#0088cc] hover:bg-[#0077b5]',
  facebook: 'bg-[#1877F2] hover:bg-[#166fe5]',
  twitter: 'bg-[#000000] hover:bg-[#333333]',
};

const SHARE_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  facebook: 'Facebook',
  twitter: 'X (Twitter)',
};

type Platform = keyof typeof ICONS;

interface Props {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: Props) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const getShareLink = useCallback(
    (platform: Platform): string => {
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedTitle = encodeURIComponent(title);

      switch (platform) {
        case 'whatsapp':
          return `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`;
        case 'telegram':
          return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        case 'facebook':
          return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case 'twitter':
          return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        default:
          return shareUrl;
      }
    },
    [shareUrl, title],
  );

  const platforms: Platform[] = ['whatsapp', 'telegram', 'facebook', 'twitter'];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold text-gray-600">Bagikan:</span>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <a
            key={platform}
            href={getShareLink(platform)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded text-white text-xs font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 ${ICONS[platform]}`}
            aria-label={`Bagikan ke ${SHARE_LABELS[platform]}`}
          >
            {platform === 'twitter' ? '𝕏' : platform.charAt(0).toUpperCase() + platform.slice(1, 2)}
            <span className="hidden sm:inline">{SHARE_LABELS[platform]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
