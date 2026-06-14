import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/src/validations/cms/login';
import { getDb } from '@/src/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@pkspamekasan.id' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error('Email dan password wajib diisi.');
        }
        const { email, password } = parsed.data;

        const sql = getDb();

        const [user] = await sql`
          SELECT id, nama, email, password_hash, role, is_active
          FROM admin_users
          WHERE email = ${email}
          LIMIT 1
        ` as { id: number; nama: string; email: string; password_hash: string; role: string; is_active: boolean }[];

        if (!user) {
          throw new Error('Email atau password salah.');
        }

        if (!user.is_active) {
          throw new Error('Akun Anda telah dinonaktifkan. Hubungi Super Admin.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
          throw new Error('Email atau password salah.');
        }

        // Update last_login
        await getDb()`
          UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
        `;

        return {
          id: String(user.id),
          name: user.nama,
          email: user.email,
          role: user.role as 'ADMIN' | 'SUPER_ADMIN',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 jam
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: 'ADMIN' | 'SUPER_ADMIN' }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
