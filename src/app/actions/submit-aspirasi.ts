'use server';

import { headers } from 'next/headers';
import { encryptData } from '@/src/lib/crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { neon } from '@neondatabase/serverless';

// Strict validation criteria
const PAMEKASAN_KECAMATAN = [
  'Batumarmar',
  'Galis',
  'Kadur',
  'Larangan',
  'Pademawu',
  'Pakong',
  'Palengaan',
  'Pamekasan',
  'Pasean',
  'Pegantenan',
  'Proppo',
  'Tlanakan',
  'Waru',
] as const;

type Kecamatan = typeof PAMEKASAN_KECAMATAN[number];

// 3. Hardcode the ground-truth routing metrics for PKS Pamekasan without variations
/**
 * Determines the routing parameter for the assigned_to field based on ground-truth metrics.
 */
function determineRouting(kecamatan: string): string {
  if (kecamatan === 'Pamekasan' || kecamatan === 'Tlanakan') {
    return 'Staf Ahli Suryono (Dapil 1)';
  }
  if (kecamatan === 'Proppo' || kecamatan === 'Palengaan') {
    return 'Staf Ahli H. Imam Ghozali (Dapil 2)';
  }
  if (kecamatan === 'Batumarmar' || kecamatan === 'Pasean' || kecamatan === 'Waru') {
    return "Staf Ahli Juma'ah (Dapil 3)";
  }
  if (kecamatan === 'Galis' || kecamatan === 'Larangan' || kecamatan === 'Pademawu') {
    return 'Staf Ahli Ita Kusmita (Dapil 5)';
  }
  return 'Humas DPD PKS Pamekasan (Default)';
}

/**
 * Server Action for processing Aspiration Form submission.
 * Validates inputs, extracts Server IP, encrypts NIK, and prepares payload.
 */
export async function submitAspirasi(formData: FormData) {
  // 1. Impor `headers` dari `next/headers`. (Done at top of file)
  // 2. Ekstraksi IP Sisi Server (Wajib Sesuai Audit Bug)
  // Validating the exact IP array extraction pattern as instructed.
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
      const ratelimit = new Ratelimit({
        redis: new Redis({
          url: redisUrl,
          token: redisToken,
        }),
        limiter: Ratelimit.slidingWindow(3, "24 h"),
      });

      const { success: rateLimitSuccess } = await ratelimit.limit(ipAddress);
      if (!rateLimitSuccess) {
        return {
          success: false,
          error: "Batas pengiriman harian tercapai. Anda hanya dapat mengirimkan 3 aspirasi per 24 jam.",
        };
      }
    } else {
      console.warn('[Aspirasi Submit] Upstash Redis credentials omitted; rate limiting is disabled.');
    }

    // Implement strict input validation and zero tolerance for truncated data inputs
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

    // Encrypt sensitive data using custom AES-256-GCM crypto module
    const { ciphertext: nik_encrypted, iv: iv_nik, tag: tag_nik } = encryptData(nik);

    // Hardcoded assignment based on routing metrics
    const assigned_to = determineRouting(kecamatan);

    // Payload ready for DB Insert
    const dbPayload = {
      nama_pelapor,
      nik_encrypted,
      iv_nik,
      tag_nik,
      nomor_whatsapp,
      kecamatan,
      isi_aspirasi,
      status_aspirasi: 'PENDING',
      assigned_to,
      ip_address: ipAddress,
    };

    console.log('[Aspirasi Submit] Successfully processed validation and encryption.', {
      ...dbPayload,
      nik_encrypted: '[ENCRYPTED]', // Redact inside log
      iv_nik: '[REDACTED]',
      tag_nik: '[REDACTED]'
    });

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
      routing: assigned_to,
    };
  } catch (error) {
    console.error('[Aspirasi Error] Error during submission processing', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem yang tidak diketahui.',
    };
  }
}
