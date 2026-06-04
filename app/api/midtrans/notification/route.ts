import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

/**
 * Midtrans HTTP Notification Webhook Handler
 * Endpoint: POST /api/midtrans/notification
 *
 * Midtrans akan mengirim notifikasi ke endpoint ini setiap kali
 * status transaksi berubah (settlement, expire, cancel, dll).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      order_id,
      transaction_id,
      transaction_status,
      payment_type,
      fraud_status,
      signature_key,
      status_code,
      gross_amount,
    } = body;

    if (!order_id || !signature_key) {
      return NextResponse.json(
        { error: 'Invalid notification payload' },
        { status: 400 }
      );
    }

    // Verifikasi signature dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error('[Midtrans Webhook] MIDTRANS_SERVER_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.error('[Midtrans Webhook] Invalid signature for order:', order_id);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Tentukan status final berdasarkan transaction_status + fraud_status
    let finalStatus: string;

    if (transaction_status === 'capture') {
      finalStatus = fraud_status === 'accept' ? 'CAPTURE' : 'DENY';
    } else if (transaction_status === 'settlement') {
      finalStatus = 'SETTLEMENT';
    } else if (transaction_status === 'deny') {
      finalStatus = 'DENY';
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
      finalStatus = transaction_status.toUpperCase();
    } else if (transaction_status === 'refund' || transaction_status === 'partial_refund') {
      finalStatus = 'REFUND';
    } else if (transaction_status === 'pending') {
      finalStatus = 'PENDING';
    } else {
      finalStatus = 'PENDING';
    }

    // Update database
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[Midtrans Webhook] DATABASE_URL not configured');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    const isSettled = finalStatus === 'SETTLEMENT' || finalStatus === 'CAPTURE';

    await sql`
      UPDATE donasi SET
        midtrans_transaction_id = ${transaction_id || null},
        midtrans_payment_type = ${payment_type || null},
        midtrans_status = ${finalStatus},
        paid_at = ${isSettled ? new Date().toISOString() : null},
        updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ${order_id}
    `;

    console.log(`[Midtrans Webhook] Order ${order_id} updated to ${finalStatus}`);

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Midtrans Webhook Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
