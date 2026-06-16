import { z } from 'zod';
import { KECAMATAN } from './index';
import {
  AGAMA,
  JENIS_KELAMIN,
  GOLONGAN_DARAH,
  STATUS_PERKAWINAN,
  PEKERJAAN,
  PENDIDIKAN,
  PROVINSI_DEFAULT,
  KOTA_DEFAULT,
  NEGARA_DEFAULT,
} from '@/src/lib/constants';
import { nikSchema } from './nik';
import { phoneSchema } from './phone';

export const ktaSchema = z.object({
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  nama_panggilan: z.string().optional().default(''),
  nik: nikSchema,
  tempat_lahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggal_lahir: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Format tanggal harus dd/mm/yyyy'),
  jenis_kelamin: z.enum(JENIS_KELAMIN, {
    errorMap: () => ({ message: 'Pilih jenis kelamin' }),
  }),
  golongan_darah: z.enum(GOLONGAN_DARAH, {
    errorMap: () => ({ message: 'Pilih golongan darah' }),
  }),
  provinsi: z.string().default(PROVINSI_DEFAULT),
  kota_kabupaten: z.string().default(KOTA_DEFAULT),
  kecamatan: z.enum(KECAMATAN, {
    errorMap: () => ({ message: 'Pilih kecamatan' }),
  }),
  kelurahan_desa: z.string().min(1, 'Pilih kelurahan/desa'),
  alamat_ktp: z.string().min(1, 'Alamat KTP wajib diisi'),
  rt: z.string().min(1, 'RT wajib diisi'),
  rw: z.string().min(1, 'RW wajib diisi'),
  alamat_domisili: z.string().optional().default(''),
  negara: z.string().default(NEGARA_DEFAULT),
  kode_referal: z.string().optional().default(''),
  agama: z.enum(AGAMA, {
    errorMap: () => ({ message: 'Pilih agama' }),
  }),
  status_perkawinan: z.enum(STATUS_PERKAWINAN, {
    errorMap: () => ({ message: 'Pilih status perkawinan' }),
  }),
  pekerjaan: z.enum(PEKERJAAN, {
    errorMap: () => ({ message: 'Pilih pekerjaan' }),
  }),
  pendidikan_terakhir: z.enum(PENDIDIKAN, {
    errorMap: () => ({ message: 'Pilih pendidikan terakhir' }),
  }),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  nomor_whatsapp: phoneSchema,
  not_committee: z.literal(true, {
    errorMap: () => ({ message: 'Anda harus menyatakan bukan pengurus partai lain' }),
  }),
  agree: z.literal(true, {
    errorMap: () => ({ message: 'Anda harus menyetujui pernyataan data' }),
  }),
});

export type KtaInput = z.infer<typeof ktaSchema>;
