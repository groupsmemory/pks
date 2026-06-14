'use client';

import { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  highContrast?: boolean;
  options: Option[];
  placeholder?: string;
}

export default function SelectField({ label, error, highContrast, options, placeholder, id, ...selectProps }: Props) {
  const cls = highContrast
    ? 'w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 border-[#FFFF00] text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]'
    : `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${error ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-200 text-gray-900`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <select id={id} className={cls} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
