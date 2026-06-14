'use server';

import { headers } from 'next/headers';
import { getDb } from '@/src/lib/db';
import { encryptData } from '@/src/lib/crypto';
import { parseFormData } from '@/src/validations/helpers';
import { ktaSchema } from '@/src/validations/kta';
import { createNotification } from '@/src/lib/notifications';

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
    const { nama_lengkap, nik, nomor_whatsapp, kecamatan } = parseFormData(formData, ktaSchema);

    const { ciphertext: encrypted_nik, iv: iv_nik, tag: tag_nik } = encryptData(nik);

    const sql = getDb();

    const [inserted] = await sql`
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
      RETURNING id
    ` as { id: string }[];

    const ktaId = inserted?.id;
    if (ktaId) {
      await createNotification({
        type: 'kta_baru',
        title: 'Pendaftar KTA Baru',
        message: `${nama_lengkap} dari Kec. ${kecamatan} mendaftar KTA baru.`,
        referenceId: ktaId,
      });
    }

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
