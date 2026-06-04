'use server';

import { headers } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { getSnapClient } from '@/src/lib/midtrans';

const PAMEKASAN_KECAMATAN = [
  'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
  'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
  'Proppo', 'Tlanakan', 'Waru',
] as const;

const JENIS_DONASI = ['INFAK_UMUM', 'INFAK_DAKWAH', 'INFAK_SOSIAL', 'INFAK_PENDIDIKAN'] as const;

type Kecamatan = typeof PAMEKASAN_KECAMATAN[number];
type JenisDonasi = typeof JENIS_DONASI[number];

const JENIS_DONASI_LABEL: Record<JenisDonasi, string> = {
  INFAK_UMUM: 'Infak Umum',
  INFAK_DAKWAH: 'Infak Dakwah',
  INFAK_SOSIAL: 'Infak Sosial',
  INFAK_PENDIDIKAN: 'Infak Pendidikan',
};

export async function createDonation(formData: FormData) {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  let ipAddress = '127.0.0.1';

  if (forwardedFor) {
    const ipArray = forwardedFor.split(',');
    if (ipArray[0]) {
      ipAddress = ipArray[0].trim();
    }
  }

  try {
    // Extract & validate form data
    const nama_donatur = formData.get('nama_donatur')?.toString().trim();
    const email = formData.get('email')?.toString().trim() || null;
    const nomor_whatsapp = formData.get('nomor_whatsapp')?.toString().trim();
    const kecamatan = formData.get('kecamatan')?.toString().trim();
    const jenis_donasi = formData.get('jenis_donasi')?.toString().trim();
    const jumlah_donasi_str = formData.get('jumlah_donasi')?.toString().trim();
    const pesan_donatur = formData.get('pesan_donatur')?.toString().trim() || null;

    if (!nama_donatur || !nomor_whatsapp || !kecamatan || !jenis_donasi || !jumlah_donasi_str) {
      throw new Error('Validasi gagal: Semua field wajib harus diisi.');
    }

    const jumlah_donasi = parseInt(jumlah_donasi_str, 10);
    if (isNaN(jumlah_donasi) || jumlah_donasi < 10000) {
      throw new Error('Validasi gagal: Minimal donasi adalah Rp 10.000.');
    }

    if (jumlah_donasi > 100000000) {
      throw new Error('Validasi gagal: Maksimal donasi per transaksi adalah Rp 100.000.000.');
    }

    if (!PAMEKASAN_KECAMATAN.includes(kecamatan as Kecamatan)) {
      throw new Error('Validasi gagal: Kecamatan tidak valid.');
    }

    if (!JENIS_DONASI.includes(jenis_donasi as JenisDonasi)) {
      throw new Error('Validasi gagal: Jenis donasi tidak valid.');
    }

    // Generate unique order ID
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const order_id = `PKS-DNZ-${timestamp}-${randomSuffix}`;

    // Create Midtrans Snap transaction
    const snap = getSnapClient();

    const transactionParams = {
      transaction_details: {
        order_id,
        gross_amount: jumlah_donasi,
      },
      item_details: [
        {
          id: jenis_donasi,
          price: jumlah_donasi,
          quantity: 1,
          name: `${JENIS_DONASI_LABEL[jenis_donasi as JenisDonasi]} - DPD PKS Pamekasan`,
        },
      ],
      customer_details: {
        first_name: nama_donatur,
        email: email || undefined,
        phone: nomor_whatsapp,
      },
      callbacks: {
        finish: `${process.env.APP_URL || 'http://localhost:3000'}/donasi/selesai?order_id=${order_id}`,
      },
    };

    const snapResponse = await snap.createTransaction(transactionParams);

    // Save to NeonDB
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('Konfigurasi gagal: DATABASE_URL tidak ditemukan.');
    }

    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO donasi (
        order_id,
        nama_donatur,
        email,
        nomor_whatsapp,
        kecamatan,
        jenis_donasi,
        jumlah_donasi,
        pesan_donatur,
        midtrans_status,
        snap_token,
        snap_redirect_url,
        ip_address
      ) VALUES (
        ${order_id},
        ${nama_donatur},
        ${email},
        ${nomor_whatsapp},
        ${kecamatan},
        ${jenis_donasi},
        ${jumlah_donasi},
        ${pesan_donatur},
        'PENDING',
        ${snapResponse.token},
        ${snapResponse.redirect_url},
        ${ipAddress}
      )
    `;

    return {
      success: true,
      message: 'Transaksi donasi berhasil dibuat.',
      snap_token: snapResponse.token,
      snap_redirect_url: snapResponse.redirect_url,
      order_id,
    };
  } catch (error) {
    console.error('[Donasi Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem.',
    };
  }
}
