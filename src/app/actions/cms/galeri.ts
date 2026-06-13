'use server';

import { getDb } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { parseFormData } from '@/src/validations/helpers';
import { createGaleriSchema, deleteGaleriSchema } from '@/src/validations/cms/galeri';

export async function createGaleri(formData: FormData) {
  try {
    const data = parseFormData(formData, createGaleriSchema);
    const title = data.title;
    const image_url = data.image_url;
    const description = data.description || null;
    const category = data.category || 'Umum';

    const sql = getDb();
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
    const { id } = parseFormData(formData, deleteGaleriSchema);

    const sql = getDb();
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
