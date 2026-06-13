'use server';

import { getDb } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { parseFormData } from '@/src/validations/helpers';
import { createBeritaSchema, updateBeritaSchema, deleteBeritaSchema } from '@/src/validations/cms/berita';
import { slugify } from '@/src/lib/utils';

export async function createBerita(formData: FormData) {
  try {
    const data = parseFormData(formData, createBeritaSchema);
    const title = data.title;
    const content = data.content;
    const excerpt = data.excerpt || null;
    const image_url = data.image_url || null;
    const author = data.author || 'Humas DPD PKS Pamekasan';

    const slug = slugify(title);
    const sql = getDb();
    await sql`
      INSERT INTO berita (title, slug, content, excerpt, image_url, author)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${image_url}, ${author})
    `;

    revalidatePath('/berita');
    revalidatePath('/admin/dashboard/berita');
    return { success: true, message: 'Berita berhasil diterbitkan.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menyimpan berita.',
    };
  }
}

export async function updateBerita(formData: FormData) {
  try {
    const data = parseFormData(formData, updateBeritaSchema);
    const id = data.id;
    const title = data.title;
    const content = data.content;
    const excerpt = data.excerpt || null;
    const image_url = data.image_url || null;
    const author = data.author || 'Humas DPD PKS Pamekasan';

    const slug = slugify(title);
    const sql = getDb();
    await sql`
      UPDATE berita
      SET title = ${title}, slug = ${slug}, content = ${content},
          excerpt = ${excerpt}, image_url = ${image_url},
          author = ${author}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    revalidatePath('/berita');
    revalidatePath(`/berita/${slug}`);
    revalidatePath('/admin/dashboard/berita');
    return { success: true, message: 'Berita berhasil diperbarui.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui berita.',
    };
  }
}

export async function deleteBerita(formData: FormData) {
  try {
    const { id } = parseFormData(formData, deleteBeritaSchema);

    const sql = getDb();
    await sql`DELETE FROM berita WHERE id = ${id}`;

    revalidatePath('/berita');
    revalidatePath('/admin/dashboard/berita');
    return { success: true, message: 'Berita berhasil dihapus.' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus berita.',
    };
  }
}
