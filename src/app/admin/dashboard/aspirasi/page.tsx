import { getDb } from '@/src/lib/db';
import EmptyState from '@/src/components/EmptyState';
import FilterBar from '../FilterBar';

interface AspirasiRow {
  id: string;
  nama_pelapor: string;
  kecamatan: string;
  isi_aspirasi: string;
  status_aspirasi: string;
  assigned_to: string;
  created_at: string;
}

async function getAspirasiList(filters: {
  search?: string;
  status?: string;
  kecamatan?: string;
}): Promise<AspirasiRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();

  const conditions: string[] = [];
  const params: (string | undefined)[] = [];

  if (filters.search) {
    conditions.push(`nama_pelapor ILIKE ${'$' + (params.length + 1)}`);
    params.push(`%${filters.search}%`);
  }
  if (filters.status) {
    conditions.push(`status_aspirasi = ${'$' + (params.length + 1)}`);
    params.push(filters.status);
  }
  if (filters.kecamatan) {
    conditions.push(`kecamatan = ${'$' + (params.length + 1)}`);
    params.push(filters.kecamatan);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const queryStr = `SELECT id, nama_pelapor, kecamatan, isi_aspirasi, status_aspirasi, assigned_to, created_at
     FROM aspirasi ${where}
     ORDER BY created_at DESC
     LIMIT 100`;
  const rows = await sql.query(queryStr, params);

  return rows as unknown as AspirasiRow[];
}

async function getKecamatanOptions(): Promise<{ value: string; label: string }[]> {
  if (!process.env.DATABASE_URL) return [];
  const sql = getDb();
  const rows = await sql`
    SELECT DISTINCT kecamatan FROM aspirasi WHERE kecamatan IS NOT NULL AND kecamatan != '' ORDER BY kecamatan
  ` as { kecamatan: string }[];
  return rows.map((r) => ({ value: r.kecamatan, label: r.kecamatan }));
}

export default async function AspirasiAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; kecamatan?: string }>;
}) {
  const { search, status, kecamatan } = await searchParams;
  const filters = { search, status, kecamatan };
  const data = await getAspirasiList(filters);
  const kecamatanOptions = await getKecamatanOptions();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Log Aspirasi Masuk</h1>
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan {data.length} aspirasi{search || status || kecamatan ? ' (filtered)' : ' terbaru'}. NIK terenkripsi dan tidak ditampilkan.
          </p>
        </div>
        <a
          href="/api/admin/export/aspirasi"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          ↓ CSV
        </a>
      </div>

      <div className="mb-4">
        <FilterBar
          search={search || ''}
          searchPlaceholder="Cari nama pelapor..."
          kecamatan={kecamatan || ''}
          kecamatanOptions={kecamatanOptions}
          status={status || ''}
          statusOptions={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'RESOLVED', label: 'Resolved' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
          statusLabel="Status"
        />
      </div>

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message={search || status || kecamatan ? 'Tidak ada aspirasi yang cocok dengan filter.' : 'Belum ada aspirasi yang masuk.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm" aria-label="Tabel log aspirasi">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Nama</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Kecamatan</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Isi Aspirasi</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Status</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Diteruskan Ke</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.nama_pelapor}</td>
                  <td className="px-4 py-3 text-gray-600">{row.kecamatan}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={row.isi_aspirasi}>
                    {row.isi_aspirasi}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                      row.status_aspirasi === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : row.status_aspirasi === 'RESOLVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.status_aspirasi}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{row.assigned_to}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(row.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
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
