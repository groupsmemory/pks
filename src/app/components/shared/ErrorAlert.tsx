'use client';

interface Props {
  message: string;
  title?: string;
  highContrast?: boolean;
}

export default function ErrorAlert({ message, title = 'Gagal', highContrast }: Props) {
  return (
    <div
      className={`mb-8 p-6 rounded-lg border-2 ${
        highContrast ? 'bg-[#000000] border-[#FFFF00] text-[#FFFF00]' : 'bg-red-50 border-red-300 text-red-800'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <p className="font-bold text-[1.125em]">{title}</p>
      <p className="mt-2">{message}</p>
    </div>
  );
}
