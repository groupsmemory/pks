import { getDb } from '@/src/lib/db';
import { formatRupiah } from '@/src/lib/utils';
import EmptyState from '@/src/components/EmptyState';
import FilterBar from '../FilterBar';

interface DonasiRow {
  id: string;
  order_id: string;
  nama_donatur: string;
  kecamatan: string;
  jenis_donasi: string;
  jumlah_donasi: number;
  midtrans_status: string;
  midtrans_payment_type: string | null;
  created_at: string;
  paid_at: string | null;
}

async function getDonasiList(filters: {
  search?: string;
  status?: string;
  kecamatan?: string;
}): Promise<DonasiRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();

  const conditions: string[] = [];
  const params: (string | undefined)[] = [];

  if (filters.search) {
    conditions.push(`nama_donatur ILIKE ${'$' + (params.length + 1)}`);
    params.push(`%${filters.search}%`);
  }
  if (filters.status) {
    conditions.push(`midtrans_status = ${'$' + (params.length + 1)}`);
    params.push(filters.status);
  }
  if (filters.kecamatan) {
    conditions.push(`kecamatan = ${'$' + (params.length + 1)}`);
    params.push(filters.kecamatan);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const queryStr = `SELECT id, order_id, nama_donatur, kecamatan, jenis_donasi, jumlah_donasi,
            midtrans_status, midtrans_payment_type, created_at, paid_at
     FROM donasi ${where}
     ORDER BY created_at DESC
     LIMIT 100`;
  const rows = await sql.query(queryStr, params);

  return rows as unknown as DonasiRow[];
}

async function getKecamatanOptions(): Promise<{ value: string; label: string }[]> {
  if (!process.env.DATABASE_URL) return [];
  const sql = getDb();
  const rows = await sql`
    SELECT DISTINCT kecamatan FROM donasi WHERE kecamatan IS NOT NULL AND kecamatan != '' ORDER BY kecamatan
  ` as { kecamatan: string }[];
  return rows.map((r) => ({ value: r.kecamatan, label: r.kecamatan }));
}

const JENIS_LABEL: Record<string, string> = {
  INFAK_UMUM: 'Infak Umum',
  INFAK_DAKWAH: 'Infak Dakwah',
  INFAK_SOSIAL: 'Infak Sosial',
  INFAK_PENDIDIKAN: 'Infak Pendidikan',
};

export default async function DonasiAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; kecamatan?: string }>;
}) {
  const { search, status, kecamatan } = await searchParams;
  const filters = { search, status, kecamatan };
  const data = await getDonasiList(filters);
  const kecamatanOptions = await getKecamatanOptions();

  const totalSettlement = data
    .filter((r) => r.midtrans_status === 'SETTLEMENT' || r.midtrans_status === 'CAPTURE')
    .reduce((sum, r) => sum + Number(r.jumlah_donasi), 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Riwayat Donasi</h1>
          <p className="text-sm text-gray-600 mt-1">
            {data.length} transaksi{search || status || kecamatan ? ' (filtered)' : ''} — Total terkumpul: <strong className="text-green-700">{formatRupiah(totalSettlement)}</strong>
          </p>
        </div>
        <a
          href="/api/admin/export/donasi"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          ↓ CSV
        </a>
      </div>

      <div className="mb-4">
        <FilterBar
          search={search || ''}
          searchPlaceholder="Cari nama donatur..."
          kecamatan={kecamatan || ''}
          kecamatanOptions={kecamatanOptions}
          status={status || ''}
          statusOptions={[
            { value: 'SETTLEMENT', label: 'Settlement' },
            { value: 'CAPTURE', label: 'Capture' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'DENY', label: 'Deny' },
            { value: 'CANCEL', label: 'Cancel' },
            { value: 'EXPIRE', label: 'Expire' },
            { value: 'REFUND', label: 'Refund' },
          ]}
          statusLabel="Status Bayar"
        />
      </div>

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message={search || status || kecamatan ? 'Tidak ada transaksi yang cocok dengan filter.' : 'Belum ada transaksi donasi.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm" aria-label="Tabel riwayat donasi">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Order ID</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Donatur</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Jenis</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Jumlah</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Status</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Metode</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono text-gray-600">{row.order_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.nama_donatur}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {JENIS_LABEL[row.jenis_donasi] || row.jenis_donasi}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">{formatRupiah(Number(row.jumlah_donasi))}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                      row.midtrans_status === 'SETTLEMENT' || row.midtrans_status === 'CAPTURE'
                        ? 'bg-green-100 text-green-800'
                        : row.midtrans_status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.midtrans_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {row.midtrans_payment_type || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(row.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
