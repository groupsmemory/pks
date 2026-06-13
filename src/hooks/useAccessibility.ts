'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FONT_SCALES, type FontScale } from '@/src/lib/constants';

const HC_KEY = 'accessibility_high_contrast';
const FS_KEY = 'accessibility_font_size';

export function useAccessibility() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [currentScale, setCurrentScale] = useState<FontScale>('scale-100');
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const savedContrast = localStorage.getItem(HC_KEY);
    if (savedContrast === 'true') {
      setIsHighContrast(true);
      root.classList.add('high-contrast');
    }

    const savedScale = localStorage.getItem(FS_KEY);
    if (savedScale && (FONT_SCALES as readonly string[]).includes(savedScale)) {
      setCurrentScale(savedScale as FontScale);
      root.classList.add(savedScale);
    } else {
      const activeScale = FONT_SCALES.find((s) => root.classList.contains(s));
      if (activeScale) setCurrentScale(activeScale);
    }

    observerRef.current = new MutationObserver(() => {
      const hasContrast = root.classList.contains('high-contrast');
      setIsHighContrast(hasContrast);

      const foundScale = FONT_SCALES.find((s) => root.classList.contains(s));
      if (foundScale) setCurrentScale(foundScale);
    });

    observerRef.current.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const toggleHighContrast = useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains('high-contrast');

    if (next) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    localStorage.setItem(HC_KEY, String(next));
    setIsHighContrast(next);
  }, []);

  const setScale = useCallback((scale: FontScale) => {
    const root = document.documentElement;
    FONT_SCALES.forEach((s) => root.classList.remove(s));
    root.classList.add(scale);
    localStorage.setItem(FS_KEY, scale);
    setCurrentScale(scale);
  }, []);

  const increaseFontSize = useCallback(() => {
    const idx = FONT_SCALES.indexOf(currentScale);
    if (idx < FONT_SCALES.length - 1) {
      setScale(FONT_SCALES[idx + 1]);
    }
  }, [currentScale, setScale]);

  const decreaseFontSize = useCallback(() => {
    const idx = FONT_SCALES.indexOf(currentScale);
    if (idx > 0) {
      setScale(FONT_SCALES[idx - 1]);
    }
  }, [currentScale, setScale]);

  const currentScaleIndex = FONT_SCALES.indexOf(currentScale);

  return {
    isHighContrast,
    toggleHighContrast,
    currentScale,
    setScale,
    increaseFontSize,
    decreaseFontSize,
    canIncreaseFont: currentScaleIndex < FONT_SCALES.length - 1,
    canDecreaseFont: currentScaleIndex > 0,
  };
}
