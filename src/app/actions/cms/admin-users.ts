'use server';

import { getDb } from '@/src/lib/db';
import { revalidatePath } from 'next/cache';
import { parseFormData } from '@/src/validations/helpers';
import { createAdminSchema } from '@/src/validations/cms/admin';
import { getSession } from '@/src/lib/auth-helpers';
import bcrypt from 'bcryptjs';

export async function createAdminUser(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Hanya Super Admin yang dapat menambah admin.' };
    }

    const data = parseFormData(formData, createAdminSchema);
    const sql = getDb();

    const existing = await sql.query(
      'SELECT id FROM admin_users WHERE email = $1 LIMIT 1',
      [data.email],
    ) as { id: string }[];
    if (existing.length > 0) {
      return { success: false, error: 'Email sudah terdaftar.' };
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const result = await sql`
      INSERT INTO admin_users (nama, email, password_hash, role, is_active)
      VALUES (${data.nama}, ${data.email}, ${passwordHash}, ${data.role}, true)
      RETURNING id
    ` as { id: string }[];

    revalidatePath('/admin/dashboard/admin-users');
    return { success: true, message: `Admin ${data.nama} berhasil ditambahkan.` };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menambah admin.',
    };
  }
}

export async function toggleAdminActive(id: string) {
  try {
    const session = await getSession();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Hanya Super Admin yang dapat mengubah status admin.' };
    }

    const sql = getDb();
    const users = await sql.query(
      'SELECT id, is_active FROM admin_users WHERE id = $1 LIMIT 1',
      [id],
    ) as { id: string; is_active: boolean }[];
    const user = users[0];

    if (!user) return { success: false, error: 'Admin tidak ditemukan.' };
    if (user.id === session.user.id) {
      return { success: false, error: 'Tidak dapat menonaktifkan akun sendiri.' };
    }

    await sql.query(
      'UPDATE admin_users SET is_active = NOT is_active WHERE id = $1',
      [id],
    );

    revalidatePath('/admin/dashboard/admin-users');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengubah status.',
    };
  }
}
