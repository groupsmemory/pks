'use server';

import { headers } from 'next/headers';
import { getDb } from '@/src/lib/db';
import { getSnapClient, cancelMidtransTransaction } from '@/src/lib/midtrans';
import { parseFormData } from '@/src/validations/helpers';
import { donasiSchema } from '@/src/validations/donasi';
import { JENIS_DONASI } from '@/src/validations/index';

export type JenisDonasi = typeof JENIS_DONASI[number];

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
    const data = parseFormData(formData, donasiSchema);
    const { nama_donatur, nomor_whatsapp, kecamatan, jenis_donasi, jumlah_donasi } = data;
    const email = data.email || null;
    const pesan_donatur = data.pesan_donatur || null;

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
          name: `${JENIS_DONASI_LABEL[jenis_donasi]} - DPD PKS Pamekasan`,
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

    // Save to NeonDB dalam transaction — rollback Midtrans jika gagal
    const sql = getDb();

    try {
      await sql.transaction([
        sql`
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
        `,
      ]);
    } catch (dbError) {
      await cancelMidtransTransaction(order_id);
      throw dbError;
    }

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
