import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { neon } from '@neondatabase/serverless';

async function getDashboardStats() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return { aspirasi: 0, kta: 0, donasi: 0 };

  const sql = neon(databaseUrl);

  const [aspirasiRows, ktaRows, donasiRows] = await Promise.all([
    sql`SELECT COUNT(*) as total FROM aspirasi`,
    sql`SELECT COUNT(*) as total FROM kta_registrations`,
    sql`SELECT COUNT(*) as total FROM donasi WHERE midtrans_status = 'SETTLEMENT'`,
  ]);

  return {
    aspirasi: Number(aspirasiRows[0]?.total || 0),
    kta: Number(ktaRows[0]?.total || 0),
    donasi: Number(donasiRows[0]?.total || 0),
  };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats();

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
        </div>
      </div>
    </div>
  );
}
