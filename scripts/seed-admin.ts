/**
 * Script untuk membuat admin user pertama.
 * Jalankan dengan: npx tsx scripts/seed-admin.ts
 *
 * Pastikan .env.local sudah berisi DATABASE_URL dan ADMIN_SEED_PASSWORD.
 */

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config({ path: '.env.local' });

async function seedAdmin() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL tidak ditemukan di .env.local');
    process.exit(1);
  }

  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!adminPassword || adminPassword.length < 8) {
    console.error('ERROR: ADMIN_SEED_PASSWORD tidak ditemukan atau terlalu pendek (min. 8 karakter) di .env.local');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  const adminEmail = 'admin@pkspamekasan.id';
  const adminNama = 'Admin Humas KOMDIGI';

  // Cek apakah admin sudah ada
  const existing = await sql`SELECT id FROM admin_users WHERE email = ${adminEmail}`;
  if (existing.length > 0) {
    console.log(`Admin dengan email ${adminEmail} sudah ada. Skip.`);
    process.exit(0);
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  // Insert
  await sql`
    INSERT INTO admin_users (nama, email, password_hash, role, is_active)
    VALUES (${adminNama}, ${adminEmail}, ${passwordHash}, 'SUPER_ADMIN', true)
  `;

  console.log('✅ Admin user berhasil dibuat:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('');
  console.log('⚠️  PENTING: Ganti password ini setelah login pertama!');
}

seedAdmin().catch((err) => {
  console.error('Seed gagal:', err);
  process.exit(1);
});
