import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireSession();
  if (!allowedRoles.includes(session.user.role)) redirect('/admin/dashboard');
  return session;
}

export async function getSession() {
  return getServerSession(authOptions);
}
