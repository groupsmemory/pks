import { getDb } from '@/src/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KtaStatusActions from './KtaStatusActions';

interface KtaDetail {
  id: string;
  nama_lengkap: string;
  nama_panggilan: string | null;
  encrypted_nik: string;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  golongan_darah: string | null;
  provinsi: string;
  kota_kabupaten: string;
  kecamatan: string;
  kelurahan_desa: string | null;
  alamat_ktp: string | null;
  rt: string | null;
  rw: string | null;
  alamat_domisili: string | null;
  negara: string;
  kode_referal: string | null;
  agama: string | null;
  status_perkawinan: string | null;
  pekerjaan: string | null;
  pendidikan_terakhir: string | null;
  email: string | null;
  nomor_whatsapp: string;
  ktp_image_base64: string | null;
  ktp_image_type: string | null;
  profile_image_base64: string | null;
  profile_image_type: string | null;
  not_committee: boolean;
  agree: boolean;
  status_verifikasi: string;
  created_at: string;
}

async function getKtaDetail(id: string): Promise<KtaDetail | null> {
  if (!process.env.DATABASE_URL) return null;
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM kta_registrations WHERE id = ${id} LIMIT 1
  ` as KtaDetail[];
  return rows[0] || null;
}

function labelize(value: string | null): string {
  if (!value) return '-';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const LABEL_MAP: Record<string, string> = {
  nama_lengkap: 'Nama Lengkap',
  nama_panggilan: 'Nama Panggilan',
  encrypted_nik: 'NIK (Terenkripsi)',
  tempat_lahir: 'Tempat Lahir',
  tanggal_lahir: 'Tanggal Lahir',
  jenis_kelamin: 'Jenis Kelamin',
  golongan_darah: 'Golongan Darah',
  provinsi: 'Provinsi',
  kota_kabupaten: 'Kota / Kabupaten',
  kecamatan: 'Kecamatan',
  kelurahan_desa: 'Kelurahan / Desa',
  alamat_ktp: 'Alamat KTP',
  rt: 'RT',
  rw: 'RW',
  alamat_domisili: 'Alamat Domisili',
  negara: 'Negara',
  kode_referal: 'Kode Referal',
  agama: 'Agama',
  status_perkawinan: 'Status Perkawinan',
  pekerjaan: 'Pekerjaan',
  pendidikan_terakhir: 'Pendidikan Terakhir',
  email: 'Email',
  nomor_whatsapp: 'No. WhatsApp',
  status_verifikasi: 'Status Verifikasi',
  created_at: 'Tanggal Daftar',
};

export default async function KtaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getKtaDetail(id);

  if (!data) {
    notFound();
  }

  const fieldRows: { key: string; value: string | null }[] = [
    { key: 'nama_lengkap', value: data.nama_lengkap },
    { key: 'nama_panggilan', value: data.nama_panggilan },
    { key: 'encrypted_nik', value: data.encrypted_nik ? `${data.encrypted_nik.substring(0, 20)}... (AES-256-GCM)` : null },
    { key: 'tempat_lahir', value: data.tempat_lahir },
    { key: 'tanggal_lahir', value: data.tanggal_lahir ? formatDate(data.tanggal_lahir) : null },
    { key: 'jenis_kelamin', value: data.jenis_kelamin ? labelize(data.jenis_kelamin) : null },
    { key: 'golongan_darah', value: data.golongan_darah },
    { key: 'provinsi', value: data.provinsi },
    { key: 'kota_kabupaten', value: data.kota_kabupaten },
    { key: 'kecamatan', value: data.kecamatan },
    { key: 'kelurahan_desa', value: data.kelurahan_desa },
    { key: 'alamat_ktp', value: data.alamat_ktp },
    { key: 'rt', value: data.rt },
    { key: 'rw', value: data.rw },
    { key: 'alamat_domisili', value: data.alamat_domisili || null },
    { key: 'negara', value: data.negara },
    { key: 'kode_referal', value: data.kode_referal || null },
    { key: 'agama', value: data.agama ? labelize(data.agama) : null },
    { key: 'status_perkawinan', value: data.status_perkawinan ? labelize(data.status_perkawinan) : null },
    { key: 'pekerjaan', value: data.pekerjaan },
    { key: 'pendidikan_terakhir', value: data.pendidikan_terakhir },
    { key: 'email', value: data.email || null },
    { key: 'nomor_whatsapp', value: data.nomor_whatsapp },
    { key: 'status_verifikasi', value: data.status_verifikasi },
    { key: 'created_at', value: formatDate(data.created_at) },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return `inline-block px-3 py-1 text-sm font-bold rounded ${styles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard/kta"
            className="text-sm text-blue-600 hover:underline mb-2 inline-block"
          >
            &larr; Kembali ke daftar
          </Link>
          <h1 className="text-[1.5em] font-extrabold text-gray-900">
            Detail Pendaftar KTA
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Data lengkap pendaftar — <span className={statusBadge(data.status_verifikasi)}>{data.status_verifikasi}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main data */}
        <div className="xl:col-span-2 space-y-6">
          {/* Data Diri */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Data Diri & Alamat</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {fieldRows.map(({ key, value }) => (
                  <div key={key} className={key === 'alamat_ktp' || key === 'alamat_domisili' ? 'sm:col-span-2' : ''}>
                    <dt className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {LABEL_MAP[key] || key}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {key === 'status_verifikasi' ? (
                        <span className={statusBadge(value || '')}>{value}</span>
                      ) : key === 'nomor_whatsapp' && value ? (
                        <a href={`https://wa.me/${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {value}
                        </a>
                      ) : key === 'email' && value ? (
                        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
                          {value}
                        </a>
                      ) : (
                        value || <span className="text-gray-400 italic">-</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Pernyataan */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Pernyataan</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${data.not_committee ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {data.not_committee ? '✓' : '✗'}
                </span>
                <span className="text-sm text-gray-700">Bukan pengurus partai politik lain</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${data.agree ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {data.agree ? '✓' : '✗'}
                </span>
                <span className="text-sm text-gray-700">Menyetujui pernyataan data</span>
              </div>
            </div>
          </div>

          {data.status_verifikasi === 'PENDING' && (
            <KtaStatusActions id={data.id} />
          )}
        </div>

        {/* Sidebar: Images */}
        <div className="space-y-6">
          {/* Foto KTP */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Foto / Scan KTP</h2>
            </div>
            <div className="p-4">
              {data.ktp_image_base64 ? (
                <img
                  src={`data:${data.ktp_image_type || 'image/jpeg'};base64,${data.ktp_image_base64}`}
                  alt="KTP"
                  className="w-full rounded-lg border border-gray-200"
                />
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-8">Tidak ada file KTP</p>
              )}
            </div>
          </div>

          {/* Foto Diri */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Foto Diri</h2>
            </div>
            <div className="p-4">
              {data.profile_image_base64 ? (
                <img
                  src={`data:${data.profile_image_type || 'image/jpeg'};base64,${data.profile_image_base64}`}
                  alt="Foto Diri"
                  className="w-full rounded-lg border border-gray-200"
                />
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-8">Tidak ada foto diri</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
