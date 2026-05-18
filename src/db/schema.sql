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
