import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@pkspamekasan.id' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi.');
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          throw new Error('DATABASE_URL tidak dikonfigurasi.');
        }

        const sql = neon(databaseUrl);

        const rows = await sql`
          SELECT id, nama, email, password_hash, role, is_active
          FROM admin_users
          WHERE email = ${credentials.email}
          LIMIT 1
        `;

        if (rows.length === 0) {
          throw new Error('Email atau password salah.');
        }

        const user = rows[0];

        if (!user.is_active) {
          throw new Error('Akun Anda telah dinonaktifkan. Hubungi Super Admin.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          throw new Error('Email atau password salah.');
        }

        // Update last_login
        await sql`
          UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
        `;

        return {
          id: user.id,
          name: user.nama,
          email: user.email,
          role: user.role,
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
        token.role = (user as { role?: string }).role;
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
