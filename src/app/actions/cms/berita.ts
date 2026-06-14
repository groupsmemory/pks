'use server';

import { getDb } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { parseFormData } from '@/src/validations/helpers';
import { createBeritaSchema, updateBeritaSchema, deleteBeritaSchema } from '@/src/validations/cms/berita';
import { slugify } from '@/src/lib/utils';
import { getSession } from '@/src/lib/auth-helpers';

async function syncTags(sql: ReturnType<typeof getDb>, beritaId: string, tagsStr: string) {
  const tagNames = tagsStr
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  await sql`DELETE FROM berita_tags WHERE berita_id = ${beritaId}`;

  for (const name of tagNames) {
    const tagSlug = slugify(name);
    const existing = await sql`SELECT id FROM tags WHERE slug = ${tagSlug} LIMIT 1` as { id: string }[];
    let tagId: string;
    if (existing.length > 0) {
      tagId = existing[0].id;
    } else {
      const inserted = await sql`
        INSERT INTO tags (name, slug) VALUES (${name}, ${tagSlug})
        RETURNING id
      ` as { id: string }[];
      tagId = inserted[0].id;
    }
    await sql`
      INSERT INTO berita_tags (berita_id, tag_id) VALUES (${beritaId}, ${tagId})
      ON CONFLICT DO NOTHING
    `;
  }
}

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
    const inserted = await sql`
      INSERT INTO berita (title, slug, content, excerpt, image_url, author)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${image_url}, ${author})
      RETURNING id
    ` as { id: string }[];

    if (data.tags) {
      await syncTags(sql, inserted[0].id, data.tags);
    }

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

    if (data.tags !== undefined) {
      await syncTags(sql, id, data.tags || '');
    }

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
    const session = await getSession();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Hanya Super Admin yang dapat menghapus berita.' };
    }

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
