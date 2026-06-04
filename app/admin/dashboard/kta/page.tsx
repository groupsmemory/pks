import { neon } from '@neondatabase/serverless';

interface KtaRow {
  id: string;
  nama_lengkap: string;
  nomor_whatsapp: string;
  kecamatan: string;
  status_verifikasi: string;
  created_at: string;
}

async function getKtaList(): Promise<KtaRow[]> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];

  const sql = neon(databaseUrl);

  const rows = await sql`
    SELECT id, nama_lengkap, nomor_whatsapp, kecamatan, status_verifikasi, created_at
    FROM kta_registrations
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return rows as KtaRow[];
}

export default async function KtaAdminPage() {
  const data = await getKtaList();

  const pendingCount = data.filter((r) => r.status_verifikasi === 'PENDING').length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Pendaftar KTA Online</h1>
          <p className="text-sm text-gray-600 mt-1">
            {data.length} pendaftar total — <strong>{pendingCount} menunggu verifikasi</strong>
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Belum ada pendaftar KTA.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm" aria-label="Tabel pendaftar KTA">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Nama Lengkap</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">WhatsApp</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Kecamatan</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Status</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.nama_lengkap}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <a
                      href={`https://wa.me/${row.nomor_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {row.nomor_whatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.kecamatan}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                      row.status_verifikasi === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : row.status_verifikasi === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status_verifikasi}
                    </span>
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
