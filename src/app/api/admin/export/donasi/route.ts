import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { getDb } from '@/src/lib/db';
import { buildCsv } from '@/src/lib/csv';

const JENIS_LABEL: Record<string, string> = {
  INFAK_UMUM: 'Infak Umum',
  INFAK_DAKWAH: 'Infak Dakwah',
  INFAK_SOSIAL: 'Infak Sosial',
  INFAK_PENDIDIKAN: 'Infak Pendidikan',
};

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
    SELECT id, order_id, nama_donatur, kecamatan, jenis_donasi, jumlah_donasi,
           midtrans_status, midtrans_payment_type, created_at, paid_at
    FROM donasi
    ORDER BY created_at DESC
    LIMIT 1000
  ` as {
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
  }[];

  const headers = [
    'ID', 'Order ID', 'Nama Donatur', 'Kecamatan', 'Jenis Donasi',
    'Jumlah', 'Status', 'Metode Bayar', 'Tanggal', 'Tanggal Bayar',
  ];
  const data = rows.map((r) => [
    r.id,
    r.order_id,
    r.nama_donatur,
    r.kecamatan,
    JENIS_LABEL[r.jenis_donasi] || r.jenis_donasi,
    r.jumlah_donasi,
    r.midtrans_status,
    r.midtrans_payment_type || '',
    r.created_at,
    r.paid_at || '',
  ]);

  const csv = buildCsv(headers, data);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="donasi-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
