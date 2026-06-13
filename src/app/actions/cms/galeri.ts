'use server';

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export async function createGaleri(formData: FormData) {
  try {
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description')?.toString().trim() || null;
    const image_url = formData.get('image_url')?.toString().trim();
    const category = formData.get('category')?.toString().trim() || 'Umum';

    if (!title || !image_url) {
      throw new Error('Judul dan URL gambar wajib diisi.');
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO galeri (title, description, image_url, category)
      VALUES (${title}, ${description}, ${image_url}, ${category})
    `;

    revalidatePath('/galeri');
    revalidatePath('/admin/dashboard/galeri');
    return { success: true, message: 'Galeri berhasil ditambahkan.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menyimpan galeri.',
    };
  }
}

export async function deleteGaleri(formData: FormData) {
  try {
    const id = formData.get('id')?.toString().trim();
    if (!id) throw new Error('ID galeri wajib diisi.');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
    await sql`DELETE FROM galeri WHERE id = ${id}`;

    revalidatePath('/galeri');
    revalidatePath('/admin/dashboard/galeri');
    return { success: true, message: 'Galeri berhasil dihapus.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus galeri.',
    };
  }
}
