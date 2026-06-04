import { neon } from '@neondatabase/serverless';

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

async function getDonasiList(): Promise<DonasiRow[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  const sql = neon(databaseUrl);

  const rows = await sql`
    SELECT id, order_id, nama_donatur, kecamatan, jenis_donasi, jumlah_donasi,
           midtrans_status, midtrans_payment_type, created_at, paid_at
    FROM donasi
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return rows as DonasiRow[];
}

function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

const JENIS_LABEL: Record<string, string> = {
  INFAK_UMUM: 'Infak Umum',
  INFAK_DAKWAH: 'Infak Dakwah',
  INFAK_SOSIAL: 'Infak Sosial',
  INFAK_PENDIDIKAN: 'Infak Pendidikan',
};

export default async function DonasiAdminPage() {
  const data = await getDonasiList();

  const totalSettlement = data
    .filter((r) => r.midtrans_status === 'SETTLEMENT' || r.midtrans_status === 'CAPTURE')
    .reduce((sum, r) => sum + Number(r.jumlah_donasi), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[1.5em] font-extrabold text-gray-900">Riwayat Donasi</h1>
        <p className="text-sm text-gray-600 mt-1">
          {data.length} transaksi — Total terkumpul: <strong className="text-green-700">{formatRupiah(totalSettlement)}</strong>
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Belum ada transaksi donasi.</p>
        </div>
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
