'use client';

import { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  highContrast?: boolean;
}

export default function TextAreaField({ label, error, highContrast, id, ...textareaProps }: Props) {
  const cls = highContrast
    ? 'w-full min-h-[44px] p-4 rounded outline-none resize-y transition-all bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
    : `w-full min-h-[44px] p-4 rounded outline-none resize-y transition-all bg-white border-2 ${error ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-200 text-gray-900`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <textarea id={id} className={cls} {...textareaProps} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
