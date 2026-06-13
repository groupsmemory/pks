import { z } from 'zod';
import { KECAMATAN } from './index';
import { nikSchema } from './nik';
import { phoneSchema } from './phone';

export const aspirasiSchema = z.object({
  nama_pelapor: z.string().min(1, 'Nama pelapor wajib diisi'),
  nik: nikSchema,
  nomor_whatsapp: phoneSchema,
  kecamatan: z.enum(KECAMATAN, {
    errorMap: () => ({ message: 'Kecamatan tidak valid' }),
  }),
  isi_aspirasi: z.string().min(1, 'Isi aspirasi wajib diisi'),
});

export type AspirasiInput = z.infer<typeof aspirasiSchema>;
