import { z } from 'zod';

export const createGaleriSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().optional().or(z.literal('')),
  image_url: z.string().url('URL gambar tidak valid').min(1, 'URL gambar wajib diisi'),
  category: z.string().optional().or(z.literal('')),
});

export const deleteGaleriSchema = z.object({
  id: z.string().min(1, 'ID galeri wajib diisi'),
});

export type CreateGaleriInput = z.infer<typeof createGaleriSchema>;
