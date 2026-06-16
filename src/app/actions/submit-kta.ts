'use server';

import { getDb } from '@/src/lib/db';
import { encryptData } from '@/src/lib/crypto';
import { ktaSchema } from '@/src/validations/kta';
import { createNotification } from '@/src/lib/notifications';

export async function submitKta(formData: FormData) {
  try {
    const raw = {
      nama_lengkap: formData.get('nama_lengkap')?.toString().trim() || '',
      nama_panggilan: formData.get('nama_panggilan')?.toString().trim() || '',
      nik: formData.get('nik')?.toString().trim() || '',
      tempat_lahir: formData.get('tempat_lahir')?.toString().trim() || '',
      tanggal_lahir: formData.get('tanggal_lahir')?.toString().trim() || '',
      jenis_kelamin: formData.get('jenis_kelamin')?.toString().trim() || '',
      golongan_darah: formData.get('golongan_darah')?.toString().trim() || '',
      provinsi: 'JAWA TIMUR',
      kota_kabupaten: 'PAMEKASAN',
      kecamatan: formData.get('kecamatan')?.toString().trim() || '',
      kelurahan_desa: formData.get('kelurahan_desa')?.toString().trim() || '',
      alamat_ktp: formData.get('alamat_ktp')?.toString().trim() || '',
      rt: formData.get('rt')?.toString().trim() || '',
      rw: formData.get('rw')?.toString().trim() || '',
      alamat_domisili: formData.get('alamat_domisili')?.toString().trim() || '',
      negara: 'INDONESIA',
      kode_referal: formData.get('kode_referal')?.toString().trim() || '',
      agama: formData.get('agama')?.toString().trim() || '',
      status_perkawinan: formData.get('status_perkawinan')?.toString().trim() || '',
      pekerjaan: formData.get('pekerjaan')?.toString().trim() || '',
      pendidikan_terakhir: formData.get('pendidikan_terakhir')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      nomor_whatsapp: formData.get('nomor_whatsapp')?.toString().trim() || '',
      not_committee: formData.get('not_committee') === 'true',
      agree: formData.get('agree') === 'true',
    };

    const parsed = ktaSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message || 'Validasi gagal');
    }
    const data = parsed.data;

    const { ciphertext: encrypted_nik, iv: iv_nik, tag: tag_nik } = encryptData(data.nik);

    const { ciphertext: encrypted_nik2, iv: iv_nik2, tag: tag_nik2 } = encryptData(data.nik);

    const ktpImageUrl = formData.get('ktp_image_url')?.toString().trim() || '';
    const profileImageUrl = formData.get('profile_image_url')?.toString().trim() || '';

    const tanggalLahirFormatted = data.tanggal_lahir.split('/').reverse().join('-');

    const sql = getDb();

    const [inserted] = await sql`
      INSERT INTO kta_registrations (
        nama_lengkap, nama_panggilan, encrypted_nik, iv_nik, tag_nik,
        tempat_lahir, tanggal_lahir, jenis_kelamin, golongan_darah,
        provinsi, kota_kabupaten, kecamatan, kelurahan_desa,
        alamat_ktp, rt, rw,
        alamat_domisili, negara, kode_referal,
        agama, status_perkawinan, pekerjaan, pendidikan_terakhir,
        email, nomor_whatsapp,
        ktp_image_base64, ktp_image_type,
        profile_image_base64, profile_image_type,
        not_committee, agree,
        status_verifikasi
      ) VALUES (
        ${data.nama_lengkap}, ${data.nama_panggilan},
        ${encrypted_nik}, ${iv_nik}, ${tag_nik},
        ${data.tempat_lahir}, ${tanggalLahirFormatted}::date,
        ${data.jenis_kelamin}, ${data.golongan_darah},
        ${data.provinsi}, ${data.kota_kabupaten},
        ${data.kecamatan}, ${data.kelurahan_desa},
        ${data.alamat_ktp}, ${data.rt}, ${data.rw},
        ${data.alamat_domisili}, ${data.negara}, ${data.kode_referal},
        ${data.agama}, ${data.status_perkawinan},
        ${data.pekerjaan}, ${data.pendidikan_terakhir},
        ${data.email || null}, ${data.nomor_whatsapp},
        ${ktpImageUrl || null}, ${ktpImageUrl ? 'url' : null},
        ${profileImageUrl || null}, ${profileImageUrl ? 'url' : null},
        ${data.not_committee}, ${data.agree},
        'PENDING'
      )
      RETURNING id
    ` as { id: string }[];

    const ktaId = inserted?.id;
    if (ktaId) {
      await createNotification({
        type: 'kta_baru',
        title: 'Pendaftar KTA Baru',
        message: `${data.nama_lengkap} dari Kec. ${data.kecamatan} mendaftar KTA.`,
        referenceId: ktaId,
      });
    }

    return {
      success: true,
      message: 'Pendaftaran KTA Anda berhasil dikirim secara aman.',
    };
  } catch (error) {
    console.error('[KTA Registration Error]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem yang tidak diketahui.',
    };
  }
}
