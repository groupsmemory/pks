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

export async function createBerita(formData: FormData) {
  try {
    const title = formData.get('title')?.toString().trim();
    const content = formData.get('content')?.toString().trim();
    const excerpt = formData.get('excerpt')?.toString().trim() || null;
    const image_url = formData.get('image_url')?.toString().trim() || null;
    const author = formData.get('author')?.toString().trim() || 'Humas DPD PKS Pamekasan';

    if (!title || !content) {
      throw new Error('Judul dan konten wajib diisi.');
    }

    const slug = slugify(title);
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
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
    const id = formData.get('id')?.toString().trim();
    const title = formData.get('title')?.toString().trim();
    const content = formData.get('content')?.toString().trim();
    const excerpt = formData.get('excerpt')?.toString().trim() || null;
    const image_url = formData.get('image_url')?.toString().trim() || null;
    const author = formData.get('author')?.toString().trim() || 'Humas DPD PKS Pamekasan';

    if (!id || !title || !content) {
      throw new Error('ID, judul, dan konten wajib diisi.');
    }

    const slug = slugify(title);
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
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
    const id = formData.get('id')?.toString().trim();
    if (!id) throw new Error('ID berita wajib diisi.');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan.');

    const sql = neon(databaseUrl);
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
