'use client';

import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  highContrast?: boolean;
  helpText?: React.ReactNode;
}

function inputClass(highContrast?: boolean, hasError?: boolean) {
  const extra = hasError
    ? highContrast ? 'border-red-400' : 'border-red-500'
    : highContrast ? 'border-[#FFFF00]' : 'border-gray-300';
  if (highContrast) {
    return `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-[#000000] border-2 ${extra} text-[#FFFF00] focus:ring-[#FFFF00] focus:border-[#FFFF00]`;
  }
  return `w-full min-h-[44px] px-4 rounded outline-none transition-all bg-white border-2 ${extra} focus:border-blue-500 focus:ring-blue-200 text-gray-900`;
}

export default function FormField({ label, error, highContrast, helpText, id, ...inputProps }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <input id={id} className={inputClass(highContrast, !!error)} {...inputProps} />
      {helpText && <div className="text-xs mt-1">{helpText}</div>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export { inputClass };
