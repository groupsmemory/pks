import type { Metadata } from 'next';
import SowanKyaiClient from './SowanKyaiClient';
import { sowanData } from '@/src/data/sowan-kyai';

export const metadata: Metadata = {
  title: 'Sowan Kyai — Silaturahmi Ulama DPD PKS Pamekasan',
  description:
    'Dokumentasi kunjungan silaturahmi (sowan) jajaran pengurus DPD PKS Pamekasan kepada para kiai kharismatik dan pengasuh pondok pesantren di Kabupaten Pamekasan.',
  openGraph: {
    title: 'Sowan Kyai — Silaturahmi Ulama DPD PKS Pamekasan',
    description:
      'Dokumentasi kunjungan silaturahmi (sowan) jajaran pengurus DPD PKS Pamekasan kepada para kiai kharismatik dan pengasuh pondok pesantren di Kabupaten Pamekasan.',
  },
  twitter: {
    title: 'Sowan Kyai — Silaturahmi Ulama DPD PKS Pamekasan',
    description:
      'Dokumentasi kunjungan silaturahmi (sowan) jajaran pengurus DPD PKS Pamekasan kepada para kiai kharismatik dan pengasuh pondok pesantren di Kabupaten Pamekasan.',
  },
};

export default function SowanKyaiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <section className="mb-8" aria-labelledby="sowan-heading">
          <h1 id="sowan-heading" className="text-[2em] font-extrabold mb-3 leading-tight">
            Sowan Kyai
          </h1>
          <p className="text-[1.125em] opacity-90 leading-relaxed">
            Dokumentasi silaturahmi resmi jajaran pengurus DPD PKS Pamekasan kepada para kiai
            kharismatik, ulama sepuh, dan pengasuh pondok pesantren di Kabupaten Pamekasan.
            Tradisi <em>sowan</em> ini merupakan wujud komitmen partai dalam menjaga harmoni
            antara gerakan politik dakwah dengan nilai-nilai kepesantrenan Madura.
          </p>
        </section>

        {/* Client Component: Filter + Cards */}
        <SowanKyaiClient data={sowanData} />
      </div>
    </main>
  );
}
