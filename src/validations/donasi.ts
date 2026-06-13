import { z } from 'zod';
import { KECAMATAN, JENIS_DONASI } from './index';
import { phoneSchema } from './phone';

export const donasiSchema = z.object({
  nama_donatur: z.string().min(1, 'Nama donatur wajib diisi'),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  nomor_whatsapp: phoneSchema,
  kecamatan: z.enum(KECAMATAN, {
    errorMap: () => ({ message: 'Kecamatan tidak valid' }),
  }),
  jenis_donasi: z.enum(JENIS_DONASI, {
    errorMap: () => ({ message: 'Jenis donasi tidak valid' }),
  }),
  jumlah_donasi: z.coerce
    .number()
    .int('Jumlah donasi harus berupa angka')
    .min(10000, 'Minimal donasi adalah Rp 10.000')
    .max(100000000, 'Maksimal donasi per transaksi adalah Rp 100.000.000'),
  pesan_donatur: z.string().optional().or(z.literal('')),
});

export type DonasiInput = z.infer<typeof donasiSchema>;
