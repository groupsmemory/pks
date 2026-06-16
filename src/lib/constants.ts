export const PAMEKASAN_KECAMATAN = [
  'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
  'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
  'Proppo', 'Tlanakan', 'Waru',
] as const;

export type PamekasanKecamatan = typeof PAMEKASAN_KECAMATAN[number];

export const JENIS_DONASI = [
  'INFAK_UMUM', 'INFAK_DAKWAH', 'INFAK_SOSIAL', 'INFAK_PENDIDIKAN',
] as const;

export type JenisDonasi = typeof JENIS_DONASI[number];

export const JENIS_DONASI_LABEL: Record<JenisDonasi, string> = {
  INFAK_UMUM: 'Infak Umum',
  INFAK_DAKWAH: 'Infak Dakwah',
  INFAK_SOSIAL: 'Infak Sosial',
  INFAK_PENDIDIKAN: 'Infak Pendidikan',
};

export const FONT_SCALES = ['scale-100', 'scale-125', 'scale-150', 'scale-200'] as const;

export type FontScale = typeof FONT_SCALES[number];

export const NOMINAL_PRESETS = [25000, 50000, 100000, 250000, 500000, 1000000] as const;

export const MIDTRANS_SNAP_URL = {
  production: 'https://app.midtrans.com/snap/snap.js',
  sandbox: 'https://app.sandbox.midtrans.com/snap/snap.js',
} as const;

export const DONASI_MIN = 10000;
export const DONASI_MAX = 100_000_000;

export const APP_NAME = 'DPD PKS Kabupaten Pamekasan';
export const APP_TAGLINE = 'Bersama PKS, Pamekasan Maju dan Berkeadilan';

export const AGAMA = ['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU'] as const;
export type Agama = typeof AGAMA[number];

export const JENIS_KELAMIN = ['LAKI_LAKI', 'PEREMPUAN'] as const;
export type JenisKelamin = typeof JENIS_KELAMIN[number];

export const GOLONGAN_DARAH = ['A', 'B', 'AB', 'O'] as const;
export type GolonganDarah = typeof GOLONGAN_DARAH[number];

export const STATUS_PERKAWINAN = ['KAWIN', 'BELUM_KAWIN', 'CERAI_HIDUP', 'CERAI_MATI'] as const;
export type StatusPerkawinan = typeof STATUS_PERKAWINAN[number];

export const PEKERJAAN = [
  'Belum Bekerja', 'Pelajar/Mahasiswa', 'PNS', 'TNI/Polri', 'Guru/Dosen',
  'Petani', 'Nelayan', 'Pedagang', 'Wiraswasta', 'Karyawan Swasta',
  'Buruh', 'Satpam', 'Sopir', 'IRT', 'Tenaga Kesehatan',
  'Pensiunan', 'Lainnya',
] as const;

export const PENDIDIKAN = [
  'SD/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'D1/D2/D3',
  'S1/D4', 'S2', 'S3',
] as const;

export const PROVINSI_DEFAULT = 'JAWA TIMUR';
export const KOTA_DEFAULT = 'PAMEKASAN';
export const NEGARA_DEFAULT = 'INDONESIA';

export const FILE_MAX_SIZE = 20 * 1024 * 1024; // 20MB
export const FILE_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
