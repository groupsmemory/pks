import { describe, expect, it, vi, beforeEach } from 'vitest';
import crypto from 'crypto';
import { POST } from '@/src/app/api/midtrans/notification/route';

function computeSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
): string {
  return crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
}

function reconstructSql(callArgs: unknown[]): string {
  const strings = callArgs[0] as string[];
  const values = callArgs.slice(1);
  return strings.reduce((acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ''), '');
}

function determineFinalStatus(
  transactionStatus: string,
  fraudStatus?: string,
): string {
  switch (transactionStatus) {
    case 'capture':
      return fraudStatus === 'accept' ? 'CAPTURE' : 'DENY';
    case 'settlement':
      return 'SETTLEMENT';
    case 'deny':
      return 'DENY';
    case 'cancel':
    case 'expire':
      return transactionStatus.toUpperCase();
    case 'refund':
    case 'partial_refund':
      return 'REFUND';
    default:
      return 'PENDING';
  }
}

vi.mock('@/src/lib/db', () => ({
  getDb: vi.fn(),
}));

import { getDb } from '@/src/lib/db';

const SERVER_KEY = 'test-server-key-12345';
const VALID_ORDER_ID = 'DONASI-12345';
const VALID_STATUS_CODE = '200';
const VALID_GROSS_AMOUNT = '50000.00';

const dbMock = vi.mocked(getDb);
let mockSql: ReturnType<typeof vi.fn>;

function buildRequest(overrides: Record<string, unknown> = {}): Request {
  const defaults = {
    order_id: VALID_ORDER_ID,
    transaction_id: 'txn-001',
    transaction_status: 'settlement',
    payment_type: 'bank_transfer',
    fraud_status: 'accept',
    status_code: VALID_STATUS_CODE,
    gross_amount: VALID_GROSS_AMOUNT,
    signature_key: computeSignature(
      VALID_ORDER_ID,
      VALID_STATUS_CODE,
      VALID_GROSS_AMOUNT,
      SERVER_KEY,
    ),
  };

  const body = { ...defaults, ...overrides };
  return new Request('http://localhost/api/midtrans/notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
  process.env.MIDTRANS_SERVER_KEY = SERVER_KEY;

  mockSql = vi.fn();
  mockSql.mockResolvedValue([]);
  dbMock.mockReturnValue(mockSql as unknown as ReturnType<typeof getDb>);
});

describe('signature verification', () => {
  it('should compute the correct SHA512 signature', () => {
    const sig = computeSignature(VALID_ORDER_ID, VALID_STATUS_CODE, VALID_GROSS_AMOUNT, SERVER_KEY);
    expect(sig).toMatch(/^[a-f0-9]{128}$/);
    expect(sig).toBe(
      crypto
        .createHash('sha512')
        .update(`${VALID_ORDER_ID}${VALID_STATUS_CODE}${VALID_GROSS_AMOUNT}${SERVER_KEY}`)
        .digest('hex'),
    );
  });

  it('should return 403 when signature does not match', async () => {
    const res = await POST(buildRequest({ signature_key: 'invalid-signature' }));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Invalid signature');
  });

  it('should return 400 when signature_key is missing', async () => {
    const res = await POST(buildRequest({ signature_key: undefined }));
    expect(res.status).toBe(400);
  });

  it('should return 500 when MIDTRANS_SERVER_KEY is not configured', async () => {
    delete process.env.MIDTRANS_SERVER_KEY;
    const res = await POST(buildRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Server configuration error');
  });

  it('should return 400 when order_id is missing', async () => {
    const res = await POST(buildRequest({ order_id: undefined }));
    expect(res.status).toBe(400);
  });
});

describe('status determination', () => {
  it('should map capture + accept to CAPTURE', () => {
    expect(determineFinalStatus('capture', 'accept')).toBe('CAPTURE');
  });

  it('should map capture + deny to DENY', () => {
    expect(determineFinalStatus('capture', 'deny')).toBe('DENY');
  });

  it('should map capture + challenge to DENY', () => {
    expect(determineFinalStatus('capture', 'challenge')).toBe('DENY');
  });

  it('should map settlement to SETTLEMENT', () => {
    expect(determineFinalStatus('settlement')).toBe('SETTLEMENT');
  });

  it('should map deny to DENY', () => {
    expect(determineFinalStatus('deny')).toBe('DENY');
  });

  it('should map cancel to CANCEL', () => {
    expect(determineFinalStatus('cancel')).toBe('CANCEL');
  });

  it('should map expire to EXPIRE', () => {
    expect(determineFinalStatus('expire')).toBe('EXPIRE');
  });

  it('should map refund to REFUND', () => {
    expect(determineFinalStatus('refund')).toBe('REFUND');
  });

  it('should map partial_refund to REFUND', () => {
    expect(determineFinalStatus('partial_refund')).toBe('REFUND');
  });

  it('should map pending to PENDING', () => {
    expect(determineFinalStatus('pending')).toBe('PENDING');
  });

  it('should default unknown statuses to PENDING', () => {
    expect(determineFinalStatus('unknown_status')).toBe('PENDING');
  });
});

describe('database status update', () => {
  it('should update SETTLEMENT and set paid_at', async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const res = await POST(buildRequest({ transaction_status: 'settlement' }));
    expect(res.status).toBe(200);

    const updateCall = reconstructSql(mockSql.mock.calls[1]);
    expect(updateCall).toContain('UPDATE donasi SET');
    expect(updateCall).toContain('midtrans_status');
    expect(updateCall).toContain('paid_at = ');
    expect(updateCall).not.toContain('paid_at = null');
  });

  it('should not set paid_at timestamp for PENDING status', async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const res = await POST(buildRequest({ transaction_status: 'pending' }));
    expect(res.status).toBe(200);

    const updateCall = reconstructSql(mockSql.mock.calls[1]);
    expect(updateCall).toContain('UPDATE donasi SET');
    expect(updateCall).toContain('midtrans_status');
    expect(updateCall).toContain('paid_at = null');
  });

  it('should skip update on duplicate notification (idempotency)', async () => {
    mockSql.mockResolvedValueOnce([
      { midtrans_transaction_id: 'txn-001', midtrans_status: 'SETTLEMENT' },
    ]);

    const res = await POST(buildRequest({ transaction_status: 'settlement' }));
    expect(res.status).toBe(200);

    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it('should apply DENY status for denied settlement', async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const res = await POST(
      buildRequest({ transaction_status: 'capture', fraud_status: 'deny' }),
    );
    expect(res.status).toBe(200);

    const updateCall = reconstructSql(mockSql.mock.calls[1]);
    expect(updateCall).toContain('DENY');
    expect(updateCall).toContain('paid_at = null');
  });

  it('should return 500 when database throws', async () => {
    dbMock.mockImplementationOnce(() => {
      throw new Error('DB connection failed');
    });

    const res = await POST(buildRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Internal server error');
  });
});
