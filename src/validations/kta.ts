import { z } from 'zod';
import { KECAMATAN } from './index';
import { nikSchema } from './nik';
import { phoneSchema } from './phone';

export const ktaSchema = z.object({
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  nik: nikSchema,
  nomor_whatsapp: phoneSchema,
  kecamatan: z.enum(KECAMATAN, {
    errorMap: () => ({ message: 'Kecamatan tidak valid' }),
  }),
});

export type KtaInput = z.infer<typeof ktaSchema>;
