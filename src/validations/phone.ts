import { z } from 'zod';

export const phoneSchema = z
  .string()
  .min(1, 'Nomor WhatsApp wajib diisi')
  .regex(
    /^62\d{8,13}$/,
    'Nomor WhatsApp harus diawali 62 dan terdiri dari 10-15 digit',
  );
