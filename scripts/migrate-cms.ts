import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL tidak ditemukan di .env.local');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('Membuat tabel berita...');
  await sql`
    CREATE TABLE IF NOT EXISTS berita (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      image_url TEXT,
      author VARCHAR(150) NOT NULL DEFAULT 'Humas DPD PKS Pamekasan',
      published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('Membuat tabel agenda...');
  await sql`
    CREATE TABLE IF NOT EXISTS agenda (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      time_start TIME,
      time_end TIME,
      location VARCHAR(255),
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('Membuat tabel galeri...');
  await sql`
    CREATE TABLE IF NOT EXISTS galeri (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'Umum',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log('Membuat index...');
  await sql`CREATE INDEX IF NOT EXISTS idx_berita_slug ON berita (slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_berita_published_at ON berita (published_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_agenda_slug ON agenda (slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_agenda_date ON agenda (date DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_galeri_category ON galeri (category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_galeri_created_at ON galeri (created_at DESC)`;

  console.log('Migrasi selesai!');
}

migrate().catch(console.error);
