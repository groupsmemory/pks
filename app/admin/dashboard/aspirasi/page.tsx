import { neon } from '@neondatabase/serverless';

interface AspirasiRow {
  id: string;
  nama_pelapor: string;
  kecamatan: string;
  isi_aspirasi: string;
  status_aspirasi: string;
  assigned_to: string;
  created_at: string;
}

async function getAspirasiList(): Promise<AspirasiRow[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  const sql = neon(databaseUrl);

  const rows = await sql`
    SELECT id, nama_pelapor, kecamatan, isi_aspirasi, status_aspirasi, assigned_to, created_at
    FROM aspirasi
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return rows as AspirasiRow[];
}

export default async function AspirasiAdminPage() {
  const data = await getAspirasiList();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[1.5em] font-extrabold text-gray-900">Log Aspirasi Masuk</h1>
        <p className="text-sm text-gray-600 mt-1">
          Menampilkan {data.length} aspirasi terbaru. NIK terenkripsi dan tidak ditampilkan.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Belum ada aspirasi yang masuk.</p>
        </div>
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
