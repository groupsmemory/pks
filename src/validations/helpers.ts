import { z } from 'zod';

export function formDataToObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = typeof value === 'string' ? value.trim() : value.toString().trim();
  }
  return obj;
}

export function parseFormData<T>(formData: FormData, schema: z.ZodSchema<T>): T {
  const obj = formDataToObject(formData);
  const result = schema.safeParse(obj);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new Error(firstError?.message || 'Validasi gagal');
  }
  return result.data;
}
