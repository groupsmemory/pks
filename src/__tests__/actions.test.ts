import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('@/src/lib/db', () => ({
  getDb: vi.fn(),
}));

vi.mock('@/src/lib/midtrans', () => ({
  getSnapClient: vi.fn(),
  cancelMidtransTransaction: vi.fn(),
}));

import { headers } from 'next/headers';
import { getDb } from '@/src/lib/db';
import { getSnapClient, cancelMidtransTransaction } from '@/src/lib/midtrans';
import { submitAspirasi } from '@/src/app/actions/submit-aspirasi';
import { submitKta } from '@/src/app/actions/submit-kta';
import { createDonation } from '@/src/app/actions/create-donation';

const mockHeaders = vi.mocked(headers);
const mockGetDb = vi.mocked(getDb);
const mockGetSnapClient = vi.mocked(getSnapClient);
const mockCancelMidtrans = vi.mocked(cancelMidtransTransaction);

let mockSql: ReturnType<typeof vi.fn>;

function setFormData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    fd.append(k, v);
  }
  return fd;
}

beforeEach(() => {
  vi.restoreAllMocks();

  mockHeaders.mockResolvedValue(new Headers({ 'x-forwarded-for': '192.168.1.1' }));

  mockSql = vi.fn();
  mockSql.mockResolvedValue([]);
  mockSql.transaction = vi.fn().mockResolvedValue([]);
  mockGetDb.mockReturnValue(mockSql as unknown as ReturnType<typeof getDb>);

  process.env.MIDTRANS_SERVER_KEY = 'dummy-server-key';
  process.env.APP_URL = 'http://localhost:3000';
});

describe('submitAspirasi', () => {
  const validEntries = {
    nama_pelapor: 'Budi Santoso',
    nik: '3520010101010001',
    nomor_whatsapp: '6281234567890',
    kecamatan: 'Pamekasan',
    isi_aspirasi: 'Saya ingin melaporkan...',
  };

  it('should submit aspirasi successfully with routing', async () => {
    mockSql.mockResolvedValueOnce([
      { assigned_to: 'Staf Ahli Suryono (Dapil 1)', staff_phone: '6281111111111' },
    ]);
    mockSql.mockResolvedValueOnce([]);

    const result = await submitAspirasi(setFormData(validEntries));

    expect(result.success).toBe(true);
    expect(result.routing).toBe('Staf Ahli Suryono (Dapil 1)');
    expect(result.staff_phone).toBe('6281111111111');
  });

  it('should fall back to default routing when kecamatan is unmapped', async () => {
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);

    const result = await submitAspirasi(
      setFormData({ ...validEntries, kecamatan: 'Kadur' }),
    );

    expect(result.success).toBe(true);
    expect(result.routing).toBe('Humas DPD PKS Pamekasan (Default)');
  });

  it('should return error on validation failure', async () => {
    const result = await submitAspirasi(
      setFormData({ ...validEntries, nik: '123' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('NIK harus berupa tepat 16 digit angka');
  });

  it('should return error on missing required field', async () => {
    const result = await submitAspirasi(
      setFormData({ ...validEntries, nama_pelapor: '' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Nama pelapor wajib diisi');
  });

  it('should return error when database throws', async () => {
    mockSql.mockRejectedValueOnce(new Error('Connection refused'));

    const result = await submitAspirasi(setFormData(validEntries));

    expect(result.success).toBe(false);
    expect(result.error).toBe('Connection refused');
  });
});

describe('submitKta', () => {
  const validEntries = {
    nama_lengkap: 'Siti Aisyah',
    nik: '3520014501010002',
    nomor_whatsapp: '6285234567890',
    kecamatan: 'Larangan',
  };

  it('should submit KTA registration successfully', async () => {
    mockSql.mockResolvedValueOnce([]);

    const result = await submitKta(setFormData(validEntries));

    expect(result.success).toBe(true);
    expect(result.message).toContain('KTA');
  });

  it('should return error on invalid phone number', async () => {
    const result = await submitKta(
      setFormData({ ...validEntries, nomor_whatsapp: '081234567890' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Nomor WhatsApp');
  });

  it('should return error on invalid NIK', async () => {
    const result = await submitKta(
      setFormData({ ...validEntries, nik: '1111111111111111' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Kode provinsi pada NIK tidak valid');
  });

  it('should return error when database throws', async () => {
    mockSql.mockRejectedValueOnce(new Error('Timeout'));

    const result = await submitKta(setFormData(validEntries));

    expect(result.success).toBe(false);
    expect(result.error).toBe('Timeout');
  });
});

describe('createDonation', () => {
  const validEntries = {
    nama_donatur: 'Ahmad Fauzi',
    email: 'ahmad@example.com',
    nomor_whatsapp: '6281234567890',
    kecamatan: 'Proppo',
    jenis_donasi: 'INFAK_UMUM',
    jumlah_donasi: '50000',
    pesan_donatur: 'Semoga berkah',
  };

  const mockSnapResponse = {
    token: 'snap-token-xyz',
    redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/xyz',
  };

  beforeEach(() => {
    mockGetSnapClient.mockReturnValue({
      createTransaction: vi.fn().mockResolvedValue(mockSnapResponse),
    } as unknown as ReturnType<typeof getSnapClient>);
  });

  it('should create donation with Midtrans transaction successfully', async () => {
    const result = await createDonation(setFormData(validEntries));

    expect(result.success).toBe(true);
    expect(result.snap_token).toBe('snap-token-xyz');
    expect(result.snap_redirect_url).toBe(mockSnapResponse.redirect_url);
    expect(result.order_id).toMatch(/^PKS-DNZ-/);
  });

  it('should accept donation without optional email and message', async () => {
    mockGetSnapClient.mockReturnValue({
      createTransaction: vi.fn().mockResolvedValue(mockSnapResponse),
    } as unknown as ReturnType<typeof getSnapClient>);

    const { email, pesan_donatur, ...required } = validEntries;
    const result = await createDonation(setFormData(required));

    expect(result.success).toBe(true);
  });

  it('should return error on donation below minimum', async () => {
    const result = await createDonation(
      setFormData({ ...validEntries, jumlah_donasi: '5000' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Minimal donasi');
  });

  it('should return error when Midtrans API fails', async () => {
    mockGetSnapClient.mockReturnValue({
      createTransaction: vi.fn().mockRejectedValue(new Error('Midtrans timeout')),
    } as unknown as ReturnType<typeof getSnapClient>);

    const result = await createDonation(setFormData(validEntries));

    expect(result.success).toBe(false);
    expect(result.error).toBe('Midtrans timeout');
  });

  it('should cancel Midtrans transaction when DB insert fails', async () => {
    mockGetSnapClient.mockReturnValue({
      createTransaction: vi.fn().mockResolvedValue(mockSnapResponse),
    } as unknown as ReturnType<typeof getSnapClient>);

    mockSql.transaction.mockRejectedValueOnce(new Error('DB insert failed'));

    const result = await createDonation(setFormData(validEntries));

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB insert failed');
    expect(mockCancelMidtrans).toHaveBeenCalledTimes(1);
    expect(mockCancelMidtrans).toHaveBeenCalledWith(expect.stringMatching(/^PKS-DNZ-/));
  });

  it('should return error on invalid kecamatan', async () => {
    const result = await createDonation(
      setFormData({ ...validEntries, kecamatan: 'Jakarta' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Kecamatan tidak valid');
  });
});
