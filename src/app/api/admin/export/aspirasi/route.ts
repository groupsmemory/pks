import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { getDb } from '@/src/lib/db';
import { buildCsv } from '@/src/lib/csv';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Forbidden: only Super Admin can export data', { status: 403 });
  }

  if (!process.env.DATABASE_URL) {
    return new NextResponse('Database not configured', { status: 500 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, nama_pelapor, kecamatan, isi_aspirasi, status_aspirasi, assigned_to, created_at
    FROM aspirasi
    ORDER BY created_at DESC
    LIMIT 1000
  ` as {
    id: string;
    nama_pelapor: string;
    kecamatan: string;
    isi_aspirasi: string;
    status_aspirasi: string;
    assigned_to: string;
    created_at: string;
  }[];

  const headers = ['ID', 'Nama Pelapor', 'Kecamatan', 'Isi Aspirasi', 'Status', 'Diteruskan Ke', 'Tanggal'];
  const data = rows.map((r) => [
    r.id,
    r.nama_pelapor,
    r.kecamatan,
    r.isi_aspirasi,
    r.status_aspirasi,
    r.assigned_to,
    r.created_at,
  ]);

  const csv = buildCsv(headers, data);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="aspirasi-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
