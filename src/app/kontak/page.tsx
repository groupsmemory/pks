import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak — DPD PKS Pamekasan',
  description: 'Hubungi DPD PKS Kabupaten Pamekasan. Alamat, WhatsApp, email, dan peta lokasi kantor.',
};

export default function KontakPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-[1.75em] sm:text-[2.25em] font-extrabold mb-2">Kontak</h1>
        <p className="text-gray-600 mb-8">Hubungi dan sampaikan aspirasi kepada DPD PKS Pamekasan</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informasi Kontak */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[1.125em] mb-4">Informasi Kantor</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-lg mt-0.5" aria-hidden="true">📍</span>
                  <div>
                    <p className="font-medium">Alamat</p>
                    <p className="text-sm text-gray-600">
                      Jl. Patemon, Kabupaten Pamekasan<br />
                      Jawa Timur, Indonesia
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg mt-0.5" aria-hidden="true">📱</span>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a
                      href="https://wa.me/6284444444444"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline min-h-[44px] inline-flex items-center"
                    >
                      +62 844-4444-4444 (Humas)
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg mt-0.5" aria-hidden="true">📧</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:humas@pkspamekasan.id"
                      className="text-sm text-blue-600 hover:underline min-h-[44px] inline-flex items-center"
                    >
                      humas@pkspamekasan.id
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-[1.125em] mb-4">Media Sosial</h2>
              <p className="text-sm text-gray-600 mb-4">
                Ikuti kami di media sosial untuk informasi terbaru:
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="min-h-[44px] px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium inline-flex items-center gap-2">
                  Facebook
                </span>
                <span className="min-h-[44px] px-4 py-2 rounded-lg bg-pink-100 text-pink-700 text-sm font-medium inline-flex items-center gap-2">
                  Instagram
                </span>
                <span className="min-h-[44px] px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium inline-flex items-center gap-2">
                  YouTube
                </span>
              </div>
            </div>
          </div>

          {/* Peta / CTA */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm aspect-square flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl" aria-hidden="true">🗺️</span>
                <p className="text-gray-500 mt-4">Peta lokasi akan ditampilkan di sini</p>
                <p className="text-sm text-gray-400 mt-1">Jl. Patemon, Pamekasan</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
              <h2 className="font-bold text-[1.125em] mb-3">Sampaikan Aspirasi</h2>
              <p className="text-sm text-gray-600 mb-4">
                Punya masukan atau laporan? Sampaikan langsung melalui kanal E-Aspirasi kami.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
              >
                Kirim Aspirasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
