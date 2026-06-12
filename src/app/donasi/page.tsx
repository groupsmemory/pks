import type { Metadata } from 'next';
import DonasiForm from '@/src/app/components/DonasiForm';

export const metadata: Metadata = {
  title: 'Donasi & Infak Kader',
  description:
    'Salurkan infak dan donasi Anda untuk mendukung program dakwah dan sosial DPD PKS Kabupaten Pamekasan.',
};

export default function DonasiPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <DonasiForm />
      </div>
    </main>
  );
}
