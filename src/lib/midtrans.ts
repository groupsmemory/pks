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
 * Midtrans Core API client untuk verifikasi notifikasi webhook.
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
