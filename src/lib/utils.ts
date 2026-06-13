export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

function isValidDate(day: number, month: number, year: number): boolean {
  const adjustedDay = day > 40 ? day - 40 : day;
  if (adjustedDay < 1 || adjustedDay > 31) return false;
  if (month < 1 || month > 12) return false;
  const fullYear = 2000 + year;
  const date = new Date(fullYear, month - 1, adjustedDay);
  return (
    date.getFullYear() === fullYear &&
    date.getMonth() === month - 1 &&
    date.getDate() === adjustedDay
  );
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateNIK(nik: string): ValidationResult {
  if (!/^\d{16}$/.test(nik)) {
    return { valid: false, error: 'NIK harus berupa tepat 16 digit angka' };
  }

  const provinceCode = parseInt(nik.substring(0, 2), 10);
  if (provinceCode < 11 || provinceCode > 94) {
    return { valid: false, error: 'Kode provinsi pada NIK tidak valid' };
  }

  const day = parseInt(nik.substring(6, 8), 10);
  const month = parseInt(nik.substring(8, 10), 10);
  const year = parseInt(nik.substring(10, 12), 10);
  if (!isValidDate(day, month, year)) {
    return { valid: false, error: 'Tanggal lahir dalam NIK tidak valid' };
  }

  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, error: 'Nomor WhatsApp wajib diisi' };
  }
  if (!/^62\d{8,13}$/.test(phone)) {
    return { valid: false, error: 'Nomor WhatsApp harus diawali 62 dan terdiri dari 10-15 digit' };
  }
  return { valid: true };
}
