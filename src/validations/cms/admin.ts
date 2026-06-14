import { z } from 'zod';

export const createAdminSchema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi').max(100),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
