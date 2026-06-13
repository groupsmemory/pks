import Link from 'next/link';

const ITEMS = [
  {
    href: '#heading-aspirasi',
    icon: '📋',
    label: 'E-Aspirasi',
    desc: 'Sampaikan aspirasi dan pengaduan masyarakat secara online',
  },
  {
    href: '#heading-kta',
    icon: '🪪',
    label: 'KTA Online',
    desc: 'Daftar atau perpanjang Kartu Tanda Anggota PKS',
  },
  {
    href: '/donasi',
    icon: '🤝',
    label: 'Donasi & Infak',
    desc: 'Salurkan donasi dan infak untuk program sosial PKS',
  },
  {
    href: '/kebijakan-privasi',
    icon: '📄',
    label: 'Info Publik',
    desc: 'Informasi publik, kebijakan, dan dokumen partai',
  },
];

export default function QuickStats() {
  return (
    <section aria-labelledby="heading-layanan-cepat">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <h2
          id="heading-layanan-cepat"
          className="text-center text-[1.375em] sm:text-[1.75em] font-extrabold mb-2"
        >
          Layanan Cepat
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Akses cepat layanan publik DPD PKS Kabupaten Pamekasan
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex flex-col items-center text-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <span className="text-3xl lg:text-4xl mb-3" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="font-bold text-[1.0625em] text-gray-800 group-hover:text-blue-600 transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
