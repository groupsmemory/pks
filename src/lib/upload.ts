import { FILE_MAX_SIZE, FILE_ACCEPTED_TYPES } from './constants';

export interface FileUploadResult {
  base64: string;
  mimeType: string;
  sizeBytes: number;
}

export function validateAndEncodeFile(
  file: File,
  fieldName: string,
): FileUploadResult {
  if (!FILE_ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(
      `${fieldName}: Tipe file ${file.type} tidak didukung. Gunakan JPEG, PNG, atau WebP.`,
    );
  }

  if (file.size > FILE_MAX_SIZE) {
    throw new Error(
      `${fieldName}: Ukuran file maksimal 20MB. File Anda ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
    );
  }

  return {
    base64: '',
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
