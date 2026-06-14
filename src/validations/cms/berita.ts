import { z } from 'zod';

export const createBeritaSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  content: z.string().min(1, 'Konten wajib diisi'),
  excerpt: z.string().optional().or(z.literal('')),
  image_url: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  author: z.string().optional().or(z.literal('')),
  tags: z.string().optional().or(z.literal('')),
});

export const updateBeritaSchema = createBeritaSchema.extend({
  id: z.string().min(1, 'ID berita wajib diisi'),
});

export const deleteBeritaSchema = z.object({
  id: z.string().min(1, 'ID berita wajib diisi'),
});

export type CreateBeritaInput = z.infer<typeof createBeritaSchema>;
export type UpdateBeritaInput = z.infer<typeof updateBeritaSchema>;
