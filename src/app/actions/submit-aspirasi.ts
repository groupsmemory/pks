'use server';

import { headers } from 'next/headers';
import { encryptData } from '@/src/lib/crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getDb } from '@/src/lib/db';
import { parseFormData } from '@/src/validations/helpers';
import { aspirasiSchema } from '@/src/validations/aspirasi';
import { createNotification } from '@/src/lib/notifications';

const DEFAULT_ROUTING = { assigned_to: 'Humas DPD PKS Pamekasan (Default)', staff_phone: '6284444444444' };

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

    const { nama_pelapor, nik, nomor_whatsapp, kecamatan, isi_aspirasi } = parseFormData(formData, aspirasiSchema);

    const { ciphertext: nik_encrypted, iv: iv_nik, tag: tag_nik } = encryptData(nik);

    const sql = getDb();

    const routing = await sql`
      SELECT assigned_to, staff_phone FROM dapil_routing WHERE kecamatan = ${kecamatan} LIMIT 1
    `;

    const routingDetails = (routing as { assigned_to: string; staff_phone: string }[])[0] || DEFAULT_ROUTING;

    const [inserted] = await sql`
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
        ${nama_pelapor},
        ${nik_encrypted},
        ${iv_nik},
        ${tag_nik},
        ${nomor_whatsapp},
        ${kecamatan},
        ${isi_aspirasi},
        'PENDING',
        ${routingDetails.assigned_to},
        ${ipAddress}
      )
      RETURNING id
    ` as { id: string }[];

    const aspirasiId = inserted?.id;
    if (aspirasiId) {
      await createNotification({
        type: 'aspirasi_baru',
        title: 'Aspirasi Baru Masuk',
        message: `${nama_pelapor} dari Kec. ${kecamatan} mengirimkan aspirasi baru.`,
        referenceId: aspirasiId,
      });
    }

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
