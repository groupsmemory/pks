import Link from 'next/link';

const ITEMS = [
  {
    href: 'https://daftar.pks.id',
    icon: '🪪',
    label: 'Gabung PKS',
    desc: 'Mari bergabung menjadi Anggota PKS untuk berkhidmat membangun negeri',
    bg: 'from-blue-600 to-blue-800',
  },
  {
    href: '/donasi',
    icon: '🤝',
    label: 'Sumbangan',
    desc: 'Ingin berkontribusi dalam program sosial PKS? Salurkan donasi di sini',
    bg: 'from-emerald-600 to-emerald-800',
  },
  {
    href: '/kebijakan-privasi',
    icon: '📄',
    label: 'Info Publik',
    desc: 'Akses informasi publik, kebijakan, dan dokumen resmi partai',
    bg: 'from-amber-600 to-amber-800',
  },
  {
    href: '/download',
    icon: '📥',
    label: 'Unduh',
    desc: 'Download arsip, dokumen, logo, dan materi publikasi PKS',
    bg: 'from-purple-600 to-purple-800',
  },
];

export default function SidebarKunjungi() {
  return (
    <aside aria-label="Kunjungi juga">
      <h2 className="text-[1.125em] font-extrabold mb-4 text-gray-800">
        Kunjungi Juga
      </h2>
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`group block rounded-xl bg-gradient-to-br ${item.bg} p-5 text-white shadow-sm hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5" aria-hidden="true">{item.icon}</span>
              <div>
                <p className="font-bold text-[1.0625em] group-hover:underline">{item.label}</p>
                <p className="text-sm text-white/80 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}
