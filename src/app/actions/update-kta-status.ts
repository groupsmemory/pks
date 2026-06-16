'use server';

import { getDb } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function updateKtaStatus(formData: FormData) {
  const parsed = updateSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
  });
  if (!parsed.success) {
    throw new Error('Data tidak valid.');
  }

  const { id, status } = parsed.data;
  const sql = getDb();
  await sql`
    UPDATE kta_registrations
    SET status_verifikasi = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;

  revalidatePath('/admin/dashboard/kta');
  revalidatePath(`/admin/dashboard/kta/${id}`);
  redirect(`/admin/dashboard/kta/${id}?msg=Status+berhasil+diubah+ke+${status}`);
}
