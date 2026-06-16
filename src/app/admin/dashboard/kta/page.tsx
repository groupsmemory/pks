import { getDb } from '@/src/lib/db';
import EmptyState from '@/src/components/EmptyState';
import FilterBar from '../FilterBar';
import Link from 'next/link';

interface KtaRow {
  id: string;
  nama_lengkap: string;
  nomor_whatsapp: string;
  kecamatan: string;
  kelurahan_desa: string | null;
  email: string | null;
  tempat_lahir: string | null;
  jenis_kelamin: string | null;
  pekerjaan: string | null;
  status_verifikasi: string;
  created_at: string;
}

async function getKtaList(filters: {
  search?: string;
  status?: string;
  kecamatan?: string;
}): Promise<KtaRow[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();

  const conditions: string[] = [];
  const params: (string | undefined)[] = [];

  if (filters.search) {
    conditions.push(`nama_lengkap ILIKE ${'$' + (params.length + 1)}`);
    params.push(`%${filters.search}%`);
  }
  if (filters.status) {
    conditions.push(`status_verifikasi = ${'$' + (params.length + 1)}`);
    params.push(filters.status);
  }
  if (filters.kecamatan) {
    conditions.push(`kecamatan = ${'$' + (params.length + 1)}`);
    params.push(filters.kecamatan);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const queryStr = `SELECT id, nama_lengkap, nomor_whatsapp, kecamatan, kelurahan_desa, email, tempat_lahir, jenis_kelamin, pekerjaan, status_verifikasi, created_at
     FROM kta_registrations ${where}
     ORDER BY created_at DESC
     LIMIT 100`;
  const rows = await sql.query(queryStr, params);

  return rows as unknown as KtaRow[];
}

async function getKecamatanOptions(): Promise<{ value: string; label: string }[]> {
  if (!process.env.DATABASE_URL) return [];
  const sql = getDb();
  const rows = await sql`
    SELECT DISTINCT kecamatan FROM kta_registrations WHERE kecamatan IS NOT NULL AND kecamatan != '' ORDER BY kecamatan
  ` as { kecamatan: string }[];
  return rows.map((r) => ({ value: r.kecamatan, label: r.kecamatan }));
}

function labelize(value: string | null): string {
  if (!value) return '-';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function KtaAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; kecamatan?: string }>;
}) {
  const { search, status, kecamatan } = await searchParams;
  const filters = { search, status, kecamatan };
  const data = await getKtaList(filters);
  const kecamatanOptions = await getKecamatanOptions();

  const pendingCount = data.filter((r) => r.status_verifikasi === 'PENDING').length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">Pendaftar KTA Online</h1>
          <p className="text-sm text-gray-600 mt-1">
            {data.length} pendaftar{search || status || kecamatan ? ' (filtered)' : ' total'} — <strong>{pendingCount} menunggu verifikasi</strong>
          </p>
        </div>
        <a
          href="/api/admin/export/kta"
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors"
        >
          ↓ CSV
        </a>
      </div>

      <div className="mb-4">
        <FilterBar
          search={search || ''}
          searchPlaceholder="Cari nama lengkap..."
          kecamatan={kecamatan || ''}
          kecamatanOptions={kecamatanOptions}
          status={status || ''}
          statusOptions={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
          statusLabel="Verifikasi"
        />
      </div>

      {data.length === 0 ? (
        <EmptyState
          variant="admin"
          message={search || status || kecamatan ? 'Tidak ada pendaftar yang cocok dengan filter.' : 'Belum ada pendaftar KTA.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm" aria-label="Tabel pendaftar KTA">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Nama Lengkap</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">WhatsApp</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Email</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tempat Lahir</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Jenis Kelamin</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Kecamatan</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Pekerjaan</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Status</th>
                <th scope="col" className="px-4 py-3 font-bold text-gray-700">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/dashboard/kta/${row.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {row.nama_lengkap}
                    </Link>
                  </td>
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
                  <td className="px-4 py-3 text-gray-600">{row.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{row.tempat_lahir || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{row.jenis_kelamin ? labelize(row.jenis_kelamin) : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{row.kecamatan}</td>
                  <td className="px-4 py-3 text-gray-600">{row.pekerjaan || '-'}</td>
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
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
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
