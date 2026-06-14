import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { getDb } from '@/src/lib/db';
import MonthlyChart from './MonthlyChart';

async function getDashboardStats() {
  if (!process.env.DATABASE_URL) return { aspirasi: 0, kta: 0, donasi: 0, berita: 0, agenda: 0, galeri: 0 };

  const sql = getDb();

  const [rows] = await sql`
    SELECT
      (SELECT COUNT(*) FROM aspirasi) as aspirasi,
      (SELECT COUNT(*) FROM kta_registrations) as kta,
      (SELECT COUNT(*) FROM donasi WHERE midtrans_status = 'SETTLEMENT') as donasi,
      (SELECT COUNT(*) FROM berita) as berita,
      (SELECT COUNT(*) FROM agenda) as agenda,
      (SELECT COUNT(*) FROM galeri) as galeri
  ` as { aspirasi: number; kta: number; donasi: number; berita: number; agenda: number; galeri: number }[];

  return {
    aspirasi: Number(rows?.aspirasi || 0),
    kta: Number(rows?.kta || 0),
    donasi: Number(rows?.donasi || 0),
    berita: Number(rows?.berita || 0),
    agenda: Number(rows?.agenda || 0),
    galeri: Number(rows?.galeri || 0),
  };
}

async function getMonthlyStats() {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();

  const rows = await sql`
    SELECT
      to_char(month_series.month, 'Mon YYYY') as label,
      COALESCE(aspirasi.cnt, 0) as aspirasi,
      COALESCE(kta.cnt, 0) as kta
    FROM (
      SELECT date_trunc('month', generate_series(
        date_trunc('month', NOW() - INTERVAL '11 months'),
        date_trunc('month', NOW()),
        '1 month'::interval
      )) as month
    ) month_series
    LEFT JOIN (
      SELECT date_trunc('month', created_at) as month, COUNT(*) as cnt
      FROM aspirasi
      WHERE created_at >= date_trunc('month', NOW() - INTERVAL '11 months')
      GROUP BY date_trunc('month', created_at)
    ) aspirasi ON month_series.month = aspirasi.month
    LEFT JOIN (
      SELECT date_trunc('month', created_at) as month, COUNT(*) as cnt
      FROM kta_registrations
      WHERE created_at >= date_trunc('month', NOW() - INTERVAL '11 months')
      GROUP BY date_trunc('month', created_at)
    ) kta ON month_series.month = kta.month
    ORDER BY month_series.month ASC
  ` as { label: string; aspirasi: number; kta: number }[];

  return rows.map((r) => ({
    label: r.label,
    aspirasi: Number(r.aspirasi),
    kta: Number(r.kta),
  }));
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats();
  const monthlyData = await getMonthlyStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.75em] font-extrabold text-gray-900">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 mt-1">
          Selamat datang, <strong>{session?.user?.name}</strong>. Berikut ringkasan data terkini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Aspirasi</p>
          <p className="text-[2em] font-extrabold text-blue-600 mt-2">{stats.aspirasi}</p>
          <p className="text-xs text-gray-400 mt-1">Seluruh pengaduan masuk</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pendaftar KTA</p>
          <p className="text-[2em] font-extrabold text-green-600 mt-2">{stats.kta}</p>
          <p className="text-xs text-gray-400 mt-1">Calon kader terdaftar</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Donasi Berhasil</p>
          <p className="text-[2em] font-extrabold text-orange-600 mt-2">{stats.donasi}</p>
          <p className="text-xs text-gray-400 mt-1">Transaksi settlement</p>
        </div>
      </div>

      {/* CMS Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Berita</p>
          <p className="text-[2em] font-extrabold text-purple-600 mt-2">{stats.berita}</p>
          <p className="text-xs text-gray-400 mt-1">Artikel terbitan</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Agenda</p>
          <p className="text-[2em] font-extrabold text-teal-600 mt-2">{stats.agenda}</p>
          <p className="text-xs text-gray-400 mt-1">Kegiatan terjadwal</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Galeri</p>
          <p className="text-[2em] font-extrabold text-amber-600 mt-2">{stats.galeri}</p>
          <p className="text-xs text-gray-400 mt-1">Foto terdokumentasi</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="mb-8">
        <MonthlyChart data={monthlyData} />
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/dashboard/aspirasi"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 inline-flex items-center"
          >
            📝 Lihat Log Aspirasi
          </a>
          <a
            href="/admin/dashboard/kta"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-colors focus:outline-none focus:ring-4 focus:ring-green-200 inline-flex items-center"
          >
            🪪 Kelola Pendaftar KTA
          </a>
          <a
            href="/admin/dashboard/donasi"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium hover:bg-orange-100 transition-colors focus:outline-none focus:ring-4 focus:ring-orange-200 inline-flex items-center"
          >
            💰 Riwayat Donasi
          </a>
          <a
            href="/admin/dashboard/berita"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-200 inline-flex items-center"
          >
            📰 Kelola Berita
          </a>
          <a
            href="/admin/dashboard/agenda"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-teal-50 text-teal-700 font-medium hover:bg-teal-100 transition-colors focus:outline-none focus:ring-4 focus:ring-teal-200 inline-flex items-center"
          >
            🗓️ Kelola Agenda
          </a>
          <a
            href="/admin/dashboard/galeri"
            className="min-h-[44px] px-4 py-2 rounded-lg bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors focus:outline-none focus:ring-4 focus:ring-amber-200 inline-flex items-center"
          >
            🖼️ Kelola Galeri
          </a>
        </div>
      </div>
    </div>
  );
}
