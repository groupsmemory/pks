import { z } from 'zod';

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

export const nikSchema = z
  .string()
  .length(16, 'NIK harus berupa tepat 16 digit angka')
  .regex(/^\d{16}$/, 'NIK harus berupa tepat 16 digit angka')
  .refine(
    (nik) => {
      const provinceCode = parseInt(nik.substring(0, 2), 10);
      return provinceCode >= 11 && provinceCode <= 94;
    },
    { message: 'Kode provinsi pada NIK tidak valid' },
  )
  .refine(
    (nik) => {
      const day = parseInt(nik.substring(6, 8), 10);
      const month = parseInt(nik.substring(8, 10), 10);
      const year = parseInt(nik.substring(10, 12), 10);
      return isValidDate(day, month, year);
    },
    { message: 'Tanggal lahir dalam NIK tidak valid' },
  );
