import { z } from 'zod';

export const createAgendaSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().optional().or(z.literal('')),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  time_start: z.string().optional().or(z.literal('')),
  time_end: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  image_url: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
});

export const updateAgendaSchema = createAgendaSchema.extend({
  id: z.string().min(1, 'ID agenda wajib diisi'),
});

export const deleteAgendaSchema = z.object({
  id: z.string().min(1, 'ID agenda wajib diisi'),
});

export type CreateAgendaInput = z.infer<typeof createAgendaSchema>;
export type UpdateAgendaInput = z.infer<typeof updateAgendaSchema>;
