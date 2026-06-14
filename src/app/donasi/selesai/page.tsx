import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/src/lib/db';
import { formatRupiah } from '@/src/lib/utils';

interface DonasiRow {
  order_id: string;
  nama_donatur: string;
  jumlah_donasi: number;
  jenis_donasi: string;
  midtrans_status: string;
  midtrans_payment_type: string | null;
  created_at: string;
}

async function getDonasi(orderId: string): Promise<DonasiRow | null> {
  if (!process.env.DATABASE_URL) return null;

  const sql = getDb();
  const rows = await sql`
    SELECT order_id, nama_donatur, jumlah_donasi, jenis_donasi,
           midtrans_status, midtrans_payment_type, created_at
    FROM donasi
    WHERE order_id = ${orderId}
    LIMIT 1
  `;
  return (rows as DonasiRow[])[0] || null;
}

const JENIS_LABEL: Record<string, string> = {
  INFAK_UMUM: 'Infak Umum',
  INFAK_DAKWAH: 'Infak Dakwah',
  INFAK_SOSIAL: 'Infak Sosial',
  INFAK_PENDIDIKAN: 'Infak Pendidikan',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SETTLEMENT: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
  CAPTURE: { label: 'Lunas', color: 'bg-green-100 text-green-800' },
  PENDING: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800' },
  DENY: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
  CANCEL: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  EXPIRE: { label: 'Kedaluwarsa', color: 'bg-red-100 text-red-800' },
  REFUND: { label: 'Dikembalikan', color: 'bg-orange-100 text-orange-800' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const metadata: Metadata = {
  title: 'Status Donasi — DPD PKS Pamekasan',
  description: 'Halaman status pembayaran donasi Anda.',
  openGraph: {
    title: 'Status Donasi — DPD PKS Pamekasan',
    description: 'Halaman status pembayaran donasi Anda.',
  },
  twitter: {
    title: 'Status Donasi — DPD PKS Pamekasan',
    description: 'Halaman status pembayaran donasi Anda.',
  },
};

export default async function DonasiSelesaiPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  if (!order_id) {
    return (
      <main className="min-h-screen">
        <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8 text-center">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-[3em] mb-4">❓</div>
            <h1 className="text-[1.5em] font-bold mb-4">ID Transaksi Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">Kode transaksi tidak diberikan. Silakan periksa tautan yang Anda buka.</p>
            <Link
              href="/donasi"
              className="inline-block min-h-[44px] px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
            >
              Donasi Lagi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const data = await getDonasi(order_id);

  if (!data) {
    return (
      <main className="min-h-screen">
        <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8 text-center">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-[3em] mb-4">🔍</div>
            <h1 className="text-[1.5em] font-bold mb-4">Transaksi Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-2">Data donasi dengan ID <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{order_id}</code> tidak ditemukan.</p>
            <p className="text-gray-600 mb-6">Kemungkinan transaksi belum tercatat atau ID tidak valid.</p>
            <Link
              href="/donasi"
              className="inline-block min-h-[44px] px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
            >
              Donasi Lagi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const status = STATUS_CONFIG[data.midtrans_status] || { label: data.midtrans_status, color: 'bg-gray-100 text-gray-800' };
  const isSuccess = data.midtrans_status === 'SETTLEMENT' || data.midtrans_status === 'CAPTURE';

  return (
    <main className="min-h-screen">
      <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="text-[3em] mb-4">{isSuccess ? '🎉' : '⏳'}</div>
            <h1 className="text-[1.5em] font-bold mb-2">
              {isSuccess ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isSuccess
                ? 'Terima kasih, donasi Anda telah diterima.'
                : 'Silakan selesaikan pembayaran Anda.'}
            </p>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">ID Transaksi</span>
              <span className="text-sm font-mono font-bold text-gray-900">{data.order_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Nama Donatur</span>
              <span className="text-sm font-medium text-gray-900">{data.nama_donatur}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Jenis Donasi</span>
              <span className="text-sm font-medium text-gray-900">{JENIS_LABEL[data.jenis_donasi] || data.jenis_donasi}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Jumlah</span>
              <span className="text-base font-bold text-gray-900">{formatRupiah(Number(data.jumlah_donasi))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded ${status.color}`}>
                {status.label}
              </span>
            </div>
            {data.midtrans_payment_type && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Metode Pembayaran</span>
                <span className="text-sm font-medium text-gray-900">{data.midtrans_payment_type}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Tanggal</span>
              <span className="text-sm text-gray-900">{formatDate(data.created_at)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/donasi"
              className="inline-block min-h-[44px] px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
            >
              Donasi Lagi
            </Link>
          </div>

          <p className="mt-4 text-xs text-center text-gray-400">
            Semoga menjadi amal jariyah dan berkah bagi pembangunan umat.
          </p>
        </div>
      </div>
    </main>
  );
}
