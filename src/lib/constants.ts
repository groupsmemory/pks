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
