'use server';

import { headers } from 'next/headers';
import { neon } from '@neondatabase/serverless';
import { encryptData } from '@/src/lib/crypto';

const PAMEKASAN_KECAMATAN = [
  'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
  'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
  'Proppo', 'Tlanakan', 'Waru',
] as const;

type Kecamatan = typeof PAMEKASAN_KECAMATAN[number];

export async function submitKta(formData: FormData) {
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
    const nama_lengkap = formData.get('nama_lengkap')?.toString().trim();
    const nik = formData.get('nik')?.toString().trim();
    const nomor_whatsapp = formData.get('nomor_whatsapp')?.toString().trim();
    const kecamatan = formData.get('kecamatan')?.toString().trim();

    if (!nama_lengkap || !nik || !nomor_whatsapp || !kecamatan) {
      throw new Error('Validasi gagal: Semua field wajib diisi secara lengkap.');
    }

    if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
      throw new Error('Validasi gagal: NIK harus berupa tepat 16 digit angka.');
    }

    if (!PAMEKASAN_KECAMATAN.includes(kecamatan as Kecamatan)) {
      throw new Error('Validasi gagal: Kecamatan tidak termasuk dalam wilayah Kabupaten Pamekasan.');
    }

    const { ciphertext: encrypted_nik, iv: iv_nik, tag: tag_nik } = encryptData(nik);

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('Konfigurasi gagal: DATABASE_URL tidak ditemukan di environment.');
    }

    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO kta_registrations (
        nama_lengkap,
        encrypted_nik,
        iv_nik,
        tag_nik,
        nomor_whatsapp,
        kecamatan,
        status_verifikasi
      ) VALUES (
        ${nama_lengkap},
        ${encrypted_nik},
        ${iv_nik},
        ${tag_nik},
        ${nomor_whatsapp},
        ${kecamatan},
        'PENDING'
      )
    `;

    return {
      success: true,
      message: 'Pendaftaran KTA Anda berhasil dikirim secara aman.',
    };
  } catch (error) {
    console.error('[KTA Registration Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem yang tidak diketahui.',
    };
  }
}
