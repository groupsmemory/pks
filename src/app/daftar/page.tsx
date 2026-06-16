import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Daftar KTA — DPD PKS Pamekasan',
  description: 'Pendaftaran anggota Partai Keadilan Sejahtera DPD Kabupaten Pamekasan secara online.',
};

const DaftarForm = dynamic(() => import('./DaftarForm'), {
  loading: () => (
    <div className="min-h-screen flex items-start justify-center p-4">
      <div className="w-full max-w-[1000px] rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="animate-pulse space-y-6 p-8">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  ),
});

export default function DaftarPage() {
  return <DaftarForm />;
}
