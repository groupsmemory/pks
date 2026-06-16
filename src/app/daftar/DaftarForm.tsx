'use client';

import React, { useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitKta } from '@/src/app/actions/submit-kta';
import { ktaSchema, type KtaInput } from '@/src/validations/kta';
import { KECAMATAN } from '@/src/validations/index';
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
  FILE_MAX_SIZE,
} from '@/src/lib/constants';
import { DESA_PER_KECAMATAN } from '@/src/data/wilayah-pamekasan';
import { useAccessibility } from '@/src/hooks/useAccessibility';
import { useUploadThing } from '@/src/lib/uploadthing-client';

const FONT_SCALES = ['scale-100', 'scale-125', 'scale-150', 'scale-200'] as const;

export default function DaftarForm() {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const { isHighContrast } = useAccessibility();

  const { startUpload, isUploading } = useUploadThing("ktaImage");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<KtaInput>({
    resolver: zodResolver(ktaSchema),
    mode: 'onChange',
    defaultValues: {
      provinsi: PROVINSI_DEFAULT,
      kota_kabupaten: KOTA_DEFAULT,
      negara: NEGARA_DEFAULT,
    },
  });

  const selectedKecamatan = watch('kecamatan');
  const desaOptions = selectedKecamatan ? DESA_PER_KECAMATAN[selectedKecamatan] || [] : [];

  const nikValue = useWatch({ control, name: 'nik' });
  const phoneValue = useWatch({ control, name: 'nomor_whatsapp' });

  const handleFileSelect = useCallback(
    (file: File | null, setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string | null>>, fieldName: string) => {
      if (!file) {
        setFile(null);
        setPreview(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrorMsg(`${fieldName}: Format file harus JPEG, PNG, atau WebP.`);
        return;
      }
      if (file.size > FILE_MAX_SIZE) {
        setErrorMsg(`${fieldName}: Ukuran file maksimal 20MB. File Anda ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
        return;
      }
      setErrorMsg(null);
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    [],
  );

  const onSubmit = async (data: KtaInput) => {
    setErrorMsg(null);
    setIsPending(true);

    try {
      const files: File[] = [];
      if (ktpFile) files.push(ktpFile);
      if (profileFile) files.push(profileFile);

      let ktpImageUrl = '';
      let profileImageUrl = '';

      if (files.length > 0) {
        const uploadResult = await startUpload(files);
        if (uploadResult) {
          if (uploadResult[0]) {
            if (ktpFile) ktpImageUrl = uploadResult[0].url;
            else profileImageUrl = uploadResult[0].url;
          }
          if (uploadResult[1]) profileImageUrl = uploadResult[1].url;
        }
      }

      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.set(key, String(val));
        }
      });
      formData.set('ktp_image_url', ktpImageUrl);
      formData.set('profile_image_url', profileImageUrl);

      const response = await submitKta(formData);

      if (response.success) {
        setSuccessMsg(response.message || null);
      } else {
        setErrorMsg(response.error || 'Terjadi kesalahan saat memproses pendaftaran.');
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Terjadi kesalahan tidak terduga.';
      setErrorMsg(message);
    } finally {
      setIsPending(false);
    }
  };

  const inputClass = (hasError: boolean, hasValue: boolean) => {
    const border = hasError ? 'border-red-500' : hasValue ? (isHighContrast ? 'border-[#FFFF00]' : 'border-green-500') : '';
    if (isHighContrast) {
      return `w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 bg-[#000000] border-2 ${border || 'border-[#FFFF00]'} text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]`;
    }
    return `w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 bg-white border-2 ${border || 'border-gray-300'} text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200`;
  };

  const selectClass = (hasError: boolean) => {
    if (isHighContrast) {
      return `w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 bg-[#000000] border-2 ${hasError ? 'border-red-500' : 'border-[#FFFF00]'} text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]`;
    }
    return `w-full min-h-[44px] px-4 py-3 rounded-lg outline-none transition-all focus:ring-4 bg-white border-2 ${hasError ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:border-blue-500 focus:ring-blue-200`;
  };

  const labelClass = isHighContrast ? 'text-[#FFFF00] font-bold' : 'text-gray-800 font-bold';
  const subLabelClass = isHighContrast ? 'text-[#FFFF00] opacity-80' : 'text-gray-500';

  const cardClass = isHighContrast
    ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00]'
    : 'bg-white border border-gray-200 shadow-sm text-gray-900';

  const sectionHeadingClass = isHighContrast
    ? 'text-[#FFFF00] border-b border-[#FFFF00]'
    : 'text-gray-500 border-b border-gray-200';

  if (successMsg) {
    return (
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className={`w-full max-w-[1000px] rounded-xl p-8 ${cardClass}`} role="alert" aria-live="polite">
          <div className="text-center max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-[1.5em] font-bold mb-3">Pendaftaran KTA Berhasil!</h2>
            <p className="opacity-80 mb-2">{successMsg}</p>
            <p className="text-sm opacity-60 mb-8">
              Data NIK Anda telah dienkripsi dengan standar AES-256-GCM.
              Tim verifikasi DPD PKS Pamekasan akan menghubungi Anda melalui WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => { setSuccessMsg(null); window.scrollTo(0, 0); }}
              className={`min-h-[44px] px-8 py-3 font-bold rounded-lg transition-all focus:outline-none focus:ring-4 ${
                isHighContrast
                  ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300'
              }`}
            >
              Daftar Kader Baru Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      <div className={`w-full max-w-[1000px] rounded-xl ${cardClass}`}>
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-current opacity-20" />

        <div className="p-6 sm:p-8 pt-0">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
              PKS
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider opacity-60">
                Dewan Pengurus Daerah
              </p>
              <h1 className="text-[1.25em] sm:text-[1.5em] font-extrabold leading-tight">
                Partai Keadilan Sejahtera
              </h1>
              <p className="text-sm opacity-70">Kabupaten Pamekasan</p>
            </div>
          </div>

          <h2 className="text-[1.375em] font-bold mb-2">
            Pendaftaran Anggota Partai Keadilan Sejahtera
          </h2>
          <p className={`text-sm mb-8 ${subLabelClass}`}>
            Isi data diri Anda dengan benar. Data NIK akan dienkripsi dengan AES-256-GCM.
            Tanda <span className="text-red-500">*</span> wajib diisi.
          </p>

          {/* Error Banner */}
          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isHighContrast ? 'bg-[#000000] border-2 border-red-500 text-red-400' : 'bg-red-50 border-2 border-red-300 text-red-800'
              }`}
              role="alert"
              aria-live="assertive"
            >
              <p className="font-bold">Pendaftaran Gagal</p>
              <p className="mt-1 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* SECTION 1: Data Diri */}
            <fieldset>
              <legend className={`text-[1.125em] font-bold pb-2 mb-6 border-b ${sectionHeadingClass}`}>
                📋 Data Diri
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* NIK - full width */}
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="nik" className={labelClass}>
                    NIK / No. KTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nik"
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="Nomor Induk Kependudukan anda"
                    autoComplete="off"
                    className={inputClass(!!errors.nik, (nikValue || '').length === 16)}
                    {...register('nik')}
                  />
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className={subLabelClass}>{(nikValue || '').length}/16 digit</span>
                    {(nikValue || '').length === 16 && !errors.nik && (
                      <span className={isHighContrast ? 'text-[#FFFF00]' : 'text-green-600'}>✓ NIK valid</span>
                    )}
                    {errors.nik && <span className="text-red-500 text-xs">{errors.nik.message}</span>}
                  </div>
                  <p className={`text-xs ${subLabelClass}`}>
                    NIK akan dienkripsi dengan AES-256-GCM sebelum disimpan.
                  </p>
                </div>

                {/* Nama Lengkap */}
                <div className="space-y-1.5">
                  <label htmlFor="nama_lengkap" className={labelClass}>
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama_lengkap"
                    placeholder="Sesuai tertera di KTP"
                    autoComplete="name"
                    className={inputClass(!!errors.nama_lengkap, false)}
                    {...register('nama_lengkap')}
                  />
                  {errors.nama_lengkap && <p className="text-red-500 text-xs">{errors.nama_lengkap.message}</p>}
                </div>

                {/* Nama Panggilan */}
                <div className="space-y-1.5">
                  <label htmlFor="nama_panggilan" className={labelClass}>Nama Panggilan</label>
                  <input
                    type="text"
                    id="nama_panggilan"
                    placeholder="Akrab dipanggil dengan..."
                    className={inputClass(false, false)}
                    {...register('nama_panggilan')}
                  />
                </div>

                {/* Tempat Lahir */}
                <div className="space-y-1.5">
                  <label htmlFor="tempat_lahir" className={labelClass}>
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tempat_lahir"
                    placeholder="Nama kota"
                    className={inputClass(!!errors.tempat_lahir, false)}
                    {...register('tempat_lahir')}
                  />
                  {errors.tempat_lahir && <p className="text-red-500 text-xs">{errors.tempat_lahir.message}</p>}
                </div>

                {/* Tanggal Lahir */}
                <div className="space-y-1.5">
                  <label htmlFor="tanggal_lahir" className={labelClass}>
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tanggal_lahir"
                    placeholder="Dalam format dd/mm/yyyy"
                    inputMode="numeric"
                    className={inputClass(!!errors.tanggal_lahir, false)}
                    {...register('tanggal_lahir')}
                  />
                  {errors.tanggal_lahir && <p className="text-red-500 text-xs">{errors.tanggal_lahir.message}</p>}
                </div>

                {/* Jenis Kelamin */}
                <div className="space-y-1.5">
                  <label htmlFor="jenis_kelamin" className={labelClass}>
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select id="jenis_kelamin" className={selectClass(!!errors.jenis_kelamin)} {...register('jenis_kelamin')}>
                    <option value="">-- Pilih Jenis Kelamin --</option>
                    {JENIS_KELAMIN.map((jk) => (
                      <option key={jk} value={jk}>{jk === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}</option>
                    ))}
                  </select>
                  {errors.jenis_kelamin && <p className="text-red-500 text-xs">{errors.jenis_kelamin.message}</p>}
                </div>

                {/* Golongan Darah */}
                <div className="space-y-1.5">
                  <label htmlFor="golongan_darah" className={labelClass}>
                    Golongan Darah <span className="text-red-500">*</span>
                  </label>
                  <select id="golongan_darah" className={selectClass(!!errors.golongan_darah)} {...register('golongan_darah')}>
                    <option value="">-- Pilih Golongan Darah --</option>
                    {GOLONGAN_DARAH.map((gd) => (
                      <option key={gd} value={gd}>{gd}</option>
                    ))}
                  </select>
                  {errors.golongan_darah && <p className="text-red-500 text-xs">{errors.golongan_darah.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* SECTION 2: Alamat Sesuai KTP */}
            <fieldset>
              <legend className={`text-[1.125em] font-bold pb-2 mb-6 border-b ${sectionHeadingClass}`}>
                📋 Alamat Sesuai KTP
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Provinsi - hardcode */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Provinsi</label>
                  <input
                    type="text"
                    value={PROVINSI_DEFAULT}
                    disabled
                    className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Kota - hardcode */}
                <div className="space-y-1.5">
                  <label className={labelClass}>Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={KOTA_DEFAULT}
                    disabled
                    className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Kecamatan - dynamic */}
                <div className="space-y-1.5">
                  <label htmlFor="kecamatan" className={labelClass}>
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <select id="kecamatan" className={selectClass(!!errors.kecamatan)} {...register('kecamatan')}>
                    <option value="">-- Pilih Kecamatan --</option>
                    {KECAMATAN.map((kec) => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
                  {errors.kecamatan && <p className="text-red-500 text-xs">{errors.kecamatan.message}</p>}
                </div>

                {/* Kelurahan/Desa - cascading */}
                <div className="space-y-1.5">
                  <label htmlFor="kelurahan_desa" className={labelClass}>
                    Kelurahan / Desa <span className="text-red-500">*</span>
                  </label>
                  <select id="kelurahan_desa" className={selectClass(!!errors.kelurahan_desa)} {...register('kelurahan_desa')}>
                    <option value="">-- Pilih Kelurahan/Desa --</option>
                    {desaOptions.map((desa) => (
                      <option key={desa} value={desa}>{desa}</option>
                    ))}
                  </select>
                  {errors.kelurahan_desa && <p className="text-red-500 text-xs">{errors.kelurahan_desa.message}</p>}
                  {!selectedKecamatan && <p className={`text-xs ${subLabelClass}`}>Pilih kecamatan terlebih dahulu</p>}
                </div>

                {/* Alamat */}
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="alamat_ktp" className={labelClass}>
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="alamat_ktp"
                    rows={2}
                    placeholder="Contoh: Jalan A Perum B No. 1111"
                    className={`w-full min-h-[44px] p-4 rounded-lg outline-none transition-all focus:ring-4 resize-y ${
                      isHighContrast
                        ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]'
                        : 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    {...register('alamat_ktp')}
                  />
                  {errors.alamat_ktp && <p className="text-red-500 text-xs">{errors.alamat_ktp.message}</p>}
                </div>

                {/* RT */}
                <div className="space-y-1.5">
                  <label htmlFor="rt" className={labelClass}>
                    RT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="rt"
                    placeholder="RT"
                    inputMode="numeric"
                    className={inputClass(!!errors.rt, false)}
                    {...register('rt')}
                  />
                  {errors.rt && <p className="text-red-500 text-xs">{errors.rt.message}</p>}
                </div>

                {/* RW */}
                <div className="space-y-1.5">
                  <label htmlFor="rw" className={labelClass}>
                    RW <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="rw"
                    placeholder="RW"
                    inputMode="numeric"
                    className={inputClass(!!errors.rw, false)}
                    {...register('rw')}
                  />
                  {errors.rw && <p className="text-red-500 text-xs">{errors.rw.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* SECTION 3: Alamat Saat Ini */}
            <fieldset>
              <legend className={`text-[1.125em] font-bold pb-2 mb-6 border-b ${sectionHeadingClass}`}>
                📋 Alamat Saat Ini
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="alamat_domisili" className={labelClass}>Alamat Saat Ini</label>
                  <textarea
                    id="alamat_domisili"
                    rows={3}
                    placeholder="Isi apabila saat ini anda tidak tinggal di alamat yang tertera pada KTP"
                    className={`w-full min-h-[44px] p-4 rounded-lg outline-none transition-all focus:ring-4 resize-y ${
                      isHighContrast
                        ? 'bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] placeholder:text-[#FFFF00] placeholder:opacity-80 focus:ring-[#FFFF00] focus:border-[#FFFF00]'
                        : 'bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    {...register('alamat_domisili')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="negara" className={labelClass}>Negara Saat Ini</label>
                  <input
                    type="text"
                    id="negara"
                    value={NEGARA_DEFAULT}
                    disabled
                    className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </fieldset>

            {/* SECTION 4: Lainnya */}
            <fieldset>
              <legend className={`text-[1.125em] font-bold pb-2 mb-6 border-b ${sectionHeadingClass}`}>
                📋 Lainnya
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Kode Referal */}
                <div className="md:col-span-2 space-y-1.5">
                  <label htmlFor="kode_referal" className={labelClass}>Kode Referal</label>
                  <input
                    type="text"
                    id="kode_referal"
                    placeholder="Masukkan kode referal di sini (jika ada)"
                    className={inputClass(false, false)}
                    {...register('kode_referal')}
                  />
                </div>

                {/* Agama */}
                <div className="space-y-1.5">
                  <label htmlFor="agama" className={labelClass}>
                    Agama <span className="text-red-500">*</span>
                  </label>
                  <select id="agama" className={selectClass(!!errors.agama)} {...register('agama')}>
                    <option value="">-- Pilih Agama --</option>
                    {AGAMA.map((a) => (
                      <option key={a} value={a}>{a.charAt(0) + a.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                  {errors.agama && <p className="text-red-500 text-xs">{errors.agama.message}</p>}
                </div>

                {/* Status Perkawinan */}
                <div className="space-y-1.5">
                  <label htmlFor="status_perkawinan" className={labelClass}>
                    Status Perkawinan <span className="text-red-500">*</span>
                  </label>
                  <select id="status_perkawinan" className={selectClass(!!errors.status_perkawinan)} {...register('status_perkawinan')}>
                    <option value="">-- Pilih Status --</option>
                    {STATUS_PERKAWINAN.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp === 'BELUM_KAWIN' ? 'Belum Kawin' : sp === 'CERAI_HIDUP' ? 'Cerai Hidup' : sp === 'CERAI_MATI' ? 'Cerai Mati' : sp.charAt(0) + sp.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  {errors.status_perkawinan && <p className="text-red-500 text-xs">{errors.status_perkawinan.message}</p>}
                </div>

                {/* Pekerjaan */}
                <div className="space-y-1.5">
                  <label htmlFor="pekerjaan" className={labelClass}>
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <select id="pekerjaan" className={selectClass(!!errors.pekerjaan)} {...register('pekerjaan')}>
                    <option value="">-- Pilih Pekerjaan --</option>
                    {PEKERJAAN.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.pekerjaan && <p className="text-red-500 text-xs">{errors.pekerjaan.message}</p>}
                </div>

                {/* Pendidikan Terakhir */}
                <div className="space-y-1.5">
                  <label htmlFor="pendidikan_terakhir" className={labelClass}>
                    Pendidikan Terakhir <span className="text-red-500">*</span>
                  </label>
                  <select id="pendidikan_terakhir" className={selectClass(!!errors.pendidikan_terakhir)} {...register('pendidikan_terakhir')}>
                    <option value="">-- Pilih Pendidikan --</option>
                    {PENDIDIKAN.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.pendidikan_terakhir && <p className="text-red-500 text-xs">{errors.pendidikan_terakhir.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Contoh: email@website.com"
                    autoComplete="email"
                    className={inputClass(!!errors.email, false)}
                    {...register('email')}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                {/* No WhatsApp */}
                <div className="space-y-1.5">
                  <label htmlFor="nomor_whatsapp" className={labelClass}>
                    No. Telp / HP / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="nomor_whatsapp"
                    placeholder="Contoh: 628123456789"
                    autoComplete="tel"
                    className={inputClass(!!errors.nomor_whatsapp, false)}
                    {...register('nomor_whatsapp')}
                  />
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className={subLabelClass}>Format: 62 diikuti 10-15 digit</span>
                    {phoneValue && phoneValue.length > 0 && !errors.nomor_whatsapp && (
                      <span className={isHighContrast ? 'text-[#FFFF00]' : 'text-green-600'}>✓</span>
                    )}
                    {errors.nomor_whatsapp && <span className="text-red-500 text-xs">{errors.nomor_whatsapp.message}</span>}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* SECTION 5: Dokumen */}
            <fieldset>
              <legend className={`text-[1.125em] font-bold pb-2 mb-6 border-b ${sectionHeadingClass}`}>
                📋 Dokumen
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload KTP */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Foto / Scan KTP <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:opacity-80 min-h-[150px] flex flex-col items-center justify-center ${
                      isHighContrast
                        ? 'border-[#FFFF00] bg-[#000000]'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => document.getElementById('ktp_input')?.click()}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('ktp_input')?.click(); }}
                    tabIndex={0}
                    role="button"
                    aria-label="Unggah foto KTP"
                  >
                    {ktpPreview ? (
                      <img src={ktpPreview} alt="Preview KTP" className="max-h-[120px] mx-auto rounded" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className={`text-sm ${subLabelClass}`}>Unggah Foto/Scan KTP</p>
                        <p className={`text-xs mt-1 ${subLabelClass}`}>Klik atau drag ke sini</p>
                      </>
                    )}
                    <input
                      id="ktp_input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setKtpFile, setKtpPreview, 'Foto KTP')}
                    />
                  </div>
                  <p className={`text-xs ${subLabelClass}`}>Maksimal 20MB. Format: JPEG, PNG, WebP</p>
                </div>

                {/* Upload Profile */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Foto Diri <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:opacity-80 min-h-[150px] flex flex-col items-center justify-center ${
                      isHighContrast
                        ? 'border-[#FFFF00] bg-[#000000]'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => document.getElementById('profile_input')?.click()}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('profile_input')?.click(); }}
                    tabIndex={0}
                    role="button"
                    aria-label="Unggah foto diri"
                  >
                    {profilePreview ? (
                      <img src={profilePreview} alt="Preview Foto" className="max-h-[120px] mx-auto rounded" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className={`text-sm ${subLabelClass}`}>Unggah Foto Diri</p>
                        <p className={`text-xs mt-1 ${subLabelClass}`}>Klik atau drag ke sini</p>
                      </>
                    )}
                    <input
                      id="profile_input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setProfileFile, setProfilePreview, 'Foto Diri')}
                    />
                  </div>
                  <p className={`text-xs ${subLabelClass}`}>Maksimal 20MB. Format: JPEG, PNG, WebP</p>
                </div>
              </div>
            </fieldset>

            {/* SECTION 6: Pernyataan */}
            <fieldset>
              <legend className={`text-[1.125em] font-bold pb-2 mb-6 border-b ${sectionHeadingClass}`}>
                📋 Pernyataan
              </legend>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 min-h-[20px] min-w-[20px] accent-blue-600"
                    {...register('not_committee')}
                  />
                  <span className={`text-sm ${isHighContrast ? 'text-[#FFFF00]' : 'text-gray-700 dark:text-slate-300'}`}>
                    Dengan ini saya menyatakan bahwa saya <strong>bukan</strong> merupakan pengurus dari partai politik lain.
                  </span>
                </label>
                {errors.not_committee && <p className="text-red-500 text-xs ml-8">{errors.not_committee.message}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 min-h-[20px] min-w-[20px] accent-blue-600"
                    {...register('agree')}
                  />
                  <span className={`text-sm ${isHighContrast ? 'text-[#FFFF00]' : 'text-gray-700 dark:text-slate-300'}`}>
                    Saya menyatakan bahwa semua data yang tertulis di atas ini adalah benar dan saya bertanggung jawab penuh atas keabsahan data tersebut.
                  </span>
                </label>
                {errors.agree && <p className="text-red-500 text-xs ml-8">{errors.agree.message}</p>}
              </div>
            </fieldset>

            {/* Submit */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={isPending}
                className={`min-h-[44px] px-10 py-4 font-bold text-[1.125em] rounded-full transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 ${
                  isHighContrast
                    ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#000000] focus:ring-[#FFFF00]'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-400'
                }`}
              >
                {isUploading ? (
                  <>Mengunggah gambar...</>
                ) : isPending ? (
                  <>Mengirim data...</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Kirim Data
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy Footer */}
          <div className="mt-10 pt-6 border-t border-current opacity-30">
            <p className={`text-xs text-center leading-relaxed ${subLabelClass}`}>
              Dengan mengirimkan formulir ini, Anda menyetujui bahwa data akan diproses
              sesuai kebijakan privasi DPD PKS Kabupaten Pamekasan. NIK dienkripsi dengan
              algoritma AES-256-GCM dan tidak dapat diakses oleh pihak yang tidak berwenang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
