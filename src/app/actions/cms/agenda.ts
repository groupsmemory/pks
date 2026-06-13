'use server';

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function createAgenda(formData: FormData) {
  try {
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString().trim() || null;
    const date = formData.get('date')?.toString().trim();
    const time_start = formData.get('time_start')?.toString().trim() || null;
    const time_end = formData.get('time_end')?.toString().trim() || null;
    const location = formData.get('location')?.toString().trim() || null;
    const image_url = formData.get('image_url')?.toString().trim() || null;

    if (!title || !date) {
      throw new Error('Judul dan tanggal wajib diisi.');
    }

    const slug = slugify(title);
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
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
    const id = formData.get('id')?.toString().trim();
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString().trim() || null;
    const date = formData.get('date')?.toString().trim();
    const time_start = formData.get('time_start')?.toString().trim() || null;
    const time_end = formData.get('time_end')?.toString().trim() || null;
    const location = formData.get('location')?.toString().trim() || null;
    const image_url = formData.get('image_url')?.toString().trim() || null;

    if (!id || !title || !date) {
      throw new Error('ID, judul, dan tanggal wajib diisi.');
    }

    const slug = slugify(title);
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
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
    const id = formData.get('id')?.toString().trim();
    if (!id) throw new Error('ID agenda wajib diisi.');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
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
