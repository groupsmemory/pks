import { describe, expect, it } from 'vitest';
import { nikSchema } from '@/src/validations/nik';
import { phoneSchema } from '@/src/validations/phone';
import { donasiSchema } from '@/src/validations/donasi';

describe('nikSchema', () => {
  it('should accept a valid NIK with male date', () => {
    const result = nikSchema.safeParse('3520010101010001');
    expect(result.success).toBe(true);
  });

  it('should accept a valid NIK with female date (day + 40)', () => {
    const result = nikSchema.safeParse('3520014501010001');
    expect(result.success).toBe(true);
  });

  it('should reject NIK shorter than 16 digits', () => {
    const result = nikSchema.safeParse('352001010101001');
    expect(result.success).toBe(false);
  });

  it('should reject NIK longer than 16 digits', () => {
    const result = nikSchema.safeParse('35200101010100011');
    expect(result.success).toBe(false);
  });

  it('should reject NIK with non-digit characters', () => {
    const result = nikSchema.safeParse('3520010a01010001');
    expect(result.success).toBe(false);
  });

  it('should reject NIK with invalid province code (< 11)', () => {
    const result = nikSchema.safeParse('1020010101010001');
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Kode provinsi pada NIK tidak valid');
  });

  it('should reject NIK with invalid province code (> 94)', () => {
    const result = nikSchema.safeParse('9520010101010001');
    expect(result.success).toBe(false);
  });

  it('should reject NIK with invalid date (month > 12)', () => {
    const result = nikSchema.safeParse('3520010113010001');
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Tanggal lahir dalam NIK tidak valid');
  });

  it('should reject NIK with invalid date (day > 31, female adjusted)', () => {
    const result = nikSchema.safeParse('3520017201010001');
    expect(result.success).toBe(false);
  });
});

describe('phoneSchema', () => {
  it('should accept a valid phone number', () => {
    const result = phoneSchema.safeParse('6281234567890');
    expect(result.success).toBe(true);
  });

  it('should accept the minimum length phone number (10 digits)', () => {
    const result = phoneSchema.safeParse('6212345678');
    expect(result.success).toBe(true);
  });

  it('should accept the maximum length phone number (15 digits)', () => {
    const result = phoneSchema.safeParse('621234567890123');
    expect(result.success).toBe(true);
  });

  it('should reject phone number not starting with 62', () => {
    const result = phoneSchema.safeParse('081234567890');
    expect(result.success).toBe(false);
  });

  it('should reject phone number with too few digits', () => {
    const result = phoneSchema.safeParse('621234567');
    expect(result.success).toBe(false);
  });

  it('should reject phone number with too many digits', () => {
    const result = phoneSchema.safeParse('6212345678901234');
    expect(result.success).toBe(false);
  });

  it('should reject empty phone number', () => {
    const result = phoneSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('should reject phone number with non-digit characters after 62', () => {
    const result = phoneSchema.safeParse('62abc1234567');
    expect(result.success).toBe(false);
  });
});

describe('donasiSchema fields', () => {
  const validDonasi = {
    nama_donatur: 'John Doe',
    email: 'john@example.com',
    nomor_whatsapp: '6281234567890',
    kecamatan: 'Pamekasan' as const,
    jenis_donasi: 'INFAK_UMUM' as const,
    jumlah_donasi: 50000,
  };

  describe('email', () => {
    it('should accept a valid email', () => {
      const result = donasiSchema.safeParse(validDonasi);
      expect(result.success).toBe(true);
    });

    it('should accept empty string for email', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, email: '' });
      expect(result.success).toBe(true);
    });

    it('should accept undefined for email', () => {
      const { email, ...rest } = validDonasi;
      const result = donasiSchema.safeParse(rest);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, email: 'not-an-email' });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0]?.message).toBe('Format email tidak valid');
    });
  });

  describe('kecamatan', () => {
    it('should accept each valid kecamatan value', () => {
      const kecamatans = [
        'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
        'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
        'Proppo', 'Tlanakan', 'Waru',
      ];
      for (const k of kecamatans) {
        const result = donasiSchema.safeParse({ ...validDonasi, kecamatan: k });
        expect(result.success).toBe(true);
      }
    });

    it('should reject invalid kecamatan', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, kecamatan: 'Jakarta' });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0]?.message).toBe('Kecamatan tidak valid');
    });
  });

  describe('jumlah_donasi', () => {
    it('should accept a valid donation amount', () => {
      const result = donasiSchema.safeParse(validDonasi);
      expect(result.success).toBe(true);
    });

    it('should accept the minimum donation (10000)', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: 10000 });
      expect(result.success).toBe(true);
    });

    it('should accept the maximum donation (100000000)', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: 100000000 });
      expect(result.success).toBe(true);
    });

    it('should accept a string number (coerced)', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: '50000' });
      expect(result.success).toBe(true);
    });

    it('should reject donation below minimum', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: 9999 });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0]?.message).toBe('Minimal donasi adalah Rp 10.000');
    });

    it('should reject donation above maximum', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: 100000001 });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0]?.message).toBe('Maksimal donasi per transaksi adalah Rp 100.000.000');
    });

    it('should reject non-integer donation', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: 123.45 });
      expect(result.success).toBe(false);
      expect(result.error?.errors[0]?.message).toBe('Jumlah donasi harus berupa angka');
    });

    it('should reject NaN donation', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: 'not-a-number' });
      expect(result.success).toBe(false);
    });

    it('should reject empty donation', () => {
      const result = donasiSchema.safeParse({ ...validDonasi, jumlah_donasi: undefined });
      expect(result.success).toBe(false);
    });
  });
});
