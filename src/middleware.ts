import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;

      if (!path.startsWith('/admin/dashboard')) return true;

      if (!token) return false;

      const role = token.role as string | undefined;

      if (path.startsWith('/admin/dashboard/admin-users')) {
        return role === 'SUPER_ADMIN';
      }

      return true;
    },
  },
});

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
