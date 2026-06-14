import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Donasi & Infak Kader',
  description:
    'Salurkan infak dan donasi Anda untuk mendukung program dakwah dan sosial DPD PKS Kabupaten Pamekasan.',
  openGraph: {
    title: 'Donasi & Infak Kader',
    description:
      'Salurkan infak dan donasi Anda untuk mendukung program dakwah dan sosial DPD PKS Kabupaten Pamekasan.',
  },
  twitter: {
    title: 'Donasi & Infak Kader',
    description:
      'Salurkan infak dan donasi Anda untuk mendukung program dakwah dan sosial DPD PKS Kabupaten Pamekasan.',
  },
};

const DonasiForm = dynamic(() => import('@/src/app/components/DonasiForm'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded w-1/4" />
    </div>
  ),
});

export default function DonasiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <DonasiForm />
      </div>
    </main>
  );
}
