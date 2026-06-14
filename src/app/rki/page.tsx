import type { Metadata } from 'next';
import RkiClient from './RkiClient';
import { modulData, jadwalKonsultasi } from '@/src/data/rki';

export const metadata: Metadata = {
  title: 'Portal RKI — Rumah Keluarga Indonesia',
  description:
    'Portal edukasi ketahanan keluarga oleh BIPEKA DPD PKS Pamekasan. Modul parenting Islam, pembinaan ekonomi keluarga, dan jadwal konsultasi.',
  openGraph: {
    title: 'Portal RKI — Rumah Keluarga Indonesia',
    description:
      'Portal edukasi ketahanan keluarga oleh BIPEKA DPD PKS Pamekasan. Modul parenting Islam, pembinaan ekonomi keluarga, dan jadwal konsultasi.',
  },
  twitter: {
    title: 'Portal RKI — Rumah Keluarga Indonesia',
    description:
      'Portal edukasi ketahanan keluarga oleh BIPEKA DPD PKS Pamekasan. Modul parenting Islam, pembinaan ekonomi keluarga, dan jadwal konsultasi.',
  },
};

export default function RkiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <section className="mb-10" aria-labelledby="rki-heading">
          <h1 id="rki-heading" className="text-[2em] font-extrabold mb-3 leading-tight">
            Rumah Keluarga Indonesia (RKI)
          </h1>
          <p className="text-[1.125em] opacity-90 leading-relaxed mb-4">
            Portal edukasi ketahanan keluarga oleh Bidang Perempuan dan Ketahanan Keluarga
            (BIPEKA) DPD PKS Kabupaten Pamekasan. Menyediakan modul pembelajaran mandiri,
            pelatihan keterampilan, dan layanan konsultasi keluarga.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-800 font-medium">
              Parenting Islami
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
              Ekonomi Keluarga
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
              Konseling
            </span>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
              Kesehatan
            </span>
          </div>
        </section>

        {/* Client Component: Filter + Modul Cards + Jadwal */}
        <RkiClient modulData={modulData} jadwalData={jadwalKonsultasi} />
      </div>
    </main>
  );
}
