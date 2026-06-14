'use server';

import { getDb } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { parseFormData } from '@/src/validations/helpers';
import { createAgendaSchema, updateAgendaSchema, deleteAgendaSchema } from '@/src/validations/cms/agenda';
import { slugify } from '@/src/lib/utils';
import { getSession } from '@/src/lib/auth-helpers';

export async function createAgenda(formData: FormData) {
  try {
    const data = parseFormData(formData, createAgendaSchema);
    const title = data.title;
    const date = data.date;
    const description = data.description || null;
    const time_start = data.time_start || null;
    const time_end = data.time_end || null;
    const location = data.location || null;
    const image_url = data.image_url || null;

    const slug = slugify(title);
    const sql = getDb();
    await sql`
      INSERT INTO agenda (title, slug, description, date, time_start, time_end, location, image_url)
      VALUES (${title}, ${slug}, ${description}, ${date}, ${time_start}, ${time_end}, ${location}, ${image_url})
    `;

    revalidatePath('/agenda');
    revalidatePath('/admin/dashboard/agenda');
    return { success: true, message: 'Agenda berhasil ditambahkan.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menyimpan agenda.',
    };
  }
}

export async function updateAgenda(formData: FormData) {
  try {
    const data = parseFormData(formData, updateAgendaSchema);
    const id = data.id;
    const title = data.title;
    const date = data.date;
    const description = data.description || null;
    const time_start = data.time_start || null;
    const time_end = data.time_end || null;
    const location = data.location || null;
    const image_url = data.image_url || null;

    const slug = slugify(title);
    const sql = getDb();
    await sql`
      UPDATE agenda
      SET title = ${title}, slug = ${slug}, description = ${description},
          date = ${date}, time_start = ${time_start}, time_end = ${time_end},
          location = ${location}, image_url = ${image_url},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    revalidatePath('/agenda');
    revalidatePath(`/agenda/${slug}`);
    revalidatePath('/admin/dashboard/agenda');
    return { success: true, message: 'Agenda berhasil diperbarui.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui agenda.',
    };
  }
}

export async function deleteAgenda(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Hanya Super Admin yang dapat menghapus agenda.' };
    }

    const { id } = parseFormData(formData, deleteAgendaSchema);

    const sql = getDb();
    await sql`DELETE FROM agenda WHERE id = ${id}`;

    revalidatePath('/agenda');
    revalidatePath('/admin/dashboard/agenda');
    return { success: true, message: 'Agenda berhasil dihapus.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus agenda.',
    };
  }
}
