-- =============================================================================
-- Migration 002: Extended KTA Registration Fields
-- Adds columns to kta_registrations matching daftar.pks.id structure
-- =============================================================================

ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS nama_panggilan VARCHAR(100);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS tempat_lahir VARCHAR(100);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS tanggal_lahir DATE;
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS jenis_kelamin VARCHAR(10) CHECK (jenis_kelamin IN ('LAKI_LAKI', 'PEREMPUAN'));
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS golongan_darah VARCHAR(2) CHECK (golongan_darah IN ('A', 'B', 'AB', 'O'));
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS provinsi VARCHAR(100) NOT NULL DEFAULT 'JAWA TIMUR';
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS kota_kabupaten VARCHAR(100) NOT NULL DEFAULT 'PAMEKASAN';
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS kelurahan_desa VARCHAR(100);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS alamat_ktp TEXT;
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS rt VARCHAR(5);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS rw VARCHAR(5);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS alamat_domisili TEXT;
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 7);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS lon DECIMAL(10, 7);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS negara VARCHAR(100) DEFAULT 'INDONESIA';
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS kode_referal VARCHAR(50);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS agama VARCHAR(20) CHECK (agama IN ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU'));
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS status_perkawinan VARCHAR(20) CHECK (status_perkawinan IN ('KAWIN', 'BELUM_KAWIN', 'CERAI_HIDUP', 'CERAI_MATI'));
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS pekerjaan VARCHAR(100);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS pendidikan_terakhir VARCHAR(50);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS ktp_image_base64 TEXT;
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS ktp_image_type VARCHAR(50);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS profile_image_base64 TEXT;
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS profile_image_type VARCHAR(50);
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS not_committee BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE kta_registrations ADD COLUMN IF NOT EXISTS agree BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_kta_kelurahan_desa ON kta_registrations USING btree (kelurahan_desa);
CREATE INDEX IF NOT EXISTS idx_kta_status_verifikasi ON kta_registrations USING btree (status_verifikasi);
CREATE INDEX IF NOT EXISTS idx_kta_kecamatan ON kta_registrations USING btree (kecamatan);
CREATE INDEX IF NOT EXISTS idx_kta_created_at ON kta_registrations USING btree (created_at DESC);
