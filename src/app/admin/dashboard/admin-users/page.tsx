import { getDb } from '@/src/lib/db';
import { requireRole } from '@/src/lib/auth-helpers';
import AdminUsersClient from './AdminUsersClient';

interface AdminUser {
  id: string;
  nama: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

async function getAdminUsers(): Promise<AdminUser[]> {
  if (!process.env.DATABASE_URL) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT id, nama, email, role, is_active, last_login, created_at
    FROM admin_users
    ORDER BY role DESC, created_at ASC
  `;
  return rows as AdminUser[];
}

export default async function AdminUsersPage() {
  await requireRole(['SUPER_ADMIN']);
  const users = await getAdminUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[1.5em] font-extrabold text-gray-900">Kelola Admin</h1>
        <p className="text-sm text-gray-600 mt-1">
          {users.length} admin terdaftar. Hanya Super Admin yang dapat mengelola akun admin.
        </p>
      </div>

      <AdminUsersClient users={users} />
    </div>
  );
}
