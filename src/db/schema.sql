-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create aspirasi table
CREATE TABLE aspirasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_pelapor VARCHAR(150) NOT NULL,
    nik_encrypted TEXT NOT NULL,
    iv_nik VARCHAR(64) NOT NULL,
    tag_nik VARCHAR(64) NOT NULL,
    nomor_whatsapp VARCHAR(20) NOT NULL,
    kecamatan VARCHAR(50) NOT NULL CHECK (
        kecamatan IN (
            'Batumarmar',
            'Galis',
            'Kadur',
            'Larangan',
            'Pademawu',
            'Pakong',
            'Palengaan',
            'Pamekasan',
            'Pasean',
            'Pegantenan',
            'Proppo',
            'Tlanakan',
            'Waru'
        )
    ),
    isi_aspirasi TEXT NOT NULL,
    status_aspirasi VARCHAR(20) DEFAULT 'PENDING',
    assigned_to VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create B-Tree Indexes
CREATE INDEX idx_aspirasi_status_aspirasi ON aspirasi USING btree (status_aspirasi);
CREATE INDEX idx_aspirasi_kecamatan ON aspirasi USING btree (kecamatan);
CREATE INDEX idx_aspirasi_assigned_to ON aspirasi USING btree (assigned_to);
CREATE INDEX idx_aspirasi_created_at ON aspirasi USING btree (created_at);

-- =============================================================================
-- MODUL DONASI / INFAK KADER PKS PAMEKASAN
-- =============================================================================

CREATE TABLE donasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(100) UNIQUE NOT NULL,
    nama_donatur VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    nomor_whatsapp VARCHAR(20) NOT NULL,
    kecamatan VARCHAR(50) NOT NULL CHECK (
        kecamatan IN (
            'Batumarmar',
            'Galis',
            'Kadur',
            'Larangan',
            'Pademawu',
            'Pakong',
            'Palengaan',
            'Pamekasan',
            'Pasean',
            'Pegantenan',
            'Proppo',
            'Tlanakan',
            'Waru'
        )
    ),
    jenis_donasi VARCHAR(30) NOT NULL DEFAULT 'INFAK_UMUM' CHECK (
        jenis_donasi IN ('INFAK_UMUM', 'INFAK_DAKWAH', 'INFAK_SOSIAL', 'INFAK_PENDIDIKAN')
    ),
    jumlah_donasi BIGINT NOT NULL CHECK (jumlah_donasi >= 10000),
    pesan_donatur TEXT,
    -- Midtrans fields
    midtrans_transaction_id VARCHAR(100),
    midtrans_payment_type VARCHAR(50),
    midtrans_status VARCHAR(30) DEFAULT 'PENDING' CHECK (
        midtrans_status IN ('PENDING', 'SETTLEMENT', 'CAPTURE', 'DENY', 'CANCEL', 'EXPIRE', 'REFUND')
    ),
    snap_token VARCHAR(255),
    snap_redirect_url TEXT,
    -- Metadata
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for donasi
CREATE INDEX idx_donasi_order_id ON donasi USING btree (order_id);
CREATE INDEX idx_donasi_midtrans_status ON donasi USING btree (midtrans_status);
CREATE INDEX idx_donasi_kecamatan ON donasi USING btree (kecamatan);
CREATE INDEX idx_donasi_jenis_donasi ON donasi USING btree (jenis_donasi);
CREATE INDEX idx_donasi_created_at ON donasi USING btree (created_at);


-- =============================================================================
-- PHASE 3: FORMULIR REGISTRASI KTA ONLINE MANDIRI
-- =============================================================================

CREATE TABLE kta_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_lengkap VARCHAR(255) NOT NULL,
    encrypted_nik TEXT NOT NULL,       -- Ciphertext from AES-256-GCM
    iv_nik VARCHAR(64) NOT NULL,       -- 12-byte Hex IV
    tag_nik VARCHAR(64) NOT NULL,      -- 16-byte Hex Auth Tag
    nomor_whatsapp VARCHAR(20) NOT NULL,
    kecamatan VARCHAR(50) NOT NULL CHECK (
        kecamatan IN (
            'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
            'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
            'Proppo', 'Tlanakan', 'Waru'
        )
    ),
    status_verifikasi VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kta_status_verifikasi ON kta_registrations USING btree (status_verifikasi);
CREATE INDEX idx_kta_kecamatan ON kta_registrations USING btree (kecamatan);

-- =============================================================================
-- CMS ADMIN: TABEL PENGGUNA ADMIN (Next-Auth Credentials)
-- =============================================================================

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- bcrypt hash
    role VARCHAR(30) DEFAULT 'ADMIN' CHECK (role IN ('ADMIN', 'SUPER_ADMIN')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users USING btree (email);
CREATE INDEX idx_admin_users_role ON admin_users USING btree (role);

-- =============================================================================
-- CMS BERITA / ARTIKEL
-- =============================================================================

CREATE TABLE berita (
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

CREATE INDEX idx_berita_slug ON berita USING btree (slug);
CREATE INDEX idx_berita_published_at ON berita USING btree (published_at DESC);
CREATE INDEX idx_berita_content_fts ON berita USING gin (to_tsvector('simple', content));

-- =============================================================================
-- CMS AGENDA / KEGIATAN
-- =============================================================================

CREATE TABLE agenda (
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

CREATE INDEX idx_agenda_slug ON agenda USING btree (slug);
CREATE INDEX idx_agenda_date ON agenda USING btree (date DESC);

-- =============================================================================
-- CMS GALERI FOTO
-- =============================================================================

CREATE TABLE galeri (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Umum',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_galeri_category ON galeri USING btree (category);
CREATE INDEX idx_galeri_created_at ON galeri USING btree (created_at DESC);

-- =============================================================================
-- DAPIL ROUTING: Pemetaan kecamatan ke staf DPRD
-- =============================================================================

CREATE TABLE dapil_routing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kecamatan VARCHAR(50) NOT NULL UNIQUE CHECK (
        kecamatan IN (
            'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
            'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
            'Proppo', 'Tlanakan', 'Waru'
        )
    ),
    dapil VARCHAR(20) NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    staff_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dapil_routing_kecamatan ON dapil_routing USING btree (kecamatan);

INSERT INTO dapil_routing (kecamatan, dapil, assigned_to, staff_phone) VALUES
    ('Pamekasan',  'Dapil 1', 'Staf Ahli Suryono (Dapil 1)',     '6281111111111'),
    ('Tlanakan',   'Dapil 1', 'Staf Ahli Suryono (Dapil 1)',     '6281111111111'),
    ('Proppo',     'Dapil 2', 'Staf Ahli H. Imam Ghozali (Dapil 2)', '6282222222222'),
    ('Palengaan',  'Dapil 2', 'Staf Ahli H. Imam Ghozali (Dapil 2)', '6282222222222'),
    ('Batumarmar', 'Dapil 3', 'Staf Ahli Juma''ah (Dapil 3)',     '6283333333333'),
    ('Pasean',     'Dapil 3', 'Staf Ahli Juma''ah (Dapil 3)',     '6283333333333'),
    ('Waru',       'Dapil 3', 'Staf Ahli Juma''ah (Dapil 3)',     '6283333333333'),
    ('Galis',      'Dapil 5', 'Staf Ahli Ita Kusmita (Dapil 5)',  '6285555555555'),
    ('Larangan',   'Dapil 5', 'Staf Ahli Ita Kusmita (Dapil 5)',  '6285555555555'),
    ('Pademawu',   'Dapil 5', 'Staf Ahli Ita Kusmita (Dapil 5)',  '6285555555555');
