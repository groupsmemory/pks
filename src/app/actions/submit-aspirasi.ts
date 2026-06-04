'use server';

import { headers } from 'next/headers';
import { encryptData } from '@/src/lib/crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { neon } from '@neondatabase/serverless';

const PAMEKASAN_KECAMATAN = [
  'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
  'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
  'Proppo', 'Tlanakan', 'Waru'
] as const;

type Kecamatan = typeof PAMEKASAN_KECAMATAN[number];

interface RoutingDetails {
  assigned_to: string;
  staff_phone: string;
}

function determineRoutingDetails(kecamatan: string): RoutingDetails {
  if (kecamatan === 'Pamekasan' || kecamatan === 'Tlanakan') {
    return { assigned_to: 'Staf Ahli Suryono (Dapil 1)', staff_phone: '6281111111111' };
  }
  if (kecamatan === 'Proppo' || kecamatan === 'Palengaan') {
    return { assigned_to: 'Staf Ahli H. Imam Ghozali (Dapil 2)', staff_phone: '6282222222222' };
  }
  if (kecamatan === 'Batumarmar' || kecamatan === 'Pasean' || kecamatan === 'Waru') {
    return { assigned_to: "Staf Ahli Juma'ah (Dapil 3)", staff_phone: '6283333333333' };
  }
  if (kecamatan === 'Galis' || kecamatan === 'Larangan' || kecamatan === 'Pademawu') {
    return { assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)', staff_phone: '6285555555555' };
  }
  return { assigned_to: 'Humas DPD PKS Pamekasan (Default)', staff_phone: '6284444444444' };
}

export async function submitAspirasi(formData: FormData) {
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
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || '';

    if (redisUrl && redisToken) {
      try {
        const ratelimit = new Ratelimit({
          redis: new Redis({ url: redisUrl, token: redisToken }),
          limiter: Ratelimit.slidingWindow(3, "24 h"),
        });

        const { success: rateLimitSuccess } = await ratelimit.limit(ipAddress);

        if (!rateLimitSuccess) {
          return {
            success: false,
            error: "Batas pengiriman harian tercapai. Anda hanya dapat mengirimkan 3 aspirasi per 24 jam.",
          };
        }
      } catch (redisError) {
        // Rate limiting gagal (Redis tidak tersedia/token invalid) — lanjutkan tanpa rate limit
        console.warn('[Aspirasi] Rate limiting skipped due to Redis error:', redisError);
      }
    }

    const nama_pelapor = formData.get('nama_pelapor')?.toString().trim();
    const nik = formData.get('nik')?.toString().trim();
    const nomor_whatsapp = formData.get('nomor_whatsapp')?.toString().trim();
    const kecamatan = formData.get('kecamatan')?.toString().trim();
    const isi_aspirasi = formData.get('isi_aspirasi')?.toString().trim();

    if (!nama_pelapor || !nik || !nomor_whatsapp || !kecamatan || !isi_aspirasi) {
      throw new Error('Validasi gagal: Semua parameter input wajib diisi secara utuh.');
    }

    if (nik.length !== 16 || !/^\d{16}$/.test(nik)) {
      throw new Error('Validasi gagal: NIK wajib berupa 16 digit angka utuh.');
    }

    if (!PAMEKASAN_KECAMATAN.includes(kecamatan as Kecamatan)) {
      throw new Error('Validasi gagal: Input kecamatan berada di luar ruang lingkup Pamekasan.');
    }

    const { ciphertext: nik_encrypted, iv: iv_nik, tag: tag_nik } = encryptData(nik);

    const routingDetails = determineRoutingDetails(kecamatan);

    const dbPayload = {
      nama_pelapor,
      nik_encrypted,
      iv_nik,
      tag_nik,
      nomor_whatsapp,
      kecamatan,
      isi_aspirasi,
      status_aspirasi: 'PENDING',
      assigned_to: routingDetails.assigned_to,
      ip_address: ipAddress,
    };

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('Konfigurasi gagal: URL Database tidak ditemukan.');
    }

    const sql = neon(databaseUrl);

    await sql`
      INSERT INTO aspirasi (
        nama_pelapor,
        nik_encrypted,
        iv_nik,
        tag_nik,
        nomor_whatsapp,
        kecamatan,
        isi_aspirasi,
        status_aspirasi,
        assigned_to,
        ip_address
      ) VALUES (
        ${dbPayload.nama_pelapor},
        ${dbPayload.nik_encrypted},
        ${dbPayload.iv_nik},
        ${dbPayload.tag_nik},
        ${dbPayload.nomor_whatsapp},
        ${dbPayload.kecamatan},
        ${dbPayload.isi_aspirasi},
        ${dbPayload.status_aspirasi},
        ${dbPayload.assigned_to},
        ${dbPayload.ip_address}
      )
    `;

    return {
      success: true,
      message: 'Aspirasi sukses tervalidasi dan telah diamankan.',
      routing: routingDetails.assigned_to,
      staff_phone: routingDetails.staff_phone,
    };
  } catch (error) {
    console.error('[Aspirasi Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem yang tidak diketahui.',
    };
  }
}
