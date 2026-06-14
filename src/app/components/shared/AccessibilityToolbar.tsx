'use client';

interface Props {
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
}

export default function AccessibilityToolbar({
  isHighContrast,
  onToggleHighContrast,
  onDecreaseFont,
  onIncreaseFont,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-end mb-8 border-b pb-4 border-current">
      <button
        type="button"
        onClick={onToggleHighContrast}
        className={`min-h-[44px] min-w-[44px] px-4 font-bold rounded focus:ring-4 focus:outline-none transition-colors ${
          isHighContrast
            ? 'bg-[#FFFF00] text-[#000000] focus:ring-[#FFFF00]'
            : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-300'
        }`}
        aria-label="Toggle High Contrast Mode"
      >
        {isHighContrast ? 'Matikan Kontras Tinggi' : 'Kontras Tinggi'}
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDecreaseFont}
          className={`min-h-[44px] min-w-[44px] px-4 font-bold rounded focus:ring-4 focus:outline-none transition-colors ${
            isHighContrast
              ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] focus:ring-[#FFFF00]'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400'
          }`}
          aria-label="Perkecil Ukuran Teks"
        >
          A-
        </button>
        <button
          type="button"
          onClick={onIncreaseFont}
          className={`min-h-[44px] min-w-[44px] px-4 font-bold rounded focus:ring-4 focus:outline-none transition-colors ${
            isHighContrast
              ? 'bg-[#000000] text-[#FFFF00] border-2 border-[#FFFF00] focus:ring-[#FFFF00]'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400'
          }`}
          aria-label="Perbesar Ukuran Teks"
        >
          A+
        </button>
      </div>
    </div>
  );
}
