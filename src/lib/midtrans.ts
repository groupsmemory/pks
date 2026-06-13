import midtransClient from 'midtrans-client';

/**
 * Midtrans Snap client instance (server-side only).
 * Menggunakan Server Key untuk membuat transaksi.
 */
export function getSnapClient() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

  if (!serverKey) {
    throw new Error('CRITICAL: MIDTRANS_SERVER_KEY environment variable is undefined.');
  }

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  });
}

/**
 * Midtrans Core API client untuk verifikasi notifikasi webhook & cancel transaksi.
 */
export function getCoreApiClient() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

  if (!serverKey) {
    throw new Error('CRITICAL: MIDTRANS_SERVER_KEY environment variable is undefined.');
  }

  return new midtransClient.CoreApi({
    isProduction,
    serverKey,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  });
}

/**
 * Membatalkan transaksi Midtrans yang masih berstatus pending/challenge.
 * Dipanggil jika penyimpanan ke database gagal setelah transaksi Midtrans berhasil dibuat.
 */
export async function cancelMidtransTransaction(orderId: string): Promise<void> {
  try {
    const coreApi = getCoreApiClient();
    await coreApi.transaction.cancel(orderId);
  } catch (error) {
    console.error(`[Midtrans] Gagal membatalkan transaksi ${orderId}:`, error);
  }
}
